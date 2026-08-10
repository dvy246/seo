// Shared audit & validation engine for the AI Readiness Checker.
// Pure, environment-agnostic (no DOM, no Node APIs) so it can run both
// in the browser (paste-HTML mode) and in the Cloudflare Pages Function
// (URL mode). The server-side extractors live in functions/api/audit.ts;
// this module owns the scoring rules and generator-side tag validators.

export type AuditStatus = 'pass' | 'warning' | 'error';
export type AuditImpact = 'high' | 'medium' | 'low';
export type AuditCategory = 'SEO' | 'Social' | 'AI Readiness' | 'Accessibility';

export interface AuditCheck {
  category: AuditCategory;
  label: string;
  status: AuditStatus;
  message: string;
  impact: AuditImpact;
}

export interface AuditScores {
  overall: number;
  seo: number;
  social: number;
  aiReadiness: number;
  accessibility: number;
}

// Normalized snapshot of a page that both extraction paths produce.
export interface AuditSnapshot {
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
}

// ---------------------------------------------------------------------------
// Generator-side validators (used by the studio + paste-HTML mode)
// ---------------------------------------------------------------------------

export interface FieldValidation {
  status: AuditStatus;
  message: string;
}

export function validateTitle(title: string): FieldValidation {
  const len = title.length;
  if (len === 0) return { status: 'error', message: 'Title is required.' };
  if (len < 30) return { status: 'warning', message: `${len} chars — aim for 30-60.` };
  if (len > 60) return { status: 'warning', message: `${len} chars — Google truncates at ~60.` };
  return { status: 'pass', message: `${len} characters — optimal.` };
}

export function validateDescription(desc: string): FieldValidation {
  const len = desc.length;
  if (len === 0) return { status: 'error', message: 'Description is required.' };
  if (len < 70) return { status: 'warning', message: `${len} chars — aim for 70-160.` };
  if (len > 160) return { status: 'warning', message: `${len} chars — truncates at ~160.` };
  return { status: 'pass', message: `${len} characters — optimal.` };
}

export function validateCanonical(url: string): FieldValidation {
  if (!url) return { status: 'warning', message: 'No canonical URL set.' };
  try {
    new URL(url);
    return { status: 'pass', message: 'Valid URL format.' };
  } catch {
    return { status: 'error', message: 'Invalid URL format.' };
  }
}

export function validateOgImage(url: string): FieldValidation {
  if (!url) return { status: 'warning', message: 'No OG image set.' };
  if (!url.startsWith('http')) return { status: 'error', message: 'Must be an absolute URL.' };
  return { status: 'pass', message: 'OG image set.' };
}

export function validateKeywords(keywords: string): FieldValidation {
  if (keywords) return { status: 'warning', message: 'Keywords meta is deprecated (Google has ignored it since 2009).' };
  return { status: 'pass', message: 'No deprecated keywords tag.' };
}

// Fixed version of project 2's bug: a MISSING robots directive means the page
// is indexable by default. Only an explicit `noindex` blocks indexing.
export function validateRobotsDirective(robots: string | null): FieldValidation {
  if (!robots) return { status: 'pass', message: 'No robots meta — page is indexable by default.' };
  const lower = robots.toLowerCase();
  if (lower.includes('noindex')) return { status: 'error', message: 'Page is blocked from indexing (noindex).' };
  if (lower.includes('nofollow')) return { status: 'warning', message: 'nofollow set — links on this page won\'t pass authority.' };
  return { status: 'pass', message: 'Robots directive allows indexing.' };
}

// Required top-level fields per schema.org type (Google rich-result essentials).
// Mirrors the `required` flags in src/data/schemaDefinitions.ts.
const JSON_LD_REQUIRED: Record<string, string[]> = {
  Article: ['headline', 'datePublished', 'author', 'url'],
  BlogPosting: ['headline', 'datePublished', 'author', 'url'],
  Product: ['name', 'description', 'image', 'url'],
  FAQPage: ['mainEntity'],
  Organization: ['name', 'url'],
  LocalBusiness: ['name', 'url'],
  WebSite: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
  Person: ['name'],
  HowTo: ['step'],
  Event: ['name', 'startDate'],
};

