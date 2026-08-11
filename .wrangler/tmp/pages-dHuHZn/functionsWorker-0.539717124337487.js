var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../src/lib/validator.ts
function normalizeComparePath(u) {
  try {
    const parsed = new URL(u);
    const path = parsed.pathname.replace(/\/+$/, "").toLowerCase() || "/";
    return path + parsed.search;
  } catch {
    return u.replace(/\/+$/, "").toLowerCase();
  }
}
__name(normalizeComparePath, "normalizeComparePath");
function buildChecks(s) {
  const checks = [];
  const status = s.httpStatus ?? 0;
  if (status === 0) {
    checks.push({ category: "SEO", label: "HTTP Status", status: "info", message: "HTTP status not measured (paste-HTML mode).", impact: "medium", scored: false });
  } else if (status >= 200 && status < 300) {
    checks.push({ category: "SEO", label: "HTTP Status", status: "pass", message: `Page returns HTTP ${status}.`, impact: "high", evidence: `HTTP ${status}` });
  } else if (status >= 400 && status < 500) {
    checks.push({ category: "SEO", label: "HTTP Status", status: "error", message: `Page returns HTTP ${status} \u2014 search engines will not index an error page.`, impact: "high", evidence: `HTTP ${status}` });
  } else if (status >= 500) {
    checks.push({ category: "SEO", label: "HTTP Status", status: "error", message: `Page returns HTTP ${status} \u2014 a server error.`, impact: "high", evidence: `HTTP ${status}` });
  } else {
    checks.push({ category: "SEO", label: "HTTP Status", status: "warning", message: `Page responds with HTTP ${status}.`, impact: "high", evidence: `HTTP ${status}` });
  }
  const hops = s.redirectChain || [];
  if (hops.length > 0) {
    checks.push({
      category: "SEO",
      label: "Redirect Chain",
      status: hops.length > 2 ? "warning" : "pass",
      message: hops.length > 2 ? `${hops.length} redirects before the final URL \u2014 each hop slows crawlers and dilutes authority.` : `${hops.length} redirect${hops.length === 1 ? "" : "s"} (HTTP ${hops.map((h) => h.status).join(", ")}) \u2014 acceptable if permanent (301).`,
      impact: "medium",
      evidence: hops.map((h) => `${h.status}  ${h.url}`).join("\n")
    });
  } else if (status === 0) {
    checks.push({ category: "SEO", label: "Redirect Chain", status: "pass", message: "No redirects (paste-HTML mode).", impact: "low", scored: false });
  } else {
    checks.push({ category: "SEO", label: "Redirect Chain", status: "pass", message: "No redirects \u2014 the requested URL is served directly.", impact: "medium" });
  }
  if (s.title) {
    const len = s.title.length;
    if (len >= 30 && len <= 60) checks.push({ category: "SEO", label: "Title Tag", status: "pass", message: `Title is ${len} characters \u2014 optimal range.`, impact: "high", evidence: s.title });
    else if (len < 30) checks.push({ category: "SEO", label: "Title Tag", status: "warning", message: `Title is ${len} chars \u2014 too short (aim for 30-60).`, impact: "high", evidence: s.title });
    else checks.push({ category: "SEO", label: "Title Tag", status: "warning", message: `Title is ${len} chars \u2014 too long, Google truncates at ~60.`, impact: "high", evidence: s.title });
  } else {
    checks.push({ category: "SEO", label: "Title Tag", status: "error", message: "No title tag found.", impact: "high" });
  }
  if ((s.titleTagCount ?? 1) > 1) {
    checks.push({ category: "SEO", label: "Duplicate Title Tag", status: "error", message: `${s.titleTagCount} <title> tags found \u2014 crawlers only read the first.`, impact: "high", evidence: `${s.titleTagCount} <title> tags` });
  }
  if (s.description) {
    const len = s.description.length;
    if (len >= 70 && len <= 160) checks.push({ category: "SEO", label: "Meta Description", status: "pass", message: `Description is ${len} characters \u2014 optimal range.`, impact: "high", evidence: s.description });
    else if (len < 70) checks.push({ category: "SEO", label: "Meta Description", status: "warning", message: `Description is ${len} chars \u2014 too short (aim for 70-160).`, impact: "high", evidence: s.description });
    else checks.push({ category: "SEO", label: "Meta Description", status: "warning", message: `Description is ${len} chars \u2014 too long, truncates at ~160.`, impact: "high", evidence: s.description });
  } else {
    checks.push({ category: "SEO", label: "Meta Description", status: "error", message: "No meta description found. Google may generate its own from page text.", impact: "high" });
  }
  if ((s.descriptionTagCount ?? 1) > 1) {
    checks.push({ category: "SEO", label: "Duplicate Description", status: "error", message: `${s.descriptionTagCount} meta description tags found \u2014 crawlers only read the first.`, impact: "high", evidence: `${s.descriptionTagCount} meta description tags` });
  }
  if (s.canonical) {
    checks.push({ category: "SEO", label: "Canonical URL", status: "pass", message: "Canonical URL is set.", impact: "medium", evidence: s.canonical });
    if (s.finalUrl && normalizeComparePath(s.canonical) !== normalizeComparePath(s.finalUrl)) {
      checks.push({
        category: "SEO",
        label: "Canonical vs Final URL",
        status: "warning",
        message: "The canonical points to a different page than the one actually served. Verify this is intentional \u2014 Google may index the served URL instead.",
        impact: "high",
        evidence: `canonical: ${s.canonical}
final URL: ${s.finalUrl}`
      });
    }
    if (s.robots && s.robots.toLowerCase().includes("noindex")) {
      checks.push({
        category: "Machine Readability",
        label: "Canonical + noindex Conflict",
        status: "error",
        message: "A canonical is set but the page is also noindexed \u2014 the canonical cannot consolidate signals for a page engines are told to drop.",
        impact: "high",
        evidence: `canonical: ${s.canonical}
robots: ${s.robots}`
      });
    }
  } else {
    checks.push({ category: "SEO", label: "Canonical URL", status: "warning", message: "No canonical URL found. Risk of duplicate content issues.", impact: "medium" });
  }
  if (s.h1Count === 1) checks.push({ category: "SEO", label: "H1 Tag", status: "pass", message: "Exactly one H1 tag found.", impact: "medium" });
  else if (s.h1Count === 0) checks.push({ category: "SEO", label: "H1 Tag", status: "error", message: "No H1 tag found. Every page needs exactly one.", impact: "medium" });
  else checks.push({ category: "SEO", label: "H1 Tag", status: "warning", message: `${s.h1Count} H1 tags found. Use exactly one.`, impact: "medium" });
  if ((s.imagesWithoutAlt ?? 0) === 0 && (s.imageCount ?? 0) > 0) checks.push({ category: "SEO", label: "Image Alt Text", status: "pass", message: "All images have alt text.", impact: "medium" });
  else if ((s.imagesWithoutAlt ?? 0) > 0) checks.push({ category: "SEO", label: "Image Alt Text", status: "warning", message: `${s.imagesWithoutAlt} of ${s.imageCount} images missing alt text.`, impact: "medium" });
  if (s.ogTitle && s.ogDescription && s.ogImage) checks.push({ category: "Social", label: "Open Graph", status: "pass", message: "Complete OG tags (title, description, image).", impact: "high", evidence: [s.ogTitle, s.ogDescription, s.ogImage].filter(Boolean).join("\n") });
  else if (s.ogTitle || s.ogDescription || s.ogImage) checks.push({ category: "Social", label: "Open Graph", status: "warning", message: "Partial OG tags. Missing some of: title, description, image.", impact: "high" });
  else checks.push({ category: "Social", label: "Open Graph", status: "error", message: "No Open Graph tags found. Social shares show blank previews.", impact: "high" });
  if (s.ogImage && !/^https?:\/\//i.test(s.ogImage)) {
    checks.push({ category: "Social", label: "OG Image URL", status: "error", message: "og:image is a relative URL \u2014 Facebook, X, and LinkedIn require absolute URLs.", impact: "high", evidence: s.ogImage });
  } else if (s.ogImage) {
    checks.push({ category: "Social", label: "OG Image URL", status: "pass", message: "og:image is an absolute URL.", impact: "medium", evidence: s.ogImage });
  }
  if (s.ogTitle && s.title && s.ogTitle.trim().toLowerCase() !== s.title.trim().toLowerCase()) {
    checks.push({ category: "Social", label: "OG Title vs Page Title", status: "warning", message: "og:title differs from <title> \u2014 social previews show a different headline than search results.", impact: "medium", evidence: `og:title: ${s.ogTitle}
<title>: ${s.title}` });
  }
  if (s.twitterCard && s.twitterTitle) checks.push({ category: "Social", label: "Twitter Cards", status: "pass", message: "Twitter Card tags detected.", impact: "medium" });
  else checks.push({ category: "Social", label: "Twitter Cards", status: "warning", message: "Missing Twitter Card tags. X shares won't show rich previews.", impact: "medium" });
  if (s.hasStructuredData) checks.push({ category: "Machine Readability", label: "Structured Data", status: "pass", message: `JSON-LD found: ${(s.structuredDataTypes || []).join(", ") || "unknown type"}. Enables rich results and helps engines understand the page.`, impact: "high" });
  else checks.push({ category: "Machine Readability", label: "Structured Data", status: "warning", message: "No JSON-LD structured data. The page is ineligible for rich results (FAQ, review stars, breadcrumbs).", impact: "medium" });
  if (s.hasLlmsTxt === true) checks.push({ category: "Machine Readability", label: "llms.txt", status: "pass", message: "llms.txt found at site root \u2014 some AI crawlers (GPTBot, PerplexityBot, ClaudeBot) read it. Google states it is not required for Search.", impact: "low", scored: false, evidence: "llms.txt found at site root" });
  else if (s.hasLlmsTxt === false) checks.push({ category: "Machine Readability", label: "llms.txt", status: "info", message: "No llms.txt file. Optional \u2014 Google says it is not needed for Search or AI Overviews, though some AI crawlers do read it.", impact: "low", scored: false });
  else checks.push({ category: "Machine Readability", label: "llms.txt", status: "info", message: "Could not verify llms.txt (redirect or error). Optional file \u2014 it does not affect Google ranking.", impact: "low", scored: false });
  if (s.robots && s.robots.toLowerCase().includes("noindex")) checks.push({ category: "Machine Readability", label: "Robots Directive", status: "error", message: "Page is blocked from indexing (noindex). It cannot appear in search results.", impact: "high", evidence: s.robots });
  else checks.push({ category: "Machine Readability", label: "Robots Directive", status: "pass", message: "Page is indexable.", impact: "high" });
  if ((s.wordCount ?? 0) >= 300) checks.push({ category: "Machine Readability", label: "Content Depth", status: "pass", message: `${s.wordCount} words of content detected.`, impact: "medium" });
  else checks.push({ category: "Machine Readability", label: "Content Depth", status: "warning", message: `Only ${s.wordCount ?? 0} words \u2014 thin content rarely earns rankings or citations.`, impact: "medium" });
  if (s.hasHreflang) checks.push({ category: "Machine Readability", label: "Hreflang", status: "pass", message: "Hreflang tags detected for international targeting.", impact: "medium" });
  else checks.push({ category: "Machine Readability", label: "Hreflang", status: "warning", message: "No hreflang tags. Multilingual sites risk duplicate-content confusion.", impact: "medium" });
  if (s.hasViewport) checks.push({ category: "Accessibility", label: "Viewport Meta", status: "pass", message: "Viewport meta tag is set.", impact: "high" });
  else checks.push({ category: "Accessibility", label: "Viewport Meta", status: "error", message: "No viewport meta tag. Page won't render properly on mobile.", impact: "high" });
  if (s.hasLangAttribute) checks.push({ category: "Accessibility", label: "Language Attribute", status: "pass", message: `HTML lang attribute set to "${s.htmlLang}".`, impact: "medium" });
  else checks.push({ category: "Accessibility", label: "Language Attribute", status: "warning", message: "No lang attribute on <html>. Screen readers and search engines need it.", impact: "medium" });
  if (s.hasFavicon) checks.push({ category: "Accessibility", label: "Favicon", status: "pass", message: "Favicon detected.", impact: "low" });
  else checks.push({ category: "Accessibility", label: "Favicon", status: "warning", message: "No favicon found.", impact: "low" });
  return checks;
}
__name(buildChecks, "buildChecks");
function calculateScores(checks) {
  const weightMap = { high: 3, medium: 2, low: 1 };
  const categories = ["SEO", "Social", "Machine Readability", "Accessibility"];
  const categoryScores = {};
  for (const cat of categories) {
    const catChecks = checks.filter((c) => c.category === cat && c.scored !== false);
    const totalWeight = catChecks.reduce((sum, c) => sum + weightMap[c.impact], 0);
    const passWeight = catChecks.filter((c) => c.status === "pass").reduce((sum, c) => sum + weightMap[c.impact], 0);
    const warnWeight = catChecks.filter((c) => c.status === "warning").reduce((sum, c) => sum + weightMap[c.impact] * 0.5, 0);
    categoryScores[cat] = totalWeight > 0 ? Math.round((passWeight + warnWeight) / totalWeight * 100) : 0;
  }
  const overall = Math.round(
    categoryScores["SEO"] * 0.35 + categoryScores["Social"] * 0.2 + categoryScores["Machine Readability"] * 0.3 + categoryScores["Accessibility"] * 0.15
  );
  return {
    overall,
    seo: categoryScores["SEO"],
    social: categoryScores["Social"],
    machineReadability: categoryScores["Machine Readability"],
    accessibility: categoryScores["Accessibility"]
  };
}
__name(calculateScores, "calculateScores");

