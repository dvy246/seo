import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Gauge,
  Globe,
  Clock,
  Info,
  Loader2,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Tags,
  XCircle,
} from 'lucide-react';
import { SmartLink } from '@/components/SmartLink';
import { problemGuides } from '@/data/problems';
import { loadAuditHistory, upsertAuditHistory, clearAuditHistory, type AuditHistoryEntry } from '@/lib/storage';
import { buildChecks, calculateScores, type AuditCheck, type AuditScores, type AuditSnapshot, type CrawlerView } from '@/lib/validator';
import { extractSnapshotFromHtml } from '@/lib/htmlExtract';
import { validateRobotsDirective } from '@/lib/validator';

const CATEGORIES = ['SEO', 'Machine Readability', 'Social', 'Accessibility'] as const;

const categoryIcons: Record<string, typeof Search> = {
  SEO: Search,
  'Machine Readability': ShieldCheck,
  Social: Share2,
  Accessibility: Eye,
};

const categoryColors: Record<string, string> = {
  SEO: 'text-pastel-600 dark:text-pastel-400',
  'Machine Readability': 'text-success',
  Social: 'text-choco-600 dark:text-choco-400',
  Accessibility: 'text-pastel-500 dark:text-pastel-300',
};

interface AuditResult {
  snapshot: AuditSnapshot;
  checks: AuditCheck[];
  scores: AuditScores;
  cached?: boolean;
  crawlerViews?: CrawlerView[];
}

function statusIcon(status: AuditCheck['status']) {
  if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />;
  if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />;
  if (status === 'error') return <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />;
  return <Info className="w-4 h-4 text-ink-muted dark:text-sand-400 flex-shrink-0 mt-0.5" />;
}

