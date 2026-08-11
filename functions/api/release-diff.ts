// Cloudflare Pages Function: SEO Release Diff (URL comparison mode).
// POST /api/release-diff  body: { "urlA": "https://staging.example.com", "urlB": "https://example.com" }
//
// - Server-side fetch for both URLs with 10s timeout
// - SSRF guard: blocks private / link-local / metadata hostnames
// - Rate limit: 10 diffs per IP per hour via KV (AUDIT_KV)
// - Cache: 24h per URL pair via KV (AUDIT_KV)
//
// Deploy requires a KV namespace bound as AUDIT_KV (see wrangler.toml).

import { type AuditSnapshot } from '../../src/lib/validator';
import { buildReleaseDiff, reportToMarkdown, type ReleaseDiffReport } from '../../src/lib/releaseDiff';
import {
  checkRateLimit,
  cacheGet,
  cachePut,
  json,
  cors,
  isPrivateHost,
  sha1,
  normalizeHttpUrl,
} from '../_shared/guard';

interface Env {
  AUDIT_KV?: KVNamespace;
}

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h
const MAX_HOPS = 5;
const FETCH_TIMEOUT_MS = 10_000;

// --- HTML extraction (server side, mirrors src/lib/htmlExtract.ts & audit.ts) ---

function getAttr(tag: string, attr: string): string | undefined {
  const m = tag.match(new RegExp(`${attr}=["']([^"']*)["']`, 'i'));
  return m ? m[1] : undefined;
}