export function validateJsonLd(jsonLd: string): FieldValidation {
  if (!jsonLd.trim()) return { status: 'warning', message: 'No structured data set.' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonLd);
  } catch {
    return { status: 'error', message: 'Invalid JSON — the schema will be rejected by search engines.' };
  }
  const nodes: Record<string, unknown>[] = Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : [parsed as Record<string, unknown>];
  for (const node of nodes) {
    if (!node || typeof node !== 'object') return { status: 'error', message: 'JSON-LD must be an object.' };
    if (!node['@context']) return { status: 'error', message: 'Missing @context (should be "https://schema.org").' };
    if (!node['@type']) return { status: 'error', message: 'Missing @type.' };
    const type = String(node['@type']);
    const required = JSON_LD_REQUIRED[type];
    if (required) {
      const missing = required.filter((k) => node[k] === undefined || node[k] === null || node[k] === '');
      if (missing.length > 0) {
        return { status: 'error', message: `${type} is missing required field(s): ${missing.join(', ')}.` };
      }
      if (type === 'FAQPage') {
        const mainEntity = node['mainEntity'];
        const items = Array.isArray(mainEntity) ? mainEntity : [mainEntity];
        const valid = items.every(
          (q) => q && typeof q === 'object' && (q as Record<string, unknown>)['@type'] === 'Question' && (q as Record<string, unknown>)['acceptedAnswer']
        );
        if (!valid) return { status: 'error', message: 'FAQPage mainEntity must be an array of Question objects with acceptedAnswer.' };
      }
    }
  }
  return { status: 'pass', message: `Valid JSON-LD (${nodes.map((n) => n['@type']).join(', ')}).` };
}

// ---------------------------------------------------------------------------
// Audit scoring (port of project 2's edge-function logic, bugs fixed)
// ---------------------------------------------------------------------------

export function buildChecks(s: Partial<AuditSnapshot>): AuditCheck[] {
  const checks: AuditCheck[] = [];

  // --- SEO ---
  if (s.title) {
    const len = s.title.length;
    if (len >= 30 && len <= 60) checks.push({ category: 'SEO', label: 'Title Tag', status: 'pass', message: `Title is ${len} characters — optimal range.`, impact: 'high' });
    else if (len < 30) checks.push({ category: 'SEO', label: 'Title Tag', status: 'warning', message: `Title is ${len} chars — too short (aim for 30-60).`, impact: 'high' });
    else checks.push({ category: 'SEO', label: 'Title Tag', status: 'warning', message: `Title is ${len} chars — too long, Google truncates at ~60.`, impact: 'high' });
  } else {
    checks.push({ category: 'SEO', label: 'Title Tag', status: 'error', message: 'No title tag found. Critical for SEO.', impact: 'high' });
  }

  if (s.description) {
    const len = s.description.length;
    if (len >= 70 && len <= 160) checks.push({ category: 'SEO', label: 'Meta Description', status: 'pass', message: `Description is ${len} characters — optimal range.`, impact: 'high' });
    else if (len < 70) checks.push({ category: 'SEO', label: 'Meta Description', status: 'warning', message: `Description is ${len} chars — too short (aim for 70-160).`, impact: 'high' });
    else checks.push({ category: 'SEO', label: 'Meta Description', status: 'warning', message: `Description is ${len} chars — too long, truncates at ~160.`, impact: 'high' });
  } else {
    checks.push({ category: 'SEO', label: 'Meta Description', status: 'error', message: 'No meta description found. Critical for click-through rate.', impact: 'high' });
  }

  if (s.canonical) checks.push({ category: 'SEO', label: 'Canonical URL', status: 'pass', message: 'Canonical URL is set.', impact: 'medium' });
  else checks.push({ category: 'SEO', label: 'Canonical URL', status: 'warning', message: 'No canonical URL found. Risk of duplicate content issues.', impact: 'medium' });

  if (s.h1Count === 1) checks.push({ category: 'SEO', label: 'H1 Tag', status: 'pass', message: 'Exactly one H1 tag found.', impact: 'medium' });
  else if (s.h1Count === 0) checks.push({ category: 'SEO', label: 'H1 Tag', status: 'error', message: 'No H1 tag found. Every page needs exactly one.', impact: 'medium' });
  else checks.push({ category: 'SEO', label: 'H1 Tag', status: 'warning', message: `${s.h1Count} H1 tags found. Use exactly one.`, impact: 'medium' });

  if ((s.imagesWithoutAlt ?? 0) === 0 && (s.imageCount ?? 0) > 0) checks.push({ category: 'SEO', label: 'Image Alt Text', status: 'pass', message: 'All images have alt text.', impact: 'medium' });
  else if ((s.imagesWithoutAlt ?? 0) > 0) checks.push({ category: 'SEO', label: 'Image Alt Text', status: 'warning', message: `${s.imagesWithoutAlt} of ${s.imageCount} images missing alt text.`, impact: 'medium' });

  // --- Social ---
  if (s.ogTitle && s.ogDescription && s.ogImage) checks.push({ category: 'Social', label: 'Open Graph', status: 'pass', message: 'Complete OG tags (title, description, image).', impact: 'high' });
  else if (s.ogTitle || s.ogDescription || s.ogImage) checks.push({ category: 'Social', label: 'Open Graph', status: 'warning', message: 'Partial OG tags. Missing some of: title, description, image.', impact: 'high' });
  else checks.push({ category: 'Social', label: 'Open Graph', status: 'error', message: 'No Open Graph tags found. Social shares show blank previews.', impact: 'high' });

  if (s.twitterCard && s.twitterTitle) checks.push({ category: 'Social', label: 'Twitter Cards', status: 'pass', message: 'Twitter Card tags detected.', impact: 'medium' });
  else checks.push({ category: 'Social', label: 'Twitter Cards', status: 'warning', message: 'Missing Twitter Card tags. X shares won\'t show rich previews.', impact: 'medium' });

  // --- AI Readiness (the moat) ---
  if (s.hasStructuredData) checks.push({ category: 'AI Readiness', label: 'Structured Data', status: 'pass', message: `JSON-LD found: ${(s.structuredDataTypes || []).join(', ') || 'unknown type'}.`, impact: 'high' });
  else checks.push({ category: 'AI Readiness', label: 'Structured Data', status: 'error', message: 'No JSON-LD structured data. AI engines use this to understand and cite your content.', impact: 'high' });

  if (s.hasLlmsTxt === true) checks.push({ category: 'AI Readiness', label: 'llms.txt', status: 'pass', message: 'llms.txt found at site root. Your site is discoverable by AI crawlers.', impact: 'high' });
  else if (s.hasLlmsTxt === false) checks.push({ category: 'AI Readiness', label: 'llms.txt', status: 'warning', message: 'No llms.txt file. Add one to help AI engines discover your content.', impact: 'high' });
  else checks.push({ category: 'AI Readiness', label: 'llms.txt', status: 'warning', message: 'Could not verify llms.txt (redirect or error).', impact: 'medium' });

  if (s.robots && s.robots.toLowerCase().includes('noindex')) checks.push({ category: 'AI Readiness', label: 'Robots Directive', status: 'error', message: 'Page is blocked from indexing (noindex). AI engines won\'t see it.', impact: 'high' });
  else checks.push({ category: 'AI Readiness', label: 'Robots Directive', status: 'pass', message: 'Page is indexable.', impact: 'high' });

  if ((s.wordCount ?? 0) >= 300) checks.push({ category: 'AI Readiness', label: 'Content Depth', status: 'pass', message: `${s.wordCount} words of content detected.`, impact: 'medium' });
  else checks.push({ category: 'AI Readiness', label: 'Content Depth', status: 'warning', message: `Only ${s.wordCount ?? 0} words. AI engines prefer content-rich pages (300+ words).`, impact: 'medium' });

  if (s.hasHreflang) checks.push({ category: 'AI Readiness', label: 'Hreflang', status: 'pass', message: 'Hreflang tags detected for international targeting.', impact: 'medium' });
  else checks.push({ category: 'AI Readiness', label: 'Hreflang', status: 'warning', message: 'No hreflang tags. Multilingual sites risk duplicate-content confusion.', impact: 'medium' });

  // --- Accessibility ---
  if (s.hasViewport) checks.push({ category: 'Accessibility', label: 'Viewport Meta', status: 'pass', message: 'Viewport meta tag is set.', impact: 'high' });
  else checks.push({ category: 'Accessibility', label: 'Viewport Meta', status: 'error', message: 'No viewport meta tag. Page won\'t render properly on mobile.', impact: 'high' });

  if (s.hasLangAttribute) checks.push({ category: 'Accessibility', label: 'Language Attribute', status: 'pass', message: `HTML lang attribute set to "${s.htmlLang}".`, impact: 'medium' });
  else checks.push({ category: 'Accessibility', label: 'Language Attribute', status: 'warning', message: 'No lang attribute on <html>. Screen readers and AI need it.', impact: 'medium' });

  if (s.hasFavicon) checks.push({ category: 'Accessibility', label: 'Favicon', status: 'pass', message: 'Favicon detected.', impact: 'low' });
  else checks.push({ category: 'Accessibility', label: 'Favicon', status: 'warning', message: 'No favicon found.', impact: 'low' });

  return checks;
}

