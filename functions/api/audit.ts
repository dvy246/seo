// Cloudflare Pages Function: AI Readiness Checker (URL audit mode).
// POST /api/audit  body: { "url": "https://example.com" }
//
// - Server-side fetch (bypasses browser CORS) with a 10s timeout
// - SSRF guard: blocks private / link-local / metadata hostnames
// - Rate limit: 10 audits per IP per hour via KV (AUDIT_KV)
// - Cache: 24h per URL via KV (AUDIT_KV)
//
// Deploy requires a KV namespace bound as AUDIT_KV (see wrangler.toml).

import { buildChecks, calculateScores, type AuditSnapshot, type CrawlerView } from '../../src/lib/validator';
import {
  checkRateLimit,
  cacheGet,
  cachePut,
  json,
  cors,
  isPrivateHost,
  looksSuspiciousUrl,
  sha1,
} from '../_shared/guard';

interface Env {
  AUDIT_KV?: KVNamespace;
}

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24h

// --- HTML extraction (server side, mirrors src/lib/htmlExtract.ts) ----------

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

// --- Crawler comparison -------------------------------------------------------

const CRAWLER_UAS: Record<string, string> = {
  googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  facebook: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
};

const MAIN_UA = 'SerpCraft-Auditor/1.0 (+https://metaforge.app)';

// Redirect-guarded fetch: follows redirects manually (max maxHops), re-checking
// the SSRF guard on every hop, and returns the chain so it can be reported.
async function fetchPage(
  url: string,
  ua: string,
  signal: AbortSignal,
  maxHops = 5,
): Promise<{ status: number; finalUrl: string; body: string; headers: Headers; chain: { status: number; url: string }[] } | null> {
  let target = url;
  const chain: { status: number; url: string }[] = [];
  for (let hop = 0; hop <= maxHops; hop++) {
    const res = await fetch(target, {
      headers: { 'User-Agent': ua, Accept: 'text/html,application/xhtml+xml' },
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

function metaContent(html: string, attrName: 'name' | 'property', attrValue: string): string | null {
  const re = new RegExp(`<meta[^>]*${attrName}=["']${attrValue}["'][^>]*>`, 'i');
  const m = html.match(re);
  if (!m) return null;
  return getAttr(m[0], 'content') ?? null;
}

function extractCrawlerView(html: string, name: string, userAgent: string, httpStatus: number, finalUrl: string | null): CrawlerView {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonicalMatch = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return {
    name,
    userAgent,
    httpStatus,
    finalUrl,
    title: titleMatch ? titleMatch[1].trim() : null,
    description: metaContent(html, 'name', 'description'),
    canonical: canonicalMatch ? canonicalMatch[1] : null,
    ogImage: metaContent(html, 'property', 'og:image'),
    robots: metaContent(html, 'name', 'robots'),
    hasStructuredData: /<script\s+type=["']application\/ld\+json["']/i.test(html),
    hasHreflang: /hreflang/i.test(html),
  };
}

// --- Handler ----------------------------------------------------------------

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });

  let body: { url?: unknown; crawlers?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }
  const rawUrl = typeof body?.url === 'string' ? body.url.trim() : '';
  if (!rawUrl) return json({ error: 'url is required.' }, 400);
  if (looksSuspiciousUrl(rawUrl)) return json({ error: 'URL scheme not allowed.' }, 400);

  let normalizedUrl: string;
  try {
    const u = new URL(rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl}`);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad scheme');
    if (isPrivateHost(u.hostname)) return json({ error: 'URL points to a private or local address.' }, 400);
    normalizedUrl = u.toString();
  } catch {
    return json({ error: 'Invalid URL format.' }, 400);
  }

  // Rate limit by IP (CF-Connecting-IP)
  const rateLimited = await checkRateLimit(env, request, { limit: 10, windowSeconds: 3600, scope: 'audit' });
  if (rateLimited) return rateLimited;

  // Optional crawler comparison views (max 2, known UAs only)
  const crawlersRaw = body?.crawlers;
  const crawlers: string[] = Array.isArray(crawlersRaw)
    ? crawlersRaw.filter((c): c is string => typeof c === 'string' && c in CRAWLER_UAS).slice(0, 2)
    : [];

  // Cache lookup (keyed on URL + crawler views so cached reports stay consistent)
  const cacheKey = `audit:cache:${await sha1(normalizedUrl + '|' + crawlers.join(','))}`;
  const cached = await cacheGet<Record<string, unknown>>(env, cacheKey);
  if (cached) {
    return json({ ...cached, cached: true });
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const llmsRes = await fetch(new URL('/llms.txt', normalizedUrl).toString(), {
      headers: { 'User-Agent': MAIN_UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    }).catch(() => null);

    const page = await fetchPage(normalizedUrl, MAIN_UA, controller.signal);
    if (!page) {
      return json({ error: 'Too many redirects (more than 5) or a redirect target was blocked.' }, 400);
    }

    // Extract the page regardless of status code — a 404 or 5xx response is
    // itself the diagnosis.
    const html = page.body;
    const loadTimeMs = Date.now() - startTime;
    const llmsTxtFound = llmsRes ? llmsRes.ok : null;

    const headers: Record<string, string> = {};
    for (const key of ['x-robots-tag', 'content-type', 'cache-control', 'x-frame-options', 'content-language', 'link']) {
      const v = page.headers.get(key);
      if (v) headers[key] = v;
    }

    const snapshot = extractSnapshot(html, normalizedUrl, llmsTxtFound, loadTimeMs, page.status, {
      finalUrl: page.finalUrl,
      contentType: page.headers.get('content-type') || null,
      headers,
      redirectChain: page.chain,
    });

    // Crawler comparison views (extra fetches, guarded against SSRF redirects)
    const crawlerViews: CrawlerView[] = [];
    for (const name of crawlers) {
      const view = await fetchPage(normalizedUrl, CRAWLER_UAS[name], AbortSignal.timeout(8000), 3);
      if (view) {
        crawlerViews.push(extractCrawlerView(view.body, name, CRAWLER_UAS[name], view.status, view.finalUrl));
      } else {
        crawlerViews.push({ name, userAgent: CRAWLER_UAS[name], httpStatus: 0, finalUrl: null, title: null, description: null, canonical: null, ogImage: null, robots: null, hasStructuredData: false, hasHreflang: false });
      }
    }

    const checks = buildChecks(snapshot);
    const scores = calculateScores(checks);

    const payload = { ...snapshot, checks, scores, crawlerViews, cached: false };

    await cachePut(env, cacheKey, payload, CACHE_TTL_SECONDS);

    return json(payload);
  } catch (err) {
    const msg = err instanceof Error && err.name === 'AbortError' ? 'Request timed out (10s).' : 'Audit failed. Please try again.';
    return json({ error: msg }, 500);
  } finally {
    clearTimeout(timer);
  }
};

export const onRequest: PagesFunction<Env> = async ({ request }) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  return json({ error: 'Method not allowed. Use POST.' }, 405);
};
