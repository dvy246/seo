import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Eye,
  Search,
  Share2,
  Code2,
  Tags,
  Braces,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Globe,
  Bot,
  Zap,
  Loader2,
  ArrowRight,
  Gauge,
  FileText,
  Languages,
  Image as ImageIcon,
  Link2,
  Type,
} from 'lucide-react';

type ValidationStatus = 'pass' | 'warning' | 'error';

interface AuditCheck {
  category: string;
  label: string;
  status: ValidationStatus;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

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

interface MetaData {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  robots: string;
  keywords: string;
  jsonLdType: string;
  jsonLdData: string;
}

const defaultMeta: MetaData = {
  title: '',
  description: '',
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogUrl: '',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterSite: '',
  robots: 'index, follow',
  keywords: '',
  jsonLdType: 'WebPage',
  jsonLdData: '',
};

const jsonLdTypes = ['WebPage', 'Article', 'BlogPosting', 'Product', 'Organization', 'LocalBusiness', 'FAQPage', 'HowTo'];

const faqs = [
  {
    q: 'What is an AI readiness audit?',
    a: 'An AI readiness audit checks whether your website is optimized for AI search engines like ChatGPT, Perplexity, Google AI Overviews, and Claude. It verifies you have structured data (JSON-LD), an llms.txt file, indexable content, sufficient word count, and proper meta tags — the signals AI engines use to discover and cite your content.',
  },
  {
    q: 'How is this different from a regular SEO audit?',
    a: 'Traditional SEO audits check Google ranking factors. MetaForge goes further: it audits for AI search engine visibility (GEO — Generative Engine Optimization). It checks for llms.txt, structured data that AI engines use to cite sources, content depth, and robots directives that affect AI crawlers like GPTBot and PerplexityBot. No other free tool does this.',
  },
  {
    q: 'Is MetaForge free to use?',
    a: 'Yes. Both the AI readiness auditor and the meta tag generator are completely free with no signup required. All processing happens in your browser — the audit fetches your URL server-side but stores no personal data.',
  },
  {
    q: 'What is llms.txt and why does it matter?',
    a: 'llms.txt is a new standard (like robots.txt but for AI) that tells AI crawlers what your site is about and which pages matter. It helps ChatGPT, Perplexity, and other AI engines discover and correctly cite your content. MetaForge is the first free tool to check for it.',
  },
  {
    q: 'How does the meta tag generator validate its output?',
    a: 'MetaForge checks every generated tag against current SEO specifications in real time. It verifies title length (30-60 characters), description length (70-160 characters), Open Graph image requirements, Twitter Card requirements, JSON-LD schema validity, and flags deprecated tags like the keywords meta tag.',
  },
  {
    q: 'What makes MetaForge different from other SEO tools?',
    a: 'MetaForge is the only free tool that combines a URL auditor with AI readiness scoring and a validated meta tag generator. It checks your live site for AI search visibility — something no competitor offers for free. The server-side URL fetch bypasses browser CORS limits that block every client-only tool.',
  },
];

// --- Validation functions for the generator ---
function validateTitle(title: string): { status: ValidationStatus; message: string } {
  const len = title.length;
  if (len === 0) return { status: 'error', message: 'Title is required.' };
  if (len < 30) return { status: 'warning', message: `${len} chars — aim for 30-60.` };
  if (len > 60) return { status: 'warning', message: `${len} chars — Google truncates at ~60.` };
  return { status: 'pass', message: `${len} characters — optimal.` };
}

function validateDescription(desc: string): { status: ValidationStatus; message: string } {
  const len = desc.length;
  if (len === 0) return { status: 'error', message: 'Description is required.' };
  if (len < 70) return { status: 'warning', message: `${len} chars — aim for 70-160.` };
  if (len > 160) return { status: 'warning', message: `${len} chars — truncates at ~160.` };
  return { status: 'pass', message: `${len} characters — optimal.` };
}

function validateCanonical(url: string): { status: ValidationStatus; message: string } {
  if (!url) return { status: 'warning', message: 'No canonical URL set.' };
  try { new URL(url); return { status: 'pass', message: 'Valid URL format.' }; } catch {
    return { status: 'error', message: 'Invalid URL format.' };
  }
}

function validateOgImage(url: string): { status: ValidationStatus; message: string } {
  if (!url) return { status: 'warning', message: 'No OG image set.' };
  if (!url.startsWith('http')) return { status: 'error', message: 'Must be absolute URL.' };
  return { status: 'pass', message: 'OG image set.' };
}

function validateKeywords(keywords: string): { status: ValidationStatus; message: string } {
  if (keywords) return { status: 'warning', message: 'Keywords meta is deprecated (Google ignores it since 2009).' };
  return { status: 'pass', message: 'No deprecated keywords tag.' };
}

function validateJsonLd(jsonLd: string): { status: ValidationStatus; message: string } {
  if (!jsonLd) return { status: 'warning', message: 'No structured data set.' };
  try {
    const parsed = JSON.parse(jsonLd);
    if (!parsed['@context']) return { status: 'error', message: 'Missing @context.' };
    if (!parsed['@type']) return { status: 'error', message: 'Missing @type.' };
    return { status: 'pass', message: 'Valid JSON-LD with @context and @type.' };
  } catch {
    return { status: 'error', message: 'Invalid JSON.' };
  }
}

function generateHtml(meta: MetaData): string {
  const lines: string[] = [];
  if (meta.title) lines.push(`<title>${meta.title}</title>`);
  if (meta.description) lines.push(`<meta name="description" content="${meta.description}" />`);
  if (meta.canonicalUrl) lines.push(`<link rel="canonical" href="${meta.canonicalUrl}" />`);
  if (meta.robots) lines.push(`<meta name="robots" content="${meta.robots}" />`);
  if (meta.keywords) lines.push(`<meta name="keywords" content="${meta.keywords}" />`);
  lines.push('');
  lines.push('<!-- Open Graph / Facebook -->');
  if (meta.ogTitle) lines.push(`<meta property="og:title" content="${meta.ogTitle}" />`);
  if (meta.ogDescription) lines.push(`<meta property="og:description" content="${meta.ogDescription}" />`);
  if (meta.ogImage) lines.push(`<meta property="og:image" content="${meta.ogImage}" />`);
  if (meta.ogUrl) lines.push(`<meta property="og:url" content="${meta.ogUrl}" />`);
  if (meta.ogType) lines.push(`<meta property="og:type" content="${meta.ogType}" />`);
  lines.push('');
  lines.push('<!-- Twitter Cards -->');
  if (meta.twitterCard) lines.push(`<meta name="twitter:card" content="${meta.twitterCard}" />`);
  if (meta.twitterTitle) lines.push(`<meta name="twitter:title" content="${meta.twitterTitle}" />`);
  if (meta.twitterDescription) lines.push(`<meta name="twitter:description" content="${meta.twitterDescription}" />`);
  if (meta.twitterImage) lines.push(`<meta name="twitter:image" content="${meta.twitterImage}" />`);
  if (meta.twitterSite) lines.push(`<meta name="twitter:site" content="${meta.twitterSite}" />`);
  if (meta.jsonLdData) {
    lines.push('');
    lines.push('<!-- JSON-LD Structured Data -->');
    lines.push(`<script type="application/ld+json">`);
    lines.push(meta.jsonLdData);
    lines.push(`</script>`);
  }
  return lines.join('\n');
}

function generateDefaultJsonLd(type: string, meta: MetaData): string {
  const base: Record<string, unknown> = { '@context': 'https://schema.org', '@type': type };
  if (meta.title) base['name'] = meta.title;
  if (meta.description) base['description'] = meta.description;
  if (meta.canonicalUrl) base['url'] = meta.canonicalUrl;
  if (type === 'Article' || type === 'BlogPosting') {
    base['headline'] = meta.title;
    base['datePublished'] = new Date().toISOString().split('T')[0];
    base['author'] = { '@type': 'Organization', name: 'Your Organization' };
  }
  return JSON.stringify(base, null, 2);
}

const categoryIcons: Record<string, typeof Search> = {
  'SEO': Search,
  'Social': Share2,
  'AI Readiness': Bot,
  'Accessibility': Eye,
};

const categoryColors: Record<string, string> = {
  'SEO': 'text-choco-600 dark:text-choco-400',
  'Social': 'text-blue-600 dark:text-blue-400',
  'AI Readiness': 'text-success',
  'Accessibility': 'text-purple-600 dark:text-purple-400',
};

export default function MetaTagGenerator() {
  const [mode, setMode] = useState<'audit' | 'generate'>('audit');
  const [auditUrl, setAuditUrl] = useState('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');

  const [meta, setMeta] = useState<MetaData>(defaultMeta);
  const [genTab, setGenTab] = useState<'editor' | 'preview' | 'code'>('editor');
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [activeAuditCategory, setActiveAuditCategory] = useState<string>('all');

  useEffect(() => {
    if (!meta.jsonLdData && meta.jsonLdType) {
      setMeta((prev) => ({ ...prev, jsonLdData: generateDefaultJsonLd(prev.jsonLdType, prev) }));
    }
  }, []);

  const runAudit = async () => {
    if (!auditUrl.trim()) return;
    setAuditLoading(true);
    setAuditError('');
    setAuditResult(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;
      const apiUrl = `${supabaseUrl}/functions/v1/audit-url`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: auditUrl.trim() }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${response.status})`);
      }
      const data: AuditResult = await response.json();
      setAuditResult(data);
    } catch (err) {
      setAuditError(err instanceof Error ? err.message : 'Audit failed. Please try again.');
    } finally {
      setAuditLoading(false);
    }
  };

  const genValidations = useMemo(() => [
    { label: 'Title Tag', ...validateTitle(meta.title) },
    { label: 'Meta Description', ...validateDescription(meta.description) },
    { label: 'Canonical URL', ...validateCanonical(meta.canonicalUrl) },
    { label: 'OG Image', ...validateOgImage(meta.ogImage) },
    { label: 'Keywords Meta', ...validateKeywords(meta.keywords) },
    { label: 'JSON-LD Schema', ...validateJsonLd(meta.jsonLdData) },
  ], [meta]);

  const genPassCount = genValidations.filter((v) => v.status === 'pass').length;
  const genScore = Math.round((genPassCount / genValidations.length) * 100);
  const generatedHtml = useMemo(() => generateHtml(meta), [meta]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const update = (field: keyof MetaData, value: string) => {
    setMeta((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !prev.ogTitle) next.ogTitle = value;
      if (field === 'title' && !prev.twitterTitle) next.twitterTitle = value;
      if (field === 'description' && !prev.ogDescription) next.ogDescription = value;
      if (field === 'description' && !prev.twitterDescription) next.twitterDescription = value;
      if (field === 'canonicalUrl' && !prev.ogUrl) next.ogUrl = value;
      if (field === 'ogImage' && !prev.twitterImage) next.twitterImage = value;
      if (field === 'jsonLdType') next.jsonLdData = generateDefaultJsonLd(value, next);
      return next;
    });
  };

  const statusIcon = (status: ValidationStatus) => {
    if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />;
    return <XCircle className="w-4 h-4 text-error flex-shrink-0" />;
  };

  const statusBg = (status: ValidationStatus) => {
    if (status === 'pass') return 'bg-success/5 dark:bg-success/10 border-success/20';
    if (status === 'warning') return 'bg-warning/5 dark:bg-warning/10 border-warning/20';
    return 'bg-error/5 dark:bg-error/10 border-error/20';
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-error';
  };

  const filteredChecks = auditResult
    ? activeAuditCategory === 'all'
      ? auditResult.checks
      : auditResult.checks.filter((c) => c.category === activeAuditCategory)
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg mb-8 w-fit mx-auto">
        <button
          onClick={() => setMode('audit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${mode === 'audit' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Globe className="w-4 h-4" />
          Audit a URL
        </button>
        <button
          onClick={() => setMode('generate')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${mode === 'generate' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Tags className="w-4 h-4" />
          Generate Tags
        </button>
      </div>

      {/* ===== AUDIT MODE ===== */}
      {mode === 'audit' && (
        <div className="animate-fade-in space-y-6">
          {/* URL Input */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAudit()}
                  placeholder="https://yoursite.com"
                  className="w-full pl-10 pr-4 py-3 bg-card border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={runAudit}
                disabled={auditLoading || !auditUrl.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {auditLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Auditing...</>
                ) : (
                  <>Audit <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
            {auditError && (
              <div className="mt-3 p-3 bg-error/5 dark:bg-error/10 border border-error/20 rounded-md text-sm text-error animate-fade-in-fast">
                {auditError}
              </div>
            )}
          </div>

          {/* Loading state */}
          {auditLoading && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-card rounded-lg sketch-border p-6 animate-pulse-soft">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">Fetching and analyzing your page...</span>
                </div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-secondary rounded-md animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Audit Results */}
          {auditResult && !auditLoading && (
            <div className="space-y-6 animate-fade-in">
              {/* Score Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Overall', score: auditResult.scores.overall, icon: Gauge },
                  { label: 'SEO', score: auditResult.scores.seo, icon: Search },
                  { label: 'AI Readiness', score: auditResult.scores.aiReadiness, icon: Bot },
                  { label: 'Social', score: auditResult.scores.social, icon: Share2 },
                ].map((s) => (
                  <div key={s.label} className="bg-card rounded-lg sketch-border p-4 text-center">
                    <s.icon className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                    <div className={`text-3xl font-bold ${scoreColor(s.score)}`}>{s.score}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${scoreBg(s.score)}`} style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Page Info Summary */}
              <div className="bg-card rounded-lg sketch-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Page Info</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Title</p>
                    <p className="text-foreground truncate text-pretty">{auditResult.title || 'Not found'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Word Count</p>
                    <p className="text-foreground">{auditResult.wordCount.toLocaleString()} words</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Load Time</p>
                    <p className="text-foreground">{(auditResult.loadTimeMs / 1000).toFixed(2)}s</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">HTTP Status</p>
                    <p className="text-foreground">{auditResult.httpStatus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Structured Data</p>
                    <p className="text-foreground">{auditResult.hasStructuredData ? auditResult.structuredDataTypes.join(', ') : 'None found'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">llms.txt</p>
                    <p className={auditResult.hasLlmsTxt ? 'text-success' : 'text-warning'}>
                      {auditResult.hasLlmsTxt ? 'Found' : 'Missing'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">H1 / H2 Tags</p>
                    <p className="text-foreground">{auditResult.h1Count} / {auditResult.h2Count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Images (missing alt)</p>
                    <p className="text-foreground">{auditResult.imageCount} ({auditResult.imagesWithoutAlt})</p>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveAuditCategory('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeAuditCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                  All Checks
                </button>
                {['SEO', 'AI Readiness', 'Social', 'Accessibility'].map((cat) => {
                  const Icon = categoryIcons[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveAuditCategory(cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeAuditCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Checks */}
              <div className="space-y-2">
                {filteredChecks.map((check, i) => {
                  const Icon = categoryIcons[check.category];
                  return (
                    <div key={i} className={`p-4 rounded-lg border ${statusBg(check.status)} flex items-start gap-3 animate-fade-in-fast`}>
                      {statusIcon(check.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Icon className={`w-3.5 h-3.5 ${categoryColors[check.category]}`} />
                          <span className="text-sm font-medium text-foreground">{check.label}</span>
                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-secondary rounded">{check.category}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${check.impact === 'high' ? 'bg-error/10 text-error' : check.impact === 'medium' ? 'bg-warning/10 text-warning' : 'bg-secondary text-muted-foreground'}`}>
                            {check.impact}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground text-pretty">{check.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Readiness highlight (the moat) */}
              {auditResult.scores.aiReadiness < 80 && (
                <div className="bg-card rounded-lg sketch-border p-6 border-l-4 border-l-success">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">AI Readiness Gap Detected</h4>
                      <p className="text-sm text-muted-foreground text-pretty">
                        Your site scores {auditResult.scores.aiReadiness}/100 for AI search visibility. Switch to "Generate Tags" to create the missing structured data, meta tags, and llms.txt that ChatGPT, Perplexity, and Google AI Overviews use to discover and cite your content.
                      </p>
                      <button
                        onClick={() => setMode('generate')}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-success hover:underline"
                      >
                        Fix these issues <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!auditResult && !auditLoading && !auditError && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Audit any URL for AI search readiness</h3>
              <p className="text-sm text-muted-foreground text-pretty max-w-md mx-auto">
                Paste your URL above. MetaForge fetches your page server-side and checks it for SEO, social sharing, AI search visibility, and accessibility — something no client-only tool can do.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== GENERATE MODE ===== */}
      {mode === 'generate' && (
        <div className="animate-fade-in space-y-6">
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg w-fit mx-auto">
            {(['editor', 'preview', 'code'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setGenTab(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${genTab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t === 'editor' && <Tags className="w-4 h-4" />}
                {t === 'preview' && <Eye className="w-4 h-4" />}
                {t === 'code' && <Code2 className="w-4 h-4" />}
                {t}
              </button>
            ))}
          </div>

          {genTab === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-card rounded-lg sketch-border p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Basic Meta Tags</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Page Title <span className="text-error">*</span></label>
                    <input type="text" value={meta.title} onChange={(e) => update('title', e.target.value)} placeholder="Your page title" className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <p className="text-xs text-muted-foreground mt-1">{meta.title.length}/60</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Meta Description <span className="text-error">*</span></label>
                    <textarea value={meta.description} onChange={(e) => update('description', e.target.value)} placeholder="Your page description" rows={3} className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    <p className="text-xs text-muted-foreground mt-1">{meta.description.length}/160</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Canonical URL</label>
                      <input type="text" value={meta.canonicalUrl} onChange={(e) => update('canonicalUrl', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Robots</label>
                      <input type="text" value={meta.robots} onChange={(e) => update('robots', e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg sketch-border p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Open Graph</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">OG Title</label>
                    <input type="text" value={meta.ogTitle} onChange={(e) => update('ogTitle', e.target.value)} placeholder="Same as title or custom" className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">OG Description</label>
                    <textarea value={meta.ogDescription} onChange={(e) => update('ogDescription', e.target.value)} rows={2} className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">OG Image URL</label>
                      <input type="text" value={meta.ogImage} onChange={(e) => update('ogImage', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">OG Type</label>
                      <select value={meta.ogType} onChange={(e) => update('ogType', e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="website">website</option>
                        <option value="article">article</option>
                        <option value="product">product</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg sketch-border p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Braces className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">JSON-LD Structured Data</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Schema Type</label>
                    <select value={meta.jsonLdType} onChange={(e) => update('jsonLdType', e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      {jsonLdTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">JSON-LD Data</label>
                    <textarea value={meta.jsonLdData} onChange={(e) => update('jsonLdData', e.target.value)} rows={8} className="w-full px-3 py-2 bg-background border border-input rounded-md text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y scrollbar-thin" />
                  </div>
                </div>
              </div>

              {/* Validation sidebar */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg sketch-border p-5 sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Validation</h3>
                    </div>
                    <span className={`text-2xl font-bold ${scoreColor(genScore)}`}>{genScore}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-4">
                    <div className={`h-full rounded-full transition-all duration-500 ${scoreBg(genScore)}`} style={{ width: `${genScore}%` }} />
                  </div>
                  <div className="space-y-2">
                    {genValidations.map((v) => (
                      <div key={v.label} className={`p-3 rounded-md border ${statusBg(v.status)} animate-fade-in-fast`}>
                        <div className="flex items-start gap-2">
                          {statusIcon(v.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{v.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{v.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {genScore === 100 && (
                    <div className="mt-4 p-3 bg-success/5 dark:bg-success/10 border border-success/20 rounded-md flex items-center gap-2 animate-scale-in">
                      <Sparkles className="w-4 h-4 text-success" />
                      <p className="text-xs font-medium text-success">All tags verified.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {genTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg sketch-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Google SERP Preview</h3>
                </div>
                <div className="max-w-xl">
                  <div className="text-xs text-[#202124] dark:text-sand-300 mb-1 truncate">{meta.canonicalUrl || 'https://yourwebsite.com'}</div>
                  <div className="text-xl text-[#1a0dab] dark:text-choco-300 leading-snug text-balance">{meta.title || 'Your Page Title'}</div>
                  <div className="text-sm text-[#4d5156] dark:text-sand-400 mt-1 text-pretty">{meta.description || 'Your meta description appears here.'}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg sketch-border p-6">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Facebook / OG</h3>
                  <div className="rounded-md overflow-hidden border border-border">
                    {meta.ogImage ? <img src={meta.ogImage} alt="OG preview" className="w-full aspect-[1.91/1] object-cover bg-secondary" /> : <div className="w-full aspect-[1.91/1] bg-secondary flex items-center justify-center text-muted-foreground text-sm">No image</div>}
                    <div className="p-3 bg-secondary">
                      <div className="text-xs text-muted-foreground uppercase truncate">{meta.ogUrl || 'yourwebsite.com'}</div>
                      <div className="text-sm font-semibold text-foreground mt-1 truncate">{meta.ogTitle || 'Your OG Title'}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{meta.ogDescription || 'Your OG description'}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-lg sketch-border p-6">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Twitter / X</h3>
                  <div className="rounded-md overflow-hidden border border-border">
                    {meta.twitterImage || meta.ogImage ? <img src={meta.twitterImage || meta.ogImage} alt="Twitter preview" className="w-full aspect-[2/1] object-cover bg-secondary" /> : <div className="w-full aspect-[2/1] bg-secondary flex items-center justify-center text-muted-foreground text-sm">No image</div>}
                    <div className="p-3 bg-secondary">
                      <div className="text-sm font-semibold text-foreground truncate">{meta.twitterTitle || 'Your Twitter Title'}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{meta.twitterDescription || 'Your Twitter description'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {genTab === 'code' && (
            <div className="bg-card rounded-lg sketch-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary">
                <span className="text-sm font-medium text-foreground">Generated HTML</span>
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-md transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto scrollbar-thin leading-relaxed">
                <code>{generatedHtml || '<!-- Fill in the form to generate meta tags -->'}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-20 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-foreground text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            Everything you need to know about AI readiness audits and meta tag generation.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-lg sketch-border overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="flex items-center justify-between w-full px-5 py-4 text-left">
                <span className="text-sm font-medium text-foreground text-balance">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 ml-2 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {expandedFaq === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed text-pretty animate-fade-in-fast">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
