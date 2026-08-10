import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AuditResult {
  url: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogType: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  robots: string | null;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  hasHreflang: boolean;
  hasLlmsTxt: boolean | null;
  hasFavicon: boolean;
  hasViewport: boolean;
  hasLangAttribute: boolean;
  htmlLang: string | null;
  h1Count: number;
  h2Count: number;
  imageCount: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  loadTimeMs: number;
  httpStatus: number;
  scores: {
    overall: number;
    seo: number;
    social: number;
    aiReadiness: number;
    accessibility: number;
  };
  checks: AuditCheck[];
}

interface AuditCheck {
  category: string;
  label: string;
  status: "pass" | "warning" | "error";
  message: string;
  impact: "high" | "medium" | "low";
}

function extractMeta(html: string): Record<string, string> {
  const metas: Record<string, string> = {};
  const metaRegex = /<meta\s+(?:property|name|itemprop)=["']([^"']+)["']\s+content=["']([^"']*)["']/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    if (!metas[match[1]]) metas[match[1]] = match[2];
  }
  return metas;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractCanonical(html: string): string | null {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  return match ? match[1].trim() : null;
}

function extractStructuredData(html: string): { has: boolean; types: string[] } {
  const types: string[] = [];
  const scriptRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item["@type"]) {
          const type = Array.isArray(item["@type"]) ? item["@type"].join(", ") : item["@type"];
          if (!types.includes(type)) types.push(type);
        }
        if (item["@graph"] && Array.isArray(item["@graph"])) {
          for (const g of item["@graph"]) {
            if (g["@type"] && !types.includes(g["@type"])) types.push(g["@type"]);
          }
        }
      }
    } catch {
      // invalid JSON-LD
    }
  }
  return { has: types.length > 0, types };
}

function countHeadings(html: string, tag: string): number {
  const regex = new RegExp(`<${tag}[^>]*>`, "gi");
  return (html.match(regex) || []).length;
}

