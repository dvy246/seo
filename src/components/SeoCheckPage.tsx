import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Gauge,
  Info,
  Lightbulb,
  ListChecks,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';
import { SmartLink } from '@/components/SmartLink';
import { problemGuides } from '@/data/problems';
import { upsertAuditHistory, loadAuditHistory, clearAuditHistory, type AuditHistoryEntry } from '@/lib/storage';
import {
  validateRobotsDirective,
  type AuditCheck,
  type AuditScores,
  type AuditSnapshot,
  type AuditImpact,
  type AuditStatus,
} from '@/lib/validator';

const CATEGORY_ORDER = ['SEO', 'Machine Readability', 'Social', 'Accessibility'] as const;
type Category = (typeof CATEGORY_ORDER)[number];

/** Letter grade from 0–100. Transparent: legend printed under the score. */
function gradeFor(score: number): { letter: string; tone: string; bar: string } {
  if (score >= 90) return { letter: 'A', tone: 'text-success', bar: 'bg-success' };
  if (score >= 80) return { letter: 'B', tone: 'text-success', bar: 'bg-success' };
  if (score >= 70) return { letter: 'C', tone: 'text-warning', bar: 'bg-warning' };
  if (score >= 50) return { letter: 'D', tone: 'text-warning', bar: 'bg-warning' };
  return { letter: 'F', tone: 'text-error', bar: 'bg-error' };
}

function impactRank(i: AuditImpact): number {
  return i === 'high' ? 0 : i === 'medium' ? 1 : 2;
}

function statusIcon(status: AuditStatus) {
  if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />;
  if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />;
  if (status === 'error') return <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />;
  return <Info className="w-4 h-4 text-ink-muted dark:text-sand-400 flex-shrink-0 mt-0.5" />;
}

function statusBorder(status: AuditStatus) {
  if (status === 'error') return 'border-error/30 bg-error/[0.04]';
  if (status === 'warning') return 'border-warning/30 bg-warning/[0.04]';
  if (status === 'pass') return 'border-success/25 bg-success/[0.03]';
  return 'border-sand-200 dark:border-sand-800 bg-sand-50 dark:bg-sand-900/50';
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-success';
  if (score >= 50) return 'text-warning';
  return 'text-error';
}

function scoreBar(score: number) {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-error';
}

interface SeoCheckResult {
  snapshot: AuditSnapshot;
  checks: AuditCheck[];
  scores: AuditScores;
  cached?: boolean;
}

const CATEGORY_LABELS: Record<Category, { label: string; short: string }> = {
  SEO: { label: 'SEO', short: 'SEO Meta & Content' },
  'Machine Readability': { label: 'Readability', short: 'Technical & AI Readability' },
  Social: { label: 'Social', short: 'Open Graph & Social' },
  Accessibility: { label: 'Access', short: 'Accessibility' },
};