export function calculateScores(checks: AuditCheck[]): AuditScores {
  const weightMap: Record<AuditImpact, number> = { high: 3, medium: 2, low: 1 };
  const categories: AuditCategory[] = ['SEO', 'Social', 'AI Readiness', 'Accessibility'];

  const categoryScores: Record<string, number> = {};
  for (const cat of categories) {
    const catChecks = checks.filter((c) => c.category === cat);
    const totalWeight = catChecks.reduce((sum, c) => sum + weightMap[c.impact], 0);
    const passWeight = catChecks.filter((c) => c.status === 'pass').reduce((sum, c) => sum + weightMap[c.impact], 0);
    const warnWeight = catChecks.filter((c) => c.status === 'warning').reduce((sum, c) => sum + weightMap[c.impact] * 0.5, 0);
    categoryScores[cat] = totalWeight > 0 ? Math.round(((passWeight + warnWeight) / totalWeight) * 100) : 0;
  }

  const overall = Math.round(
    categoryScores['SEO'] * 0.3 +
    categoryScores['Social'] * 0.2 +
    categoryScores['AI Readiness'] * 0.35 +
    categoryScores['Accessibility'] * 0.15
  );

  return {
    overall,
    seo: categoryScores['SEO'],
    social: categoryScores['Social'],
    aiReadiness: categoryScores['AI Readiness'],
    accessibility: categoryScores['Accessibility'],
  };
}