function statusBg(status: AuditCheck['status']) {
  if (status === 'pass') return 'border-success/25 bg-success/5';
  if (status === 'warning') return 'border-warning/25 bg-warning/5';
  if (status === 'error') return 'border-error/25 bg-error/5';
  return 'border-sand-300/40 bg-sand-100/60 dark:bg-sand-800/50';
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
  const [compareCrawlers, setCompareCrawlers] = useState(false);
  const [history, setHistory] = useState<AuditHistoryEntry[]>(() => loadAuditHistory());

  const recordAudit = (url: string, overall: number, httpStatus: number | null) => {
    setHistory(upsertAuditHistory({ url, date: Date.now(), overall, httpStatus }));
  };

  const runUrlAudit = async (urlOverride?: string) => {
    const url = (urlOverride ?? auditUrl).trim();
    if (!url || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, crawlers: compareCrawlers ? ['googlebot', 'facebook'] : [] }),
      });
      const text = await res.text();
      let data: Record<string, unknown>;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          res.ok
            ? 'The audit endpoint returned a non-JSON response. If you are running `npm run dev`, the Cloudflare Function is not enabled — run `npx wrangler pages dev dist` instead, or test on the deployed site.'
            : `Audit endpoint returned ${res.status} ${res.statusText}.`
        );
      }
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : `Request failed (${res.status}).`);
      setResult({ snapshot: data as unknown as AuditSnapshot, checks: data.checks as AuditCheck[], scores: data.scores as AuditScores, cached: data.cached as boolean | undefined, crawlerViews: data.crawlerViews as CrawlerView[] | undefined });
      recordAudit(url, (data.scores as AuditScores)?.overall ?? 0, (data.httpStatus as number) ?? null);
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

  const proofSummary = useMemo(() => {
    if (!result) return '';
    const s = result.snapshot;
    const parts: string[] = [];
    parts.push(s.httpStatus ? `HTTP ${s.httpStatus}` : 'Pasted HTML');
    if (s.redirectChain.length > 0) parts.push(`${s.redirectChain.length} redirect${s.redirectChain.length === 1 ? '' : 's'}`);
    if (s.contentType) parts.push(s.contentType.split(';')[0].trim());
    if (s.ogImage && s.httpStatus > 0) parts.push('og:image set');
    if (s.robots && s.robots.toLowerCase().includes('noindex')) parts.push('noindex');
    if (s.title) parts.push(`"${s.title.slice(0, 40)}${s.title.length > 40 ? '…' : ''}"`);
    return parts.join(' · ');
  }, [result]);

  const exportReport = () => {
    if (!result) return;
    const payload = {
      exportedAt: new Date().toISOString(),
      url: result.snapshot.url,
      snapshot: result.snapshot,
      checks: result.checks,
      scores: result.scores,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `serpcraft-report-${(result.snapshot.url || 'page').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'page'}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const run = () => {
    if (mode === 'url') void runUrlAudit();
    else runHtmlAudit();
  };
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
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5">
            <p className="text-xs text-ink-muted dark:text-sand-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Fetched server-side (no CORS limits). Limited to 10 audits per hour per IP. Results cached 24h.
            </p>
            <label className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-sand-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={compareCrawlers}
                onChange={(e) => setCompareCrawlers(e.target.checked)}
                className="accent-choco-500 w-3.5 h-3.5"
              />
              Compare Googlebot & Facebook views
            </label>
          </div>

          {history.length > 0 && (
            <div className="mt-3 pt-3 border-t border-sand-200 dark:border-sand-800">
              <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-sand-400 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Recent audits (stored in your browser)</span>
                <button
                  onClick={() => {
                    clearAuditHistory();
                    setHistory([]);
                  }}
                  className="ml-auto text-ink-muted dark:text-sand-400 hover:text-error text-xs underline underline-offset-2"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {history.map((h) => (
                  <button
                    key={h.url}
                    onClick={() => {
                      setAuditUrl(h.url);
                      setMode('url');
                      runUrlAudit(h.url);
                    }}
                    className="chip bg-sand-100 dark:bg-sand-800 text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-700 transition-colors max-w-full"
                    title={`${h.url} — score ${h.overall}${h.httpStatus ? `, HTTP ${h.httpStatus}` : ''}`}
                  >
                    <span className="truncate max-w-[220px]">{h.url.replace(/^https?:\/\//, '')}</span>
                    <span className="text-ink-muted dark:text-sand-500 shrink-0">· {h.overall}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
          {/* Proof summary */}
          <div className="max-w-2xl mx-auto">
            <div className="p-3.5 rounded-xl border border-sand-200 dark:border-sand-800 bg-white dark:bg-sand-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-choco-600 dark:text-choco-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-ink-soft dark:text-sand-300 leading-relaxed">
                <span className="font-medium text-ink dark:text-sand-100">What was observed:</span> {proofSummary}
              </p>
            </div>
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Overall', score: result.scores.overall, icon: Gauge },
              { label: 'SEO', score: result.scores.seo, icon: Search },
              { label: 'Machine Readability', score: result.scores.machineReadability, icon: ShieldCheck },
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
              <div className="ml-auto flex items-center gap-2">
                {result.cached && <span className="chip bg-pastel-500/10 text-pastel-600 dark:text-pastel-300">Cached result</span>}
                <button
                  onClick={exportReport}
                  className="chip bg-choco-500/10 text-choco-600 dark:text-choco-300 hover:bg-choco-500/20 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download report
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">Requested URL</p>
                <p className="text-ink dark:text-sand-100 truncate" title={result.snapshot.url}>{result.snapshot.url === 'pasted-html' ? 'Pasted HTML' : result.snapshot.url}</p>
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
                <p className="text-ink-soft dark:text-sand-300">
                  {result.snapshot.hasLlmsTxt === null ? 'N/A' : result.snapshot.hasLlmsTxt ? 'Found (optional)' : 'Missing (optional)'}
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

          {/* Response & headers (URL mode only) */}
          {result.snapshot.httpStatus > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-choco-600 dark:text-choco-400" />
                <h3 className="text-sm font-semibold text-ink dark:text-sand-50 uppercase tracking-wide">Response & Headers</h3>
              </div>
              <div className="space-y-3 text-sm">
                {result.snapshot.redirectChain.length > 0 && (
                  <div>
                    <p className="text-xs text-ink-muted dark:text-sand-400 mb-1.5">Redirect chain</p>
                    <div className="space-y-1.5">
                      {result.snapshot.redirectChain.map((hop, i) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-xs">
                          <span className="chip bg-warning/10 text-warning flex-none">{hop.status}</span>
                          <span className="truncate text-ink-soft dark:text-sand-300">{hop.url}</span>
                          <span className="text-ink-muted dark:text-sand-500 flex-none">↓</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="chip bg-success/10 text-success flex-none">200</span>
                        <span className="truncate text-ink-soft dark:text-sand-300">{result.snapshot.finalUrl}</span>
                      </div>
                    </div>
                  </div>
                )}
                {result.snapshot.finalUrl && result.snapshot.finalUrl !== result.snapshot.url && result.snapshot.redirectChain.length === 0 && (
                  <div>
                    <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">Final URL</p>
                    <p className="font-mono text-xs text-ink-soft dark:text-sand-300 break-all">{result.snapshot.finalUrl}</p>
                  </div>
                )}
                {Object.keys(result.snapshot.headers).length > 0 && (
                  <div>
                    <p className="text-xs text-ink-muted dark:text-sand-400 mb-1.5">Response headers</p>
                    <div className="bg-sand-50 dark:bg-sand-900 border border-sand-200 dark:border-sand-800 rounded-lg overflow-hidden">
                      {Object.entries(result.snapshot.headers).map(([k, v]) => (
                        <div key={k} className="flex flex-col sm:flex-row sm:gap-3 px-3 py-1.5 border-b border-sand-200 dark:border-sand-800 last:border-b-0 font-mono text-xs">
                          <span className="text-choco-600 dark:text-choco-400 flex-none">{k}:</span>
                          <span className="text-ink-soft dark:text-sand-300 break-all">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Crawler comparison */}
          {result.crawlerViews && result.crawlerViews.length > 0 && <CrawlerComparison result={result} />}

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
                    {check.evidence && (
                      <details className="mt-2 group">
                        <summary className="flex items-center gap-1 text-xs font-medium text-choco-600 dark:text-choco-400 cursor-pointer select-none">
                          <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                          Show evidence
                        </summary>
                        <pre className="mt-2 text-xs font-mono bg-white dark:bg-sand-900 border border-sand-200 dark:border-sand-700 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap text-ink-soft dark:text-sand-300">{check.evidence}</pre>
                      </details>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Machine Readability gap CTA */}
          {result.scores.machineReadability < 80 && (
            <div className="p-5 rounded-xl border border-choco-200 dark:border-choco-800/60 bg-gradient-to-br from-sand-50 to-sand-100 dark:from-sand-900 dark:to-sand-900/60">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-choco-600 dark:text-choco-400 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-ink dark:text-sand-50 mb-0.5">Fix these issues in the studio</h4>
                  <p className="text-sm text-ink-soft dark:text-sand-300">
                    Your page scores {result.scores.machineReadability}/100 for machine readability. Open the studio to generate the structured data, meta tags, and robots directives that were flagged.
                  </p>
                </div>
                <SmartLink to="/studio" className="btn btn-secondary whitespace-nowrap">
                  Open studio <ArrowRight className="w-3.5 h-3.5" />
                </SmartLink>
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
          <h3 className="text-lg font-medium text-ink dark:text-sand-50 mb-2">Diagnose any published page</h3>
          <p className="text-sm text-ink-muted dark:text-sand-400 max-w-md mx-auto">
            Paste a URL and SerpCraft fetches it server-side — or paste raw HTML and it runs entirely in your browser — then shows exactly what search engines and social platforms can read, what conflicts exist, and how to fix them.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2.5">
            <SmartLink
              to="/seo-check"
              className="btn btn-primary"
            >
              <ArrowRight className="w-4 h-4" /> Run a quick SEO check
            </SmartLink>
            <span className="text-xs text-ink-muted dark:text-sand-400 sm:self-center">— or keep debugging below.</span>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-ink-muted dark:text-sand-400 self-center">Fixing a known problem?</span>
            {problemGuides.map((g) => (
              <SmartLink key={g.slug} to={g.path} className="chip bg-sand-100 dark:bg-sand-800 text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-700 transition-colors">
                {g.h1}
              </SmartLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =================== CRAWLER COMPARISON ===================

interface CrawlerRow {
  name: string;
  httpStatus: number;
  title: string | null;
  description: string | null;
  ogImage: string | null;
  canonical: string | null;
  robots: string | null;
  hasStructuredData: boolean;
}

function CrawlerComparison({ result }: { result: AuditResult }) {
  const s = result.snapshot;
  const rows: CrawlerRow[] = [
    {
      name: 'Default (SerpCraft)',
      httpStatus: s.httpStatus,
      title: s.title,
      description: s.description,
      ogImage: s.ogImage,
      canonical: s.canonical,
      robots: s.robots,
      hasStructuredData: s.hasStructuredData,
    },
    ...(result.crawlerViews || []).map((v) => ({
      name: v.name === 'googlebot' ? 'Googlebot' : v.name === 'facebook' ? 'Facebook crawler' : v.name,
      httpStatus: v.httpStatus,
      title: v.title,
      description: v.description,
      ogImage: v.ogImage,
      canonical: v.canonical,
      robots: v.robots,
      hasStructuredData: v.hasStructuredData,
    })),
  ];
  const base = rows[0];
  const diff = (value: unknown, baseValue: unknown) => value !== undefined && value !== baseValue;

  const statusCell = (row: CrawlerRow) => {
    const status = row.httpStatus;
    if (!status) return <span className="text-ink-muted dark:text-sand-500">unreachable</span>;
    const cls = status >= 200 && status < 300 ? 'chip bg-success/10 text-success' : status >= 400 ? 'chip bg-error/10 text-error' : 'chip bg-warning/10 text-warning';
    return <span className={cls}>{status}</span>;
  };

  const textCell = (value: string | null, baseValue: string | null) => {
    const differs = diff(value, baseValue);
    return (
      <td className={`py-2 pr-3 max-w-[200px] ${differs ? 'bg-amber-100/70 dark:bg-amber-500/10 rounded px-1' : ''}`}>
        <span className={`block truncate ${differs ? 'text-warning' : 'text-ink-soft dark:text-sand-300'}`} title={value || undefined}>
          {value || '—'}
        </span>
      </td>
    );
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Eye className="w-4 h-4 text-choco-600 dark:text-choco-400" />
        <h3 className="text-sm font-semibold text-ink dark:text-sand-50 uppercase tracking-wide">What each crawler sees</h3>
      </div>
      <p className="text-xs text-ink-muted dark:text-sand-400 mb-4">
        The same URL fetched with different user agents. Amber cells differ from the default view — a classic cause of "works in my browser" problems.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[720px]">
          <thead>
            <tr className="text-left text-ink-muted dark:text-sand-400 border-b border-sand-200 dark:border-sand-800">
              <th className="py-2 pr-3 font-medium">View</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Title</th>
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="py-2 pr-3 font-medium">OG image</th>
              <th className="py-2 pr-3 font-medium">Robots</th>
              <th className="py-2 font-medium">Schema</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-sand-100 dark:border-sand-800/60 last:border-b-0 align-top">
                <td className="py-2 pr-3 font-medium text-ink dark:text-sand-100 whitespace-nowrap">{row.name}</td>
                <td className="py-2 pr-3">{statusCell(row)}</td>
                {textCell(row.title, base.title)}
                {textCell(row.description, base.description)}
                {textCell(row.ogImage, base.ogImage)}
                {textCell(row.robots, base.robots)}
                <td className="py-2 pr-3">
                  <span className={row.hasStructuredData ? 'text-success' : 'text-ink-muted dark:text-sand-500'}>{row.hasStructuredData ? 'Yes' : 'No'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