// _shared/guard.ts
var CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};
function cors() {
  return CORS;
}
__name(cors, "cors");
function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: CORS });
}
__name(json, "json");
function isPrivateHost(hostname) {
  const h = hostname.toLowerCase().replace(/\.$/, "");
  if (h === "localhost" || h === "::1" || h === "0.0.0.0") return true;
  if (h.endsWith(".local") || h.endsWith(".internal") || h.endsWith(".lan")) return true;
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(h);
  if (isIp) {
    const parts = h.split(".").map(Number);
    if (parts.some((p) => p > 255)) return true;
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 198 && (b === 18 || b === 19)) return true;
  }
  return false;
}
__name(isPrivateHost, "isPrivateHost");
function looksSuspiciousUrl(raw) {
  const lower = raw.toLowerCase();
  if (lower.startsWith("file:") || lower.startsWith("gopher:") || lower.startsWith("ftp:")) return true;
  return false;
}
__name(looksSuspiciousUrl, "looksSuspiciousUrl");
async function checkRateLimit(env, request, opts) {
  if (!env.AUDIT_KV) return null;
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = `rl:${opts.scope}:${ip}`;
  const count = Number(await env.AUDIT_KV.get(key) || "0");
  if (count >= opts.limit) {
    return json({ error: `Rate limit reached (${opts.limit} requests per ${Math.round(opts.windowSeconds / 60)} minutes). Please try again later.` }, 429);
  }
  await env.AUDIT_KV.put(key, String(count + 1), { expirationTtl: opts.windowSeconds });
  return null;
}
__name(checkRateLimit, "checkRateLimit");
async function cacheGet(env, key) {
  if (!env.AUDIT_KV) return null;
  try {
    return await env.AUDIT_KV.get(key, "json");
  } catch {
    return null;
  }
}
__name(cacheGet, "cacheGet");
async function cachePut(env, key, value, ttlSeconds) {
  if (!env.AUDIT_KV) return;
  await env.AUDIT_KV.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds });
}
__name(cachePut, "cachePut");
async function sha1(input) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
__name(sha1, "sha1");