export function SeoCheckPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<SeoCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasses, setShowPasses] = useState(false);
  const [history, setHistory] = useState<AuditHistoryEntry[]>(() => loadAuditHistory());

  const run = async (urlOverride?: string) => {
    const target = (urlOverride ?? url).trim();
    if (!target || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target, crawlers: [] }),
      });
      const text = await res.text();
      let data: unknown;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          res.ok
            ? 'The audit endpoint returned a non-JSON response. If you are running `npm run dev`, the Cloudflare Function is not enabled — run `npx wrangler pages dev dist` instead, or test on the deployed site.'
            : `Audit endpoint returned ${res.status} ${res.statusText}.`
        );
      }
      if (!res.ok) {
        const msg = data && typeof data === 'object' && 'error' in data ? String((data as { error: unknown }).error) : `Request failed (${res.status}).`;
        throw new Error(msg);
      }
      setResult({ snapshot: data as AuditSnapshot, checks: (data as { checks: AuditCheck[] }).checks, scores: (data as { scores: AuditScores }).scores, cached: (data as { cached?: boolean }).cached });
      setHistory(upsertAuditHistory({ url: target, date: Date.now(), overall: (data as { scores: AuditScores }).scores?.overall ?? 0, httpStatus: (data as { httpStatus: number }).httpStatus ?? null }));
      if (urlOverride) setUrl(urlOverride);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!result) return;
    const payload = {
      exportedAt: new Date().toISOString(),
      tool: 'SerpCraft SEO Check',
      url: result.snapshot.url,
      snapshot: result.snapshot,
      checks: result.checks,
      scores: result.scores,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `seo-check-${(result.snapshot.url || 'page').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'page'}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const errors = useMemo(() => (result ? result.checks.filter((c) => c.status === 'error') : []), [result]);
  const warnings = useMemo(() => (result ? result.checks.filter((c) => c.status === 'warning') : []), [result]);
  const passes = useMemo(() => (result ? result.checks.filter((c) => c.status === 'pass') : []), [result]);

  /** The fix-plan hero: top 3 failing checks ranked by impact. */
  const topFixes = useMemo<AuditCheck[]>(() => {
    if (!result) return [];
    return [...result.checks.filter((c) => c.status === 'error' || c.status === 'warning')]
      .sort((a, b) => impactRank(a.impact) - impactRank(b.impact))
      .slice(0, 3);
  }, [result]);

  const overallGrade = result ? gradeFor(result.scores.overall) : null;
  const canRun = !!url.trim() && !loading;
  const robotsVerdict = result ? validateRobotsDirective(result.snapshot.robots) : null;
  const sampleHistory = history.slice(0, 4);

  return (
    <div className="space-y-7">
      {/* Input surface — the focal control. URL-only, no mode toggle. */}
      <section className="max-w-2xl mx-auto" aria-label="Run an SEO check">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted dark:text-sand-400 pointer-events-none" aria-hidden />
            <input
              type="url"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com"
              aria-label="Website URL to check"
              className="field-input pl-10"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={!canRun} className="btn btn-primary whitespace-nowrap">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Checking…
              </>
            ) : (
              <>
                <Gauge className="w-4 h-4" /> Check SEO
              </>
            )}
          </button>
        </form>
        <p className="text-xs text-ink-muted dark:text-sand-400 mt-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
          Fetched server-side — no signup, no install. 10 checks/hour per IP. Results cached 24h.
        </p>
      </section>

      {error && (
        <div className="max-w-2xl mx-auto">
          <div className="p-4 rounded-xl border border-error/30 bg-error/[0.05] text-sm text-error flex items-start gap-2.5">
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Couldn’t run the check.</p>
              <p className="mt-0.5 text-error/90">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-3xl mx-auto space-y-4 animate-pulse" aria-busy="true" aria-live="polite">
          <div className="card p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-sand-100 dark:bg-sand-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-sand-100 dark:bg-sand-800 rounded" />
              <div className="h-3 w-full bg-sand-100 dark:bg-sand-800 rounded" />
              <div className="h-3 w-2/3 bg-sand-100 dark:bg-sand-800 rounded" />
            </div>
          </div>
          <div className="card p-5 space-y-3">
            <div className="h-4 w-40 bg-sand-100 dark:bg-sand-800 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-sand-100 dark:bg-sand-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && overallGrade && (
        <div className="space-y-7 animate-[fadeIn_180ms_ease-out]">
          {/* Score header: grade + page summary + actions */}
          <section className="max-w-3xl mx-auto">
            <div className="card p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-sand-50 dark:bg-sand-900 border border-sand-200 dark:border-sand-800 flex-shrink-0">
                    <span className={`text-3xl font-bold leading-none ${overallGrade.tone}`}>{overallGrade.letter}</span>
                    <span className="text-[10px] font-medium text-ink-muted dark:text-sand-500 uppercase tracking-wide mt-1">SEO Grade</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-ink-muted dark:text-sand-400 uppercase tracking-wide">SEO Score</p>
                    <p className="flex items-baseline gap-1.5">
                      <span className={`text-4xl font-bold ${scoreColor(result.scores.overall)}`}>{result.scores.overall}</span>
                      <span className="text-sm text-ink-muted dark:text-sand-400">/ 100</span>
                    </p>
                    <p className="mt-1 text-sm text-ink-soft dark:text-sand-300 truncate" title={result.snapshot.url}>
                      {result.snapshot.url}
                    </p>
                  </div>
                </div>
                <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
                  {result.cached && <span className="chip bg-sand-100 dark:bg-sand-800 text-ink-muted dark:text-sand-400">Cached</span>}
                  {result.snapshot.httpStatus > 0 && (
                    <span className={`chip ${result.snapshot.httpStatus >= 200 && result.snapshot.httpStatus < 300 ? 'bg-success/10 text-success' : result.snapshot.httpStatus >= 400 ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>
                      HTTP {result.snapshot.httpStatus}
                    </span>
                  )}
                  {robotsVerdict?.status === 'error' && <span className="chip bg-error/10 text-error">noindex</span>}
                </div>
              </div>

              {/* One-line reading in human copy. */}
              <p className="mt-5 text-sm leading-relaxed text-ink-soft dark:text-sand-300">
                {errors.length === 0 && warnings.length === 0 ? (
                  <>No SEO issues found. {result.checks.length} checks passed — your on-page setup looks solid.</>
                ) : (
                  <>
                    <span className="font-medium text-ink dark:text-sand-100">{errors.length} error{errors.length === 1 ? '' : 's'}</span>{' '}
                    and <span className="font-medium text-ink dark:text-sand-100">{warnings.length} warning{warnings.length === 1 ? '' : 's'}</span>{' '}
                    across {result.checks.length} checks. The fix plan below ranks what to do first — highest impact at the top.
                  </>
                )}
              </p>

              {/* Category breakdown */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORY_ORDER.map((cat) => {
                  const key = cat === 'SEO' ? 'seo' : cat === 'Machine Readability' ? 'machineReadability' : cat === 'Social' ? 'social' : 'accessibility';
                  const s = result.scores[key];
                  return (
                    <div key={cat} className="p-3 rounded-xl bg-sand-50 dark:bg-sand-900/60 border border-sand-200 dark:border-sand-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-ink-soft dark:text-sand-300">{CATEGORY_LABELS[cat].label}</span>
                        <span className={`text-sm font-semibold ${scoreColor(s)}`}>{s}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-sand-100 dark:bg-sand-800 mt-2 overflow-hidden">
                        <div className={`h-full rounded-full transition-[width] duration-500 ${scoreBar(s)}`} style={{ width: `${s}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-2 flex-wrap pt-4 border-t border-sand-200 dark:border-sand-800">
                <button
                  onClick={() => void run()}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-run check
                </button>
                <button onClick={exportReport} className="btn btn-ghost">
                  <Download className="w-3.5 h-3.5" /> Download report
                </button>
                <a
                  href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(result.snapshot.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Rich Results test
                </a>
              </div>
            </div>
          </section>

          {/* The fix plan — the differentiator. Top 3 by impact. */}
          {topFixes.length > 0 && (
            <section className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-terra-600 dark:text-terra-400" />
                <h3 className="text-sm font-semibold text-ink dark:text-sand-50">What to fix first</h3>
                <span className="text-xs text-ink-muted dark:text-sand-400">— ranked by impact</span>
              </div>
              <div className="space-y-2.5">
                {topFixes.map((c, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${statusBorder(c.status)} flex items-start gap-3`}>
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-ink/5 dark:bg-sand-50/10 text-xs font-semibold text-ink-soft dark:text-sand-300 flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {statusIcon(c.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-ink dark:text-sand-100">{c.label}</span>
                        <span className={`chip ${c.impact === 'high' ? 'bg-error/10 text-error' : c.impact === 'medium' ? 'bg-warning/10 text-warning' : 'bg-sand-100 dark:bg-sand-800 text-ink-muted dark:text-sand-400'}`}>
                          {c.impact} impact
                        </span>
                      </div>
                      <p className="text-sm text-ink-soft dark:text-sand-300 mt-0.5">{c.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              {result.scores.machineReadability < 80 && (
                <SmartLink
                  to="/studio"
                  className="mt-4 w-full p-4 rounded-xl border border-choco-200 dark:border-choco-800/60 bg-gradient-to-br from-sand-50 to-sand-100 dark:from-sand-900 dark:to-sand-900/60 hover:shadow-soft transition-all duration-200 text-left block"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-choco-600 dark:text-choco-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink dark:text-sand-50">Fix these in the studio</p>
                      <p className="text-xs text-ink-muted dark:text-sand-400 mt-0.5">Generate the meta tags, JSON-LD, and robots directives the check flagged.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-choco-600 dark:text-choco-400 flex-shrink-0" />
                  </div>
                </SmartLink>
              )}
            </section>
          )}

          {/* Full checks list — fail/warn by default, passes behind a disclosure. */}
          <section className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-4 h-4 text-choco-600 dark:text-choco-400" />
              <h3 className="text-sm font-semibold text-ink dark:text-sand-50">Full check list</h3>
              <span className="ml-auto text-xs text-ink-muted dark:text-sand-400">
                {result.checks.length} checks · {passes.length} passed · {warnings.length} warnings · {errors.length} errors
              </span>
            </div>

            <div className="space-y-2.5">
              {[...errors, ...warnings]
                .sort((a, b) => impactRank(a.impact) - impactRank(b.impact))
                .map((check, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${statusBorder(check.status)} flex items-start gap-3`}>
                    {statusIcon(check.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-sm font-medium text-ink dark:text-sand-100">{check.label}</span>
                        <span className="chip bg-sand-100 dark:bg-sand-800 border border-sand-200 dark:border-sand-700 text-ink-muted dark:text-sand-400">
                          {check.category}
                        </span>
                        <span className={`chip ${check.impact === 'high' ? 'bg-error/10 text-error' : check.impact === 'medium' ? 'bg-warning/10 text-warning' : 'bg-sand-100 dark:bg-sand-800 text-ink-muted dark:text-sand-400'}`}>
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
                ))}
            </div>

            {passes.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => setShowPasses((v) => !v)}
                  className="flex items-center gap-1.5 text-sm text-ink-muted dark:text-sand-400 hover:text-ink dark:hover:text-sand-100 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showPasses ? 'rotate-180' : ''}`} />
                  {showPasses ? 'Hide' : 'Show'} {passes.length} passing check{passes.length === 1 ? '' : 's'}
                </button>
                {showPasses && (
                  <div className="space-y-1.5 mt-3">
                    {passes.map((check, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-success/[0.03] border border-success/15">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-ink-soft dark:text-sand-200">{check.label}</span>
                          <p className="text-xs text-ink-muted dark:text-sand-400">{check.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Power-user rail: cross-link to URL Debugger */}
          <section className="max-w-3xl mx-auto">
            <div className="p-5 rounded-xl border border-sand-200 dark:border-sand-800 bg-sand-50 dark:bg-sand-900/50">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-terra-600 dark:text-terra-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink dark:text-sand-50">Need the deep view?</p>
                  <p className="text-sm text-ink-soft dark:text-sand-300 mt-0.5">
                    Open the URL Debugger for paste-HTML mode, raw response headers, redirect-chain visualization, and a Googlebot-vs-Facebook crawler comparison of the same URL.
                  </p>
                  <SmartLink
                    to="/url-debugger"
                    className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-choco-600 dark:text-choco-400 hover:underline underline-offset-2"
                  >
                    Open URL Debugger <ArrowRight className="w-3.5 h-3.5" />
                  </SmartLink>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Empty state — teaches the tool. */}
      {!result && !loading && !error && (
        <section className="max-w-2xl mx-auto text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-choco-500/10 dark:bg-choco-500/15 mb-5">
            <Gauge className="w-8 h-8 text-choco-600 dark:text-choco-400" />
          </div>
          <h3 className="text-xl font-medium text-ink dark:text-sand-50 mb-2">Check any page’s SEO in seconds</h3>
          <p className="text-sm text-ink-muted dark:text-sand-400 max-w-md mx-auto leading-relaxed">
            Paste a URL above. SerpCraft fetches it server-side and runs 21 in-page SEO checks — meta tags, content, Open Graph, structured data, accessibility, and AI-readiness signals — then gives you a grade and a ranked fix list. No account, no email, no install.
          </p>

          {sampleHistory.length > 0 && (
            <div className="mt-6 pt-5 border-t border-sand-200 dark:border-sand-800 text-left">
              <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-sand-400 mb-2.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Re-check a recent site</span>
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
                {sampleHistory.map((h) => (
                  <button
                    key={h.url}
                    onClick={() => void run(h.url)}
                    className="chip bg-white dark:bg-sand-900 border border-sand-200 dark:border-sand-700 text-ink-soft dark:text-sand-300 hover:border-choco-300 dark:hover:border-choco-700 transition-colors max-w-full"
                    title={`${h.url} — score ${h.overall}${h.httpStatus ? `, HTTP ${h.httpStatus}` : ''}`}
                  >
                    <span className="truncate max-w-[200px]">{h.url.replace(/^https?:\/\//, '')}</span>
                    <span className={`shrink-0 ${scoreColor(h.overall)}`}>· {h.overall}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-sand-200 dark:border-sand-800">
            <p className="text-xs text-ink-muted dark:text-sand-400 mb-2.5">Fixing a known problem?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {problemGuides.slice(0, 4).map((g) => (
                <SmartLink
                  key={g.slug}
                  to={g.path}
                  className="chip bg-sand-100 dark:bg-sand-800 text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-700 transition-colors"
                >
                  {g.h1}
                </SmartLink>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