function countImages(html: string): { total: number; withoutAlt: number } {
  const imgRegex = /<img\s[^>]*>/gi;
  const imgs = html.match(imgRegex) || [];
  let withoutAlt = 0;
  for (const img of imgs) {
    if (!/alt\s*=\s*["']([^"']*)["']/i.test(img) || /alt\s*=\s*["']["']/i.test(img)) {
      withoutAlt++;
    }
  }
  return { total: imgs.length, withoutAlt };
}

function countLinks(html: string, baseUrl: string): { internal: number; external: number } {
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["']/gi;
  const links = html.match(linkRegex) || [];
  let internal = 0;
  let external = 0;
  let origin = "";
  try {
    const u = new URL(baseUrl);
    origin = u.origin;
  } catch {
    return { internal: 0, external: 0 };
  }
  for (const linkTag of links) {
    const hrefMatch = linkTag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
    try {
      const resolved = new URL(href, baseUrl).origin;
      if (resolved === origin) internal++;
      else external++;
    } catch {
      // skip invalid
    }
  }
  return { internal, external };
}

function stripHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function buildChecks(data: Partial<AuditResult>): AuditCheck[] {
  const checks: AuditCheck[] = [];

  // SEO checks
  if (data.title) {
    const len = data.title.length;
    if (len >= 30 && len <= 60) checks.push({ category: "SEO", label: "Title Tag", status: "pass", message: `Title is ${len} characters — optimal range.`, impact: "high" });
    else if (len < 30) checks.push({ category: "SEO", label: "Title Tag", status: "warning", message: `Title is ${len} chars — too short (aim for 30-60).`, impact: "high" });
    else checks.push({ category: "SEO", label: "Title Tag", status: "warning", message: `Title is ${len} chars — too long, Google truncates at ~60.`, impact: "high" });
  } else {
    checks.push({ category: "SEO", label: "Title Tag", status: "error", message: "No title tag found. This is critical for SEO.", impact: "high" });
  }

  if (data.description) {
    const len = data.description.length;
    if (len >= 70 && len <= 160) checks.push({ category: "SEO", label: "Meta Description", status: "pass", message: `Description is ${len} characters — optimal range.`, impact: "high" });
    else if (len < 70) checks.push({ category: "SEO", label: "Meta Description", status: "warning", message: `Description is ${len} chars — too short (aim for 70-160).`, impact: "high" });
    else checks.push({ category: "SEO", label: "Meta Description", status: "warning", message: `Description is ${len} chars — too long, truncates at ~160.`, impact: "high" });
  } else {
    checks.push({ category: "SEO", label: "Meta Description", status: "error", message: "No meta description found. Critical for click-through rate.", impact: "high" });
  }

  if (data.canonical) checks.push({ category: "SEO", label: "Canonical URL", status: "pass", message: "Canonical URL is set.", impact: "medium" });
  else checks.push({ category: "SEO", label: "Canonical URL", status: "warning", message: "No canonical URL found. Risk of duplicate content issues.", impact: "medium" });

  if (data.h1Count === 1) checks.push({ category: "SEO", label: "H1 Tag", status: "pass", message: "Exactly one H1 tag found.", impact: "medium" });
  else if (data.h1Count === 0) checks.push({ category: "SEO", label: "H1 Tag", status: "error", message: "No H1 tag found. Every page needs exactly one.", impact: "medium" });
  else checks.push({ category: "SEO", label: "H1 Tag", status: "warning", message: `${data.h1Count} H1 tags found. Use exactly one.`, impact: "medium" });

  if (data.imagesWithoutAlt === 0 && data.imageCount > 0) checks.push({ category: "SEO", label: "Image Alt Text", status: "pass", message: "All images have alt text.", impact: "medium" });
  else if (data.imagesWithoutAlt > 0) checks.push({ category: "SEO", label: "Image Alt Text", status: "warning", message: `${data.imagesWithoutAlt} of ${data.imageCount} images missing alt text.`, impact: "medium" });

  // Social checks
  if (data.ogTitle && data.ogDescription && data.ogImage) checks.push({ category: "Social", label: "Open Graph", status: "pass", message: "Complete OG tags (title, description, image).", impact: "high" });
  else if (data.ogTitle || data.ogDescription || data.ogImage) checks.push({ category: "Social", label: "Open Graph", status: "warning", message: "Partial OG tags. Missing some of: title, description, image.", impact: "high" });
  else checks.push({ category: "Social", label: "Open Graph", status: "error", message: "No Open Graph tags found. Social shares show blank previews.", impact: "high" });

  if (data.twitterCard && data.twitterTitle) checks.push({ category: "Social", label: "Twitter Cards", status: "pass", message: "Twitter Card tags detected.", impact: "medium" });
  else checks.push({ category: "Social", label: "Twitter Cards", status: "warning", message: "Missing Twitter Card tags. X shares won't show rich previews.", impact: "medium" });

  // AI Readiness checks (the moat)
  if (data.hasStructuredData) checks.push({ category: "AI Readiness", label: "Structured Data", status: "pass", message: `JSON-LD found: ${data.structuredDataTypes.join(", ")}.`, impact: "high" });
  else checks.push({ category: "AI Readiness", label: "Structured Data", status: "error", message: "No JSON-LD structured data. AI engines use this to understand and cite your content.", impact: "high" });

  if (data.hasLlmsTxt === true) checks.push({ category: "AI Readiness", label: "llms.txt", status: "pass", message: "llms.txt file found. Your site is discoverable by AI crawlers.", impact: "high" });
  else if (data.hasLlmsTxt === false) checks.push({ category: "AI Readiness", label: "llms.txt", status: "warning", message: "No llms.txt file. Add one to help AI engines discover your content.", impact: "high" });
  else checks.push({ category: "AI Readiness", label: "llms.txt", status: "warning", message: "Could not verify llms.txt (redirect or error).", impact: "medium" });

  if (data.robots === null || data.robots.includes("noindex")) checks.push({ category: "AI Readiness", label: "Robots Directive", status: "error", message: "Page is blocked from indexing. AI engines won't see it.", impact: "high" });
  else checks.push({ category: "AI Readiness", label: "Robots Directive", status: "pass", message: "Page is indexable.", impact: "high" });

  if (data.wordCount >= 300) checks.push({ category: "AI Readiness", label: "Content Depth", status: "pass", message: `${data.wordCount} words of content detected.`, impact: "medium" });
  else checks.push({ category: "AI Readiness", label: "Content Depth", status: "warning", message: `Only ${data.wordCount} words. AI engines prefer content-rich pages (300+ words).`, impact: "medium" });

  // Accessibility checks
  if (data.hasViewport) checks.push({ category: "Accessibility", label: "Viewport Meta", status: "pass", message: "Viewport meta tag is set.", impact: "high" });
  else checks.push({ category: "Accessibility", label: "Viewport Meta", status: "error", message: "No viewport meta tag. Page won't render properly on mobile.", impact: "high" });

  if (data.hasLangAttribute) checks.push({ category: "Accessibility", label: "Language Attribute", status: "pass", message: `HTML lang attribute set to "${data.htmlLang}".`, impact: "medium" });
  else checks.push({ category: "Accessibility", label: "Language Attribute", status: "warning", message: "No lang attribute on <html>. Screen readers and AI need it.", impact: "medium" });

  if (data.hasFavicon) checks.push({ category: "Accessibility", label: "Favicon", status: "pass", message: "Favicon detected.", impact: "low" });
  else checks.push({ category: "Accessibility", label: "Favicon", status: "warning", message: "No favicon found.", impact: "low" });

  return checks;
}

function calculateScores(checks: AuditCheck[]): AuditResult["scores"] {
  const weightMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const categories = ["SEO", "Social", "AI Readiness", "Accessibility"];

  const categoryScores: Record<string, number> = {};
  for (const cat of categories) {
    const catChecks = checks.filter((c) => c.category === cat);
    const totalWeight = catChecks.reduce((sum, c) => sum + weightMap[c.impact], 0);
    const passWeight = catChecks.filter((c) => c.status === "pass").reduce((sum, c) => sum + weightMap[c.impact], 0);
    const warnWeight = catChecks.filter((c) => c.status === "warning").reduce((sum, c) => sum + weightMap[c.impact] * 0.5, 0);
    categoryScores[cat] = totalWeight > 0 ? Math.round(((passWeight + warnWeight) / totalWeight) * 100) : 0;
  }

  const overall = Math.round(
    (categoryScores["SEO"] * 0.3 + categoryScores["Social"] * 0.2 + categoryScores["AI Readiness"] * 0.35 + categoryScores["Accessibility"] * 0.15)
  );

  return {
    overall,
    seo: categoryScores["SEO"],
    social: categoryScores["Social"],
    aiReadiness: categoryScores["AI Readiness"],
    accessibility: categoryScores["Accessibility"],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(normalizedUrl);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const startTime = Date.now();

    const fetchPromise = fetch(normalizedUrl, {
      headers: {
        "User-Agent": "MetaForge-Auditor/1.0 (+https://metaforge.app)",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    let llmsTxtPromise: Promise<Response | null>;
    try {
      llmsTxtPromise = fetch(`${parsedUrl.origin}/llms.txt`, {
        headers: { "User-Agent": "MetaForge-Auditor/1.0" },
        signal: AbortSignal.timeout(5000),
      }).catch(() => null);
    } catch {
      llmsTxtPromise = Promise.resolve(null);
    }

    const [response, llmsTxtResponse] = await Promise.all([fetchPromise, llmsTxtPromise]);
    const loadTimeMs = Date.now() - startTime;

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch URL (HTTP ${response.status})` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = await response.text();
    const metas = extractMeta(html);
    const title = extractTitle(html);
    const description = metas["description"] || null;
    const canonical = extractCanonical(html);
    const { has: hasStructuredData, types: structuredDataTypes } = extractStructuredData(html);
    const h1Count = countHeadings(html, "h1");
    const h2Count = countHeadings(html, "h2");
    const { total: imageCount, withoutAlt: imagesWithoutAlt } = countImages(html);
    const { internal: internalLinks, external: externalLinks } = countLinks(html, normalizedUrl);
    const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;
    const hasViewport = "viewport" in metas;
    const hasFavicon = /<link\s+[^>]*rel=["']icon["']/i.test(html) || /<link\s+[^>]*rel=["']shortcut icon["']/i.test(html);
    const langMatch = html.match(/<html\s+[^>]*lang=["']([^"']+)["']/i);
    const hasLangAttribute = !!langMatch;
    const htmlLang = langMatch ? langMatch[1] : null;
    const hasHreflang = /hreflang/i.test(html);
    const hasLlmsTxt = llmsTxtResponse ? llmsTxtResponse.ok : null;

    const partial: Partial<AuditResult> = {
      url: normalizedUrl,
      title,
      description,
      canonical,
      ogTitle: metas["og:title"] || null,
      ogDescription: metas["og:description"] || null,
      ogImage: metas["og:image"] || null,
      ogType: metas["og:type"] || null,
      twitterCard: metas["twitter:card"] || null,
      twitterTitle: metas["twitter:title"] || null,
      twitterDescription: metas["twitter:description"] || null,
      twitterImage: metas["twitter:image"] || null,
      robots: metas["robots"] || null,
      hasStructuredData,
      structuredDataTypes,
      hasHreflang,
      hasLlmsTxt,
      hasFavicon,
      hasViewport,
      hasLangAttribute,
      htmlLang,
      h1Count,
      h2Count,
      imageCount,
      imagesWithoutAlt,
      internalLinks,
      externalLinks,
      wordCount,
      loadTimeMs,
      httpStatus: response.status,
    };

    const checks = buildChecks(partial);
    const scores = calculateScores(checks);

    const result: AuditResult = {
      ...(partial as AuditResult),
      scores,
      checks,
    };

    // Persist audit to database for analytics (fire-and-forget)
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await supabase.from("audits").insert({
        url: normalizedUrl,
        overall_score: scores.overall,
        seo_score: scores.seo,
        social_score: scores.social,
        ai_readiness_score: scores.aiReadiness,
        accessibility_score: scores.accessibility,
        title: title,
        has_structured_data: hasStructuredData,
        has_llms_txt: hasLlmsTxt,
        word_count: wordCount,
      });
    } catch {
      // analytics are non-critical
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Audit failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