function extractSnapshot(
  html: string,
  url: string,
  llmsTxtFound: boolean | null,
  loadTimeMs: number,
  httpStatus: number,
  opts: { finalUrl: string; contentType: string | null; headers: Record<string, string>; redirectChain: { status: number; url: string }[] },
): AuditSnapshot {
  const result: Partial<AuditSnapshot> = {
    url,
    hasLlmsTxt: llmsTxtFound,
    loadTimeMs,
    httpStatus,
    finalUrl: opts.finalUrl,
    contentType: opts.contentType,
    headers: opts.headers,
    redirectChain: opts.redirectChain,
  };

  const titleMatches = html.match(/<title[^>]*>[\s\S]*?<\/title>/gi) || [];
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  result.title = titleMatch ? titleMatch[1].trim() : null;
  result.titleTagCount = titleMatches.length;

  const metas: Record<string, string> = {};
  let descriptionCount = 0;
  const metaRegex = /<meta\s[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = metaRegex.exec(html)) !== null) {
    const tag = match[0];
    const name = getAttr(tag, 'name')?.toLowerCase();
    const property = getAttr(tag, 'property')?.toLowerCase();
    const content = getAttr(tag, 'content');
    if (name === 'description') descriptionCount++;
    if (!content) continue;
    if (name) metas[name] = content;
    if (property) metas[property] = content;
  }
  result.descriptionTagCount = descriptionCount;
  result.description = metas['description'] || null;
  result.robots = metas['robots'] || null;
  result.ogTitle = metas['og:title'] || null;
  result.ogDescription = metas['og:description'] || null;
  result.ogImage = metas['og:image'] || null;
  result.ogType = metas['og:type'] || null;
  result.twitterCard = metas['twitter:card'] || null;
  result.twitterTitle = metas['twitter:title'] || null;
  result.twitterDescription = metas['twitter:description'] || null;
  result.twitterImage = metas['twitter:image'] || null;

  const canonicalMatch = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  result.canonical = canonicalMatch ? canonicalMatch[1] : null;

  const sdTypes: string[] = [];
  const sdRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let sdMatch: RegExpExecArray | null;
  while ((sdMatch = sdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(sdMatch[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const t = item?.['@type'];
        if (t) sdTypes.push(String(t));
        if (item?.['@graph'] && Array.isArray(item['@graph'])) {
          for (const g of item['@graph']) {
            if (g?.['@type']) sdTypes.push(String(g['@type']));
          }
        }
      }
    } catch {
      // invalid JSON-LD
    }
  }
  result.hasStructuredData = sdTypes.length > 0;
  result.structuredDataTypes = [...new Set(sdTypes)];

  result.hasHreflang = /hreflang/i.test(html);
  result.hasFavicon = /<link\s[^>]*rel=["'](?:shortcut )?icon["']/i.test(html);
  result.hasViewport = 'viewport' in metas;
  const langMatch = html.match(/<html\s[^>]*lang=["']([^"']+)["']/i);
  result.hasLangAttribute = !!langMatch;
  result.htmlLang = langMatch ? langMatch[1] : null;

  const countTags = (tag: string) => (html.match(new RegExp(`<${tag}[^>]*>`, 'gi')) || []).length;
  result.h1Count = countTags('h1');
  result.h2Count = countTags('h2');

  const imgs = html.match(/<img\s[^>]*>/gi) || [];
  let withoutAlt = 0;
  for (const img of imgs) {
    if (!/alt\s*=\s*["']([^"']*)["']/i.test(img) || /alt\s*=\s*["']["']/i.test(img)) withoutAlt++;
  }
  result.imageCount = imgs.length;
  result.imagesWithoutAlt = withoutAlt;

  const links = html.match(/<a\s+[^>]*href=["']([^"']+)["']/gi) || [];
  let internal = 0;
  let external = 0;
  let origin = '';
  try {
    origin = new URL(url).origin;
  } catch {
    // keep 0/0
  }
  for (const linkTag of links) {
    const hrefMatch = linkTag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) continue;
    try {
      const resolved = new URL(href, url).origin;
      if (origin && resolved === origin) internal++;
      else external++;
    } catch {
      // skip invalid
    }
  }
  result.internalLinks = internal;
  result.externalLinks = external;

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  result.wordCount = text ? text.split(' ').filter(Boolean).length : 0;

  return result as AuditSnapshot;
}

// --- Fetch with redirect chain & SSRF guard ---

const MAIN_UA = 'SerpCraft-ReleaseDiff/1.0 (+https://serpcraft.app)';

async function fetchPage(
  url: string,
  signal: AbortSignal,
  maxHops = MAX_HOPS,
): Promise<{ status: number; finalUrl: string; body: string; headers: Headers; chain: { status: number; url: string }[] } | null> {
  let target = url;
  const chain: { status: number; url: string }[] = [];
  for (let hop = 0; hop <= maxHops; hop++) {
    const res = await fetch(target, {
      headers: { 'User-Agent': MAIN_UA, Accept: 'text/html,application/xhtml+xml' },
      redirect: 'manual',
      signal,
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('Location');
      if (!loc) return { status: res.status, finalUrl: target, body: '', headers: res.headers, chain };
      chain.push({ status: res.status, url: target });
      target = new URL(loc, target).toString();
      if (isPrivateHost(new URL(target).hostname)) return null;
      continue;
    }
    const body = await res.text().catch(() => '');
    return { status: res.status, finalUrl: res.url, body, headers: res.headers, chain };
  }
  return null; // too many hops
}

async function fetchSnapshot(url: string): Promise<AuditSnapshot | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const start = Date.now();
    const result = await fetchPage(url, controller.signal);
    const loadTimeMs = Date.now() - start;

    if (!result) return null;

    const headers: Record<string, string> = {};
    result.headers.forEach((v, k) => { headers[k] = v; });

    const contentType = headers['content-type'] || null;

    const snapshot = extractSnapshot(
      result.body,
      url,
      null, // llms.txt check skipped in v1
      loadTimeMs,
      result.status,
      {
        finalUrl: result.finalUrl,
        contentType,
        headers,
        redirectChain: result.chain,
      },
    );

    return snapshot;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- Cache key helpers ---

async function cacheKey(urlA: string, urlB: string): Promise<string> {
  const a = await sha1(urlA);
  const b = await sha1(urlB);
  return `diff:${a}:${b}`;
}

// --- Main handler ---

export async function onRequestPost(context: { request: Request; env: { AUDIT_KV: KVNamespace } }): Promise<Response> {
  const { request, env } = context;

  // Rate limit: 10 diffs/hour/IP
  const rateLimited = await checkRateLimit(env, request, {
    limit: 10,
    windowSeconds: 3600,
    scope: 'release-diff',
  });
  if (rateLimited) return new Response(null, { status: rateLimited.status, headers: { ...rateLimited.headers } });

  let body: { urlA: string; urlB: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { urlA, urlB } = body;
  if (!urlA?.trim() || !urlB?.trim()) {
    return json({ error: 'Both urlA and urlB are required' }, 400);
  }

  // Validate and normalize URLs
  const normA = normalizeHttpUrl(urlA);
  const normB = normalizeHttpUrl(urlB);
  if ('error' in normA) return json({ error: `urlA: ${normA.error}` }, normA.status);
  if ('error' in normB) return json({ error: `urlB: ${normB.error}` }, normB.status);

  // Cache check
  const cacheKeyStr = await cacheKey(normA.url, normB.url);
  const cached = await cacheGet<ReleaseDiffReport>(env, cacheKeyStr);
  if (cached) {
    return json({ ...cached, cached: true });
  }

  // Fetch both URLs in parallel
  const [snapshotA, snapshotB] = await Promise.all([
    fetchSnapshot(normA.url),
    fetchSnapshot(normB.url),
  ]);

  if (!snapshotA || !snapshotB) {
    return json({ error: 'Failed to fetch one or both URLs (timeout, SSRF block, or network error)' }, 502);
  }

  // Build diff report
  const report = buildReleaseDiff(snapshotA, snapshotB);

  // Cache the result
  await cachePut(env, cacheKeyStr, report, CACHE_TTL_SECONDS);

  return json(report);
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: cors() });
}