// Client-side HTML extraction for the AI Readiness Checker (paste-HTML mode).
// Regex-based, DOM-free, mirrors the server-side extractor in functions/api/audit.ts.

import type { AuditSnapshot } from '@/lib/validator';

function getAttr(tag: string, attr: string): string | undefined {
  const m = tag.match(new RegExp(`${attr}=["']([^"']*)["']`, 'i'));
  return m ? m[1] : undefined;
}

export function extractSnapshotFromHtml(html: string, sourceUrl = 'https://example.com/'): AuditSnapshot {
  const result: Partial<AuditSnapshot> = { url: sourceUrl };

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  result.title = titleMatch ? titleMatch[1].trim() : null;

  // Meta tags
  const metas: Record<string, string> = {};
  const metaRegex = /<meta\s[^>]*>/gi;
  let match: RegExpExecArray | null;
  while ((match = metaRegex.exec(html)) !== null) {
    const tag = match[0];
    const name = getAttr(tag, 'name')?.toLowerCase();
    const property = getAttr(tag, 'property')?.toLowerCase();
    const content = getAttr(tag, 'content');
    if (!content) continue;
    if (name) metas[name] = content;
    if (property) metas[property] = content;
  }
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

  // Canonical
  const canonicalMatch = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  result.canonical = canonicalMatch ? canonicalMatch[1] : null;

  // Structured data
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

  // Images & alt text
  const imgs = html.match(/<img\s[^>]*>/gi) || [];
  let withoutAlt = 0;
  for (const img of imgs) {
    if (!/alt\s*=\s*["']([^"']*)["']/i.test(img) || /alt\s*=\s*["']["']/i.test(img)) withoutAlt++;
  }
  result.imageCount = imgs.length;
  result.imagesWithoutAlt = withoutAlt;

  // Links (internal vs external)
  const links = html.match(/<a\s+[^>]*href=["']([^"']+)["']/gi) || [];
  let internal = 0;
  let external = 0;
  let origin = '';
  try {
    origin = new URL(sourceUrl).origin;
  } catch {
    // keep 0/0
  }
  for (const linkTag of links) {
    const hrefMatch = linkTag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) continue;
    try {
      const resolved = new URL(href, sourceUrl).origin;
      if (origin && resolved === origin) internal++;
      else external++;
    } catch {
      // skip invalid
    }
  }
  result.internalLinks = internal;
  result.externalLinks = external;

  // Word count (scripts/styles stripped)
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  result.wordCount = text ? text.split(' ').filter(Boolean).length : 0;

  result.loadTimeMs = 0;
  result.httpStatus = 0;
  result.hasLlmsTxt = null;

  return result as AuditSnapshot;
}
