import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Eye,
  FileText,
  Gauge,
  Globe,
  Loader2,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Tags,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { navigateTo } from '@/lib/router';
import { buildChecks, calculateScores, type AuditCheck, type AuditScores, type AuditSnapshot } from '@/lib/validator';
import { extractSnapshotFromHtml } from '@/lib/htmlExtract';
import { validateRobotsDirective } from '@/lib/validator';

const CATEGORIES = ['SEO', 'AI Readiness', 'Social', 'Accessibility'] as const;

const categoryIcons: Record<string, typeof Search> = {
  SEO: Search,
  'AI Readiness': Bot,
  Social: Share2,
  Accessibility: Eye,
};

const categoryColors: Record<string, string> = {
  SEO: 'text-pastel-600 dark:text-pastel-400',
  'AI Readiness': 'text-success',
  Social: 'text-choco-600 dark:text-choco-400',
  Accessibility: 'text-pastel-500 dark:text-pastel-300',
};

interface AuditResult {
  snapshot: AuditSnapshot;
  checks: AuditCheck[];
  scores: AuditScores;
  cached?: boolean;
}

function statusIcon(status: AuditCheck['status']) {
  if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />;
  if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />;
  return <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />;
}

function statusBg(status: AuditCheck['status']) {
  if (status === 'pass') return 'border-success/25 bg-success/5';
  if (status === 'warning') return 'border-warning/25 bg-warning/5';
  return 'border-error/25 bg-error/5';
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-success';
  if (score >= 50) return 'text-warning';
  return 'text-error';
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-error';
}