// api/audit.ts
var CACHE_TTL_SECONDS = 60 * 60 * 24;
function getAttr(tag, attr) {
  const m = tag.match(new RegExp(`${attr}=["']([^"']*)["']`, "i"));
  return m ? m[1] : void 0;
}
__name(getAttr, "getAttr");
function extractSnapshot(html, url, llmsTxtFound, loadTimeMs, httpStatus, opts) {
  const result = {
    url,
    hasLlmsTxt: llmsTxtFound,
    loadTimeMs,
    httpStatus,
    finalUrl: opts.finalUrl,
    contentType: opts.contentType,
    headers: opts.headers,
    redirectChain: opts.redirectChain
  };
  const titleMatches = html.match(/<title[^>]*>[\s\S]*?<\/title>/gi) || [];
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  result.title = titleMatch ? titleMatch[1].trim() : null;
  result.titleTagCount = titleMatches.length;
  const metas = {};
  let descriptionCount = 0;
  const metaRegex = /<meta\s[^>]*>/gi;
  let match2;
  while ((match2 = metaRegex.exec(html)) !== null) {
    const tag = match2[0];
    const name = getAttr(tag, "name")?.toLowerCase();
    const property = getAttr(tag, "property")?.toLowerCase();
    const content = getAttr(tag, "content");
    if (name === "description") descriptionCount++;
    if (!content) continue;
    if (name) metas[name] = content;
    if (property) metas[property] = content;
  }
  result.descriptionTagCount = descriptionCount;
  result.description = metas["description"] || null;
  result.robots = metas["robots"] || null;
  result.ogTitle = metas["og:title"] || null;
  result.ogDescription = metas["og:description"] || null;
  result.ogImage = metas["og:image"] || null;
  result.ogType = metas["og:type"] || null;
  result.twitterCard = metas["twitter:card"] || null;
  result.twitterTitle = metas["twitter:title"] || null;
  result.twitterDescription = metas["twitter:description"] || null;
  result.twitterImage = metas["twitter:image"] || null;
  const canonicalMatch = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  result.canonical = canonicalMatch ? canonicalMatch[1] : null;
  const sdTypes = [];
  const sdRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let sdMatch;
  while ((sdMatch = sdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(sdMatch[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const t = item?.["@type"];
        if (t) sdTypes.push(String(t));
        if (item?.["@graph"] && Array.isArray(item["@graph"])) {
          for (const g of item["@graph"]) {
            if (g?.["@type"]) sdTypes.push(String(g["@type"]));
          }
        }
      }
    } catch {
    }
  }
  result.hasStructuredData = sdTypes.length > 0;
  result.structuredDataTypes = [...new Set(sdTypes)];
  result.hasHreflang = /hreflang/i.test(html);
  result.hasFavicon = /<link\s[^>]*rel=["'](?:shortcut )?icon["']/i.test(html);
  result.hasViewport = "viewport" in metas;
  const langMatch = html.match(/<html\s[^>]*lang=["']([^"']+)["']/i);
  result.hasLangAttribute = !!langMatch;
  result.htmlLang = langMatch ? langMatch[1] : null;
  const countTags = /* @__PURE__ */ __name((tag) => (html.match(new RegExp(`<${tag}[^>]*>`, "gi")) || []).length, "countTags");
  result.h1Count = countTags("h1");
  result.h2Count = countTags("h2");
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
  let origin = "";
  try {
    origin = new URL(url).origin;
  } catch {
  }
  for (const linkTag of links) {
    const hrefMatch = linkTag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
    try {
      const resolved = new URL(href, url).origin;
      if (origin && resolved === origin) internal++;
      else external++;
    } catch {
    }
  }
  result.internalLinks = internal;
  result.externalLinks = external;
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  result.wordCount = text ? text.split(" ").filter(Boolean).length : 0;
  return result;
}
__name(extractSnapshot, "extractSnapshot");
var CRAWLER_UAS = {
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  facebook: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
};
var MAIN_UA = "SerpCraft-Auditor/1.0 (+https://metaforge.app)";
async function fetchPage(url, ua, signal, maxHops = 5) {
  let target = url;
  const chain = [];
  for (let hop = 0; hop <= maxHops; hop++) {
    const res = await fetch(target, {
      headers: { "User-Agent": ua, Accept: "text/html,application/xhtml+xml" },
      redirect: "manual",
      signal
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("Location");
      if (!loc) return { status: res.status, finalUrl: target, body: "", headers: res.headers, chain };
      chain.push({ status: res.status, url: target });
      target = new URL(loc, target).toString();
      if (isPrivateHost(new URL(target).hostname)) return null;
      continue;
    }
    const body = await res.text().catch(() => "");
    return { status: res.status, finalUrl: res.url, body, headers: res.headers, chain };
  }
  return null;
}
__name(fetchPage, "fetchPage");
function metaContent(html, attrName, attrValue) {
  const re = new RegExp(`<meta[^>]*${attrName}=["']${attrValue}["'][^>]*>`, "i");
  const m = html.match(re);
  if (!m) return null;
  return getAttr(m[0], "content") ?? null;
}
__name(metaContent, "metaContent");
function extractCrawlerView(html, name, userAgent, httpStatus, finalUrl) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonicalMatch = html.match(/<link\s[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return {
    name,
    userAgent,
    httpStatus,
    finalUrl,
    title: titleMatch ? titleMatch[1].trim() : null,
    description: metaContent(html, "name", "description"),
    canonical: canonicalMatch ? canonicalMatch[1] : null,
    ogImage: metaContent(html, "property", "og:image"),
    robots: metaContent(html, "name", "robots"),
    hasStructuredData: /<script\s+type=["']application\/ld\+json["']/i.test(html),
    hasHreflang: /hreflang/i.test(html)
  };
}
__name(extractCrawlerView, "extractCrawlerView");
var onRequestPost = /* @__PURE__ */ __name(async ({ request, env }) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors() });
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
  if (!rawUrl) return json({ error: "url is required." }, 400);
  if (looksSuspiciousUrl(rawUrl)) return json({ error: "URL scheme not allowed." }, 400);
  let normalizedUrl;
  try {
    const u = new URL(rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("bad scheme");
    if (isPrivateHost(u.hostname)) return json({ error: "URL points to a private or local address." }, 400);
    normalizedUrl = u.toString();
  } catch {
    return json({ error: "Invalid URL format." }, 400);
  }
  const rateLimited = await checkRateLimit(env, request, { limit: 10, windowSeconds: 3600, scope: "audit" });
  if (rateLimited) return rateLimited;
  const crawlersRaw = body?.crawlers;
  const crawlers = Array.isArray(crawlersRaw) ? crawlersRaw.filter((c) => typeof c === "string" && c in CRAWLER_UAS).slice(0, 2) : [];
  const cacheKey = `audit:cache:${await sha1(normalizedUrl + "|" + crawlers.join(","))}`;
  const cached = await cacheGet(env, cacheKey);
  if (cached) {
    return json({ ...cached, cached: true });
  }
  const startTime = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1e4);
  try {
    const llmsRes = await fetch(new URL("/llms.txt", normalizedUrl).toString(), {
      headers: { "User-Agent": MAIN_UA },
      redirect: "follow",
      signal: AbortSignal.timeout(5e3)
    }).catch(() => null);
    const page = await fetchPage(normalizedUrl, MAIN_UA, controller.signal);
    if (!page) {
      return json({ error: "Too many redirects (more than 5) or a redirect target was blocked." }, 400);
    }
    const html = page.body;
    const loadTimeMs = Date.now() - startTime;
    const llmsTxtFound = llmsRes ? llmsRes.ok : null;
    const headers = {};
    for (const key of ["x-robots-tag", "content-type", "cache-control", "x-frame-options", "content-language", "link"]) {
      const v = page.headers.get(key);
      if (v) headers[key] = v;
    }
    const snapshot = extractSnapshot(html, normalizedUrl, llmsTxtFound, loadTimeMs, page.status, {
      finalUrl: page.finalUrl,
      contentType: page.headers.get("content-type") || null,
      headers,
      redirectChain: page.chain
    });
    const crawlerViews = [];
    for (const name of crawlers) {
      const view = await fetchPage(normalizedUrl, CRAWLER_UAS[name], AbortSignal.timeout(8e3), 3);
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
    const msg = err instanceof Error && err.name === "AbortError" ? "Request timed out (10s)." : "Audit failed. Please try again.";
    return json({ error: msg }, 500);
  } finally {
    clearTimeout(timer);
  }
}, "onRequestPost");
var onRequest = /* @__PURE__ */ __name(async ({ request }) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors() });
  return json({ error: "Method not allowed. Use POST." }, 405);
}, "onRequest");