export function AuditTool() {
  const [mode, setMode] = useState<'url' | 'html'>('url');
  const [auditUrl, setAuditUrl] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const runUrlAudit = async () => {
    const url = auditUrl.trim();
    if (!url || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setResult({ snapshot: data, checks: data.checks, scores: data.scores, cached: data.cached });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const runHtmlAudit = () => {
    const html = htmlInput.trim();
    if (!html || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const snapshot = extractSnapshotFromHtml(html, 'pasted-html');
      const checks = buildChecks(snapshot);
      const scores = calculateScores(checks);
      setResult({ snapshot, checks, scores });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not parse the HTML.');
    } finally {
      setLoading(false);
    }
  };

  const robotsVerdict = useMemo(() => {
    if (!result) return null;
    return validateRobotsDirective(result.snapshot.robots);
  }, [result]);

  const filteredChecks = useMemo(() => {
    if (!result) return [];
    return activeCategory === 'all' ? result.checks : result.checks.filter((c) => c.category === activeCategory);
  }, [result, activeCategory]);

  const run = mode === 'url' ? runUrlAudit : runHtmlAudit;
  const canRun = mode === 'url' ? !!auditUrl.trim() : !!htmlInput.trim();

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-sand-100 dark:bg-sand-900 border border-sand-200 dark:border-sand-800 w-fit mx-auto">
        <button
          onClick={() => setMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'url' ? 'bg-white dark:bg-sand-800 shadow-soft text-ink dark:text-sand-50' : 'text-ink-muted dark:text-sand-400 hover:text-ink dark:hover:text-sand-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          Audit a URL
        </button>
        <button
          onClick={() => setMode('html')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'html' ? 'bg-white dark:bg-sand-800 shadow-soft text-ink dark:text-sand-50' : 'text-ink-muted dark:text-sand-400 hover:text-ink dark:hover:text-sand-100'
          }`}
        >
          <Tags className="w-4 h-4" />
          Paste HTML
        </button>
      </div>

      {/* Input */}
      {mode === 'url' ? (
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted dark:text-sand-400 pointer-events-none" />
              <input
                type="text"
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && run()}
                placeholder="https://yoursite.com"
                className="field-input pl-10"
              />
            </div>
            <button onClick={run} disabled={loading || !canRun} className="btn btn-primary">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Auditing...
                </>
              ) : (
                <>
                  Audit <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-ink-muted dark:text-sand-400 mt-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Fetched server-side (no CORS limits). Limited to 10 audits per hour per IP. Results cached 24h.
          </p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={10}
            placeholder={'<html>\n  <head>\n    <title>Your page title</title>\n    <meta name="description" content="..." />\n  </head>\n</html>'}
            className="field-input font-mono text-xs resize-y"
          />
          <div className="flex justify-end mt-3">
            <button onClick={run} disabled={loading || !canRun} className="btn btn-primary">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  Analyze HTML <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-ink-muted dark:text-sand-400 mt-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Runs entirely in your browser. Nothing is sent to any server.
          </p>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto">
          <div className="p-3.5 rounded-lg border border-error/25 bg-error/5 text-sm text-error">{error}</div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="card p-5 space-y-3">
            <div className="h-4 w-40 bg-sand-200 dark:bg-sand-800 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-sand-100 dark:bg-sand-800 rounded-lg" />
              ))}
            </div>
            <div className="h-3 w-full bg-sand-100 dark:bg-sand-800 rounded" />
            <div className="h-3 w-3/4 bg-sand-100 dark:bg-sand-800 rounded" />
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Score cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Overall', score: result.scores.overall, icon: Gauge },
              { label: 'SEO', score: result.scores.seo, icon: Search },
              { label: 'AI Readiness', score: result.scores.aiReadiness, icon: Bot },
              { label: 'Social', score: result.scores.social, icon: Share2 },
              { label: 'Accessibility', score: result.scores.accessibility, icon: Eye },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <s.icon className="w-5 h-5 text-ink-muted dark:text-sand-400 mx-auto mb-2" />
                <div className={`text-3xl font-bold ${scoreColor(s.score)}`}>{s.score}</div>
                <div className="text-xs text-ink-muted dark:text-sand-400 mt-1">{s.label}</div>
                <div className="w-full h-1.5 bg-sand-100 dark:bg-sand-800 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${scoreBg(s.score)}`} style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Page info */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-choco-600 dark:text-choco-400" />
              <h3 className="text-sm font-semibold text-ink dark:text-sand-50 uppercase tracking-wide">Page Info</h3>
              {result.cached && <span className="chip bg-pastel-500/10 text-pastel-600 dark:text-pastel-300 ml-auto">Cached result</span>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">URL</p>
                <p className="text-ink dark:text-sand-100 truncate">{result.snapshot.url === 'pasted-html' ? 'Pasted HTML' : result.snapshot.url}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">Title</p>
                <p className="text-ink dark:text-sand-100 truncate">{result.snapshot.title || 'Not found'}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">Word Count</p>
                <p className="text-ink dark:text-sand-100">{result.snapshot.wordCount.toLocaleString()} words</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">HTTP Status</p>
                <p className="text-ink dark:text-sand-100">{result.snapshot.httpStatus || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">Structured Data</p>
                <p className="text-ink dark:text-sand-100">{result.snapshot.hasStructuredData ? result.snapshot.structuredDataTypes.join(', ') : 'None found'}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">llms.txt</p>
                <p className={result.snapshot.hasLlmsTxt ? 'text-success' : 'text-warning'}>
                  {result.snapshot.hasLlmsTxt === null ? 'N/A' : result.snapshot.hasLlmsTxt ? 'Found' : 'Missing'}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">H1 / H2</p>
                <p className="text-ink dark:text-sand-100">
                  {result.snapshot.h1Count} / {result.snapshot.h2Count}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">Images (missing alt)</p>
                <p className="text-ink dark:text-sand-100">
                  {result.snapshot.imageCount} ({result.snapshot.imagesWithoutAlt})
                </p>
              </div>
              {result.snapshot.loadTimeMs > 0 && (
                <div>
                  <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">Load Time</p>
                  <p className="text-ink dark:text-sand-100">{(result.snapshot.loadTimeMs / 1000).toFixed(2)}s</p>
                </div>
              )}
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">Indexing</p>
                <p className={robotsVerdict?.status === 'error' ? 'text-error' : robotsVerdict?.status === 'warning' ? 'text-warning' : 'text-success'}>
                  {result.snapshot.robots ? result.snapshot.robots : 'Indexable (default)'}
                </p>
              </div>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={`chip transition-colors ${activeCategory === 'all' ? 'bg-choco-500 text-white' : 'bg-white dark:bg-sand-900 border border-sand-200 dark:border-sand-700 text-ink-soft dark:text-sand-300 hover:border-sand-300 dark:hover:border-sand-600'}`}
            >
              All Checks ({result.checks.length})
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat];
              const count = result.checks.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`chip transition-colors ${activeCategory === cat ? 'bg-choco-500 text-white' : 'bg-white dark:bg-sand-900 border border-sand-200 dark:border-sand-700 text-ink-soft dark:text-sand-300 hover:border-sand-300 dark:hover:border-sand-600'}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${categoryColors[cat]}`} />
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Checks */}
          <div className="space-y-2.5">
            {filteredChecks.map((check, i) => {
              const Icon = categoryIcons[check.category];
              return (
                <div key={i} className={`p-4 rounded-xl border ${statusBg(check.status)} flex items-start gap-3`}>
                  {statusIcon(check.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <Icon className={`w-3.5 h-3.5 ${categoryColors[check.category]}`} />
                      <span className="text-sm font-medium text-ink dark:text-sand-100">{check.label}</span>
                      <span className="chip bg-white dark:bg-sand-800 border border-sand-200 dark:border-sand-700 text-ink-muted dark:text-sand-400">{check.category}</span>
                      <span
                        className={`chip ${
                          check.impact === 'high'
                            ? 'bg-error/10 text-error'
                            : check.impact === 'medium'
                              ? 'bg-warning/10 text-warning'
                              : 'bg-sand-100 dark:bg-sand-800 text-ink-muted dark:text-sand-400'
                        }`}
                      >
                        {check.impact}
                      </span>
                    </div>
                    <p className="text-sm text-ink-soft dark:text-sand-300">{check.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Readiness gap CTA */}
          {result.scores.aiReadiness < 80 && (
            <div className="card p-6 border-l-4 border-l-success">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-ink dark:text-sand-50 mb-1">AI Readiness gap detected</h4>
                  <p className="text-sm text-ink-soft dark:text-sand-300">
                    Your page scores {result.scores.aiReadiness}/100 for AI search visibility. Open the studio to generate the structured data, meta tags, and robots directives ChatGPT, Perplexity, and Google AI Overviews use to discover and cite content.
                  </p>
                  <button onClick={() => navigateTo('/studio')} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-choco-600 dark:text-choco-400 hover:underline">
                    Fix these issues <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="max-w-2xl mx-auto text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pastel-500/10 mb-4">
            <FileText className="w-8 h-8 text-pastel-600 dark:text-pastel-300" />
          </div>
          <h3 className="text-lg font-medium text-ink dark:text-sand-50 mb-2">Check any page for AI search readiness</h3>
          <p className="text-sm text-ink-muted dark:text-sand-400 max-w-md mx-auto">
            Paste a URL and MetaForge fetches your page server-side — or paste raw HTML and it runs entirely in your browser — then scores it across SEO, social sharing, AI search visibility, and accessibility.
          </p>
        </div>
      )}
    </div>
  );
}