// api/og-image.ts
var CACHE_TTL_SECONDS2 = 60 * 60 * 24;
var MAX_BYTES = 10 * 1024 * 1024;
var HEAD_BYTES = 262144;
function parsePng(buf) {
  if (buf.length < 24) return { format: "png", width: null, height: null };
  const dv = new DataView(buf.buffer, buf.byteOffset, 24);
  return { format: "png", width: dv.getUint32(16), height: dv.getUint32(20) };
}
__name(parsePng, "parsePng");
function parseJpeg(buf) {
  if (buf.length < 8) return { format: "jpeg", width: null, height: null };
  let off = 2;
  while (off + 9 < buf.length) {
    if (buf[off] !== 255) {
      off++;
      continue;
    }
    const marker = buf[off + 1];
    if (marker >= 192 && marker <= 207 && marker !== 196 && marker !== 200 && marker !== 204) {
      const height = buf[off + 5] << 8 | buf[off + 6];
      const width = buf[off + 7] << 8 | buf[off + 8];
      return { format: "jpeg", width, height };
    }
    const segLen = buf[off + 2] << 8 | buf[off + 3];
    if (segLen < 2) break;
    off += 2 + segLen;
  }
  return { format: "jpeg", width: null, height: null };
}
__name(parseJpeg, "parseJpeg");
function parseWebp(buf) {
  if (buf.length < 30) return { format: "webp", width: null, height: null };
  const dv = new DataView(buf.buffer, buf.byteOffset, 30);
  const chunk = String.fromCharCode(buf[12], buf[13], buf[14], buf[15]);
  if (chunk === "VP8X" && buf.length >= 30) {
    return { format: "webp", width: dv.getUint32(24, true) + 1, height: dv.getUint32(28, true) + 1 };
  }
  if (chunk === "VP8 " && buf.length >= 30) {
    return { format: "webp", width: dv.getUint16(26, true) & 16383, height: dv.getUint16(28, true) & 16383 };
  }
  if (chunk === "VP8L" && buf.length >= 25) {
    const b = buf.slice(21, 25);
    const width = (b[0] | (b[1] & 63) << 8) + 1;
    const height = (b[1] >> 6 | (b[2] & 63) << 2 | (b[3] & 15) << 10) + 1;
    return { format: "webp", width, height };
  }
  return { format: "webp", width: null, height: null };
}
__name(parseWebp, "parseWebp");
function parseGif(buf) {
  if (buf.length < 10) return { format: "gif", width: null, height: null };
  const dv = new DataView(buf.buffer, buf.byteOffset, 10);
  return { format: "gif", width: dv.getUint16(6, true), height: dv.getUint16(8, true) };
}
__name(parseGif, "parseGif");
function parseBmp(buf) {
  if (buf.length < 26) return { format: "bmp", width: null, height: null };
  const dv = new DataView(buf.buffer, buf.byteOffset, 26);
  return { format: "bmp", width: dv.getUint32(18, true), height: Math.abs(dv.getInt32(22, true)) };
}
__name(parseBmp, "parseBmp");
function parseSvg(buf) {
  const text = new TextDecoder().decode(buf.slice(0, 8192)).slice(0, 4096);
  const wAttr = text.match(/width=["'](\d+(?:\.\d+)?)/i);
  const hAttr = text.match(/height=["'](\d+(?:\.\d+)?)/i);
  if (wAttr && hAttr) return { format: "svg", width: Math.round(parseFloat(wAttr[1])), height: Math.round(parseFloat(hAttr[1])) };
  const vb = text.match(/viewBox=["'](-?[\d.]+)[\s,]+(-?[\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)["']/i);
  if (vb) return { format: "svg", width: Math.round(parseFloat(vb[3])), height: Math.round(parseFloat(vb[4])) };
  return { format: "svg", width: null, height: null };
}
__name(parseSvg, "parseSvg");
function parseImage(buf) {
  const sig = String.fromCharCode(buf[0] || 0, buf[1] || 0, buf[2] || 0, buf[3] || 0, buf[4] || 0, buf[5] || 0, buf[6] || 0, buf[7] || 0);
  if (sig.startsWith("\x89PNG")) return parsePng(buf);
  if (buf[0] === 255 && buf[1] === 216) return parseJpeg(buf);
  if (sig.slice(0, 4) === "RIFF" && sig.slice(8, 12) === "WEBP") return parseWebp(buf);
  if (sig.startsWith("GIF87a") || sig.startsWith("GIF89a")) return parseGif(buf);
  if (sig.startsWith("BM")) return parseBmp(buf);
  if (sig.includes("<svg") || sig.includes("<?xml")) return parseSvg(buf);
  return { format: null, width: null, height: null };
}
__name(parseImage, "parseImage");
function buildImageChecks(info, sizeBytes, httpStatus) {
  const checks = [];
  if (httpStatus >= 200 && httpStatus < 300) checks.push({ category: "Social", label: "Image Loadable", status: "pass", message: `Image fetched successfully (HTTP ${httpStatus}).`, impact: "high" });
  else checks.push({ category: "Social", label: "Image Loadable", status: "error", message: `Image could not be fetched (HTTP ${httpStatus}).`, impact: "high" });
  if (!info.format) checks.push({ category: "Social", label: "Image Format", status: "error", message: "Unrecognized image format.", impact: "high" });
  else if (info.format === "gif" || info.format === "bmp" || info.format === "svg") checks.push({ category: "Social", label: "Image Format", status: "warning", message: `${info.format.toUpperCase()} is supported but JPG/PNG/WebP are recommended for Open Graph.`, impact: "high" });
  else checks.push({ category: "Social", label: "Image Format", status: "pass", message: `${info.format.toUpperCase()} \u2014 recommended format.`, impact: "high" });
  if (info.width && info.height) {
    if (info.width >= 1200 && info.height >= 630) checks.push({ category: "Social", label: "Image Dimensions", status: "pass", message: `${info.width}\xD7${info.height} \u2014 meets the 1200\xD7630 minimum.`, impact: "high" });
    else if (info.width >= 600 && info.height >= 315) checks.push({ category: "Social", label: "Image Dimensions", status: "warning", message: `${info.width}\xD7${info.height} \u2014 usable, but 1200\xD7630 is recommended for sharp previews.`, impact: "high" });
    else checks.push({ category: "Social", label: "Image Dimensions", status: "error", message: `${info.width}\xD7${info.height} \u2014 too small, social platforms will upscale it poorly.`, impact: "high" });
    const ratio = info.width / info.height;
    if (ratio >= 1.7 && ratio <= 2.2) checks.push({ category: "Social", label: "Aspect Ratio", status: "pass", message: `Ratio 1:${(info.width / info.height).toFixed(2)} \u2014 close to the recommended 1.91:1.`, impact: "medium" });
    else checks.push({ category: "Social", label: "Aspect Ratio", status: "warning", message: `Ratio 1:${(info.width / info.height).toFixed(2)} \u2014 Facebook/LinkedIn crop to 1.91:1.`, impact: "medium" });
  } else {
    checks.push({ category: "Social", label: "Image Dimensions", status: "warning", message: "Dimensions could not be parsed from the image header.", impact: "high" });
  }
  const mb = sizeBytes / (1024 * 1024);
  if (sizeBytes <= 2 * 1024 * 1024) checks.push({ category: "Social", label: "File Size", status: "pass", message: `${mb.toFixed(1)} MB \u2014 loads fast.`, impact: "low" });
  else if (sizeBytes <= 5 * 1024 * 1024) checks.push({ category: "Social", label: "File Size", status: "warning", message: `${mb.toFixed(1)} MB \u2014 under 2 MB is recommended for fast social fetching.`, impact: "low" });
  else checks.push({ category: "Social", label: "File Size", status: "error", message: `${mb.toFixed(1)} MB \u2014 too large, some platforms will refuse or time out.`, impact: "low" });
  return checks;
}
__name(buildImageChecks, "buildImageChecks");
var onRequestPost2 = /* @__PURE__ */ __name(async ({ request, env }) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors() });
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
  if (!rawUrl) return json({ error: "url is required." }, 400);
  if (looksSuspiciousUrl(rawUrl)) return json({ error: "URL scheme not allowed." }, 400);
  let normalizedUrl;
  try {
    const u = new URL(rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("bad scheme");
    if (isPrivateHost(u.hostname)) return json({ error: "URL points to a private or local address." }, 400);
    normalizedUrl = u.toString();
  } catch {
    return json({ error: "Invalid URL format." }, 400);
  }
  const rateLimited = await checkRateLimit(env, request, { limit: 30, windowSeconds: 3600, scope: "og-image" });
  if (rateLimited) return rateLimited;
  const cacheKey = `og-image:cache:${await sha1(normalizedUrl)}`;
  const cached = await cacheGet(env, cacheKey);
  if (cached) return json({ ...cached, cached: true });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8e3);
  try {
    const res = await fetch(normalizedUrl, {
      headers: { "User-Agent": "SerpCraft-Auditor/1.0 (+https://metaforge.app)", Accept: "image/*,image/svg+xml" },
      redirect: "follow",
      signal: controller.signal
    });
    const contentType = res.headers.get("Content-Type") || "";
    const contentLength = Number(res.headers.get("Content-Length") || "0");
    if (contentLength > MAX_BYTES) return json({ error: "Image is larger than 10 MB." }, 413);
    if (!res.ok) return json({ error: `Failed to fetch image (HTTP ${res.status}).` }, 502);
    const reader = res.body?.getReader();
    const chunks = [];
    let total = 0;
    if (reader) {
      while (total < HEAD_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        total += value.length;
      }
      await reader.cancel().catch(() => void 0);
    }
    const head = new Uint8Array(total);
    let pos = 0;
    for (const c of chunks) {
      head.set(c, pos);
      pos += c.length;
    }
    const info = parseImage(head);
    const sizeBytes = contentLength || total;
    const checks = buildImageChecks(info, sizeBytes, res.status);
    const pass = checks.every((c) => c.status === "pass");
    const payload = { url: normalizedUrl, resolvedUrl: res.url, contentType, format: info.format, width: info.width, height: info.height, sizeBytes, checks, pass, cached: false };
    await cachePut(env, cacheKey, payload, CACHE_TTL_SECONDS2);
    return json(payload);
  } catch (err) {
    const msg = err instanceof Error && err.name === "AbortError" ? "Request timed out (8s)." : "Image check failed. Please try again.";
    return json({ error: msg }, 500);
  } finally {
    clearTimeout(timer);
  }
}, "onRequestPost");
var onRequest2 = /* @__PURE__ */ __name(async ({ request }) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors() });
  return json({ error: "Method not allowed. Use POST." }, 405);
}, "onRequest");

// ../.wrangler/tmp/pages-dHuHZn/functionsRoutes-0.4958260356217363.mjs
var routes = [
  {
    routePath: "/api/audit",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/og-image",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/audit",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/og-image",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  }
];

// ../../../.npm/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
