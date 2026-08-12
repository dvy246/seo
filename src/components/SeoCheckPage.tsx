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
  Printer,
  Bot,
  FileText
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
  const [aiIssues, setAiIssues] = useState<{ issue: string; advice: string; impact: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

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

      // Trigger AI Semantic Consultant in the background
      setAiLoading(true);
      setAiError('');
      setAiIssues([]);
      fetch('/api/ai-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      })
        .then((aiRes) => {
          if (!aiRes.ok) throw new Error('AI Consultant rate limited or failed.');
          return aiRes.json();
        })
        .then((aiData: any) => {
          if (Array.isArray(aiData.issues)) setAiIssues(aiData.issues);
        })
        .catch((err) => {
          setAiError(err.message);
        })
        .finally(() => {
          setAiLoading(false);
        });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const exportHtmlReport = () => {
    if (!result) return;
    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Report - ${result.snapshot.url}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FAFAF9; --ink: #1C1917; --muted: #78716C; --soft: #44403C;
      --card: #FFFFFF; --border: #E7E5E4;
      --error: #DC2626; --error-bg: #FEF2F2; --error-border: #FCA5A5;
      --warn: #D97706; --warn-bg: #FFFBEB; --warn-border: #FCD34D;
      --pass: #16A34A; --pass-bg: #F0FDF4; --pass-border: #86EFAC;
      --brand: #5D4037; --brand-light: #D7CCC8;
    }
    body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; color: var(--ink); background: var(--bg); margin: 0; padding: 2rem 1rem; -webkit-font-smoothing: antialiased; }
    .container { max-width: 800px; margin: 0 auto; }
    h1, h2, h3, h4 { font-family: 'Fraunces', Georgia, serif; color: var(--ink); margin-top: 0; }
    a { color: var(--brand); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .header { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 2.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
    .header-text p { margin: 0.25rem 0; color: var(--muted); font-size: 0.9rem; }
    .header-text h1 { margin: 0 0 0.5rem 0; font-size: 1.75rem; word-break: break-all; }
    .score-box { text-align: center; background: var(--bg); padding: 1.5rem; border-radius: 12px; min-width: 120px; border: 1px solid var(--border); }
    .score-val { font-size: 3.5rem; font-weight: 700; line-height: 1; letter-spacing: -0.02em; }
    .score-lbl { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin-top: 0.5rem; font-family: 'Inter', sans-serif; font-weight: 600; }
    .section-title { font-size: 1.25rem; margin: 2.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid var(--brand-light); }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
    .card-error { background: var(--error-bg); border-color: var(--error-border); }
    .card-warning { background: var(--warn-bg); border-color: var(--warn-border); }
    .card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; }
    .card-title { margin: 0; font-family: 'Inter', sans-serif; font-size: 1rem; font-weight: 600; }
    .pill { font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.02em; white-space: nowrap; }
    .pill-error { background: rgba(220,38,38,0.1); color: var(--error); }
    .pill-warning { background: rgba(217,119,6,0.1); color: var(--warn); }
    .pill-pass { background: rgba(22,163,74,0.1); color: var(--pass); }
    .card p { margin: 0; font-size: 0.95rem; color: var(--soft); }
    pre { background: #FFFFFF; border: 1px solid rgba(0,0,0,0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: var(--muted); margin-top: 1rem; white-space: pre-wrap; word-break: break-all; }
    .pass-list { list-style: none; padding: 0; margin: 0; }
    .pass-list li { background: var(--pass-bg); border: 1px solid var(--pass-border); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; gap: 0.75rem; align-items: flex-start; }
    .pass-list li svg { width: 20px; height: 20px; color: var(--pass); flex-shrink: 0; margin-top: 0.1rem; }
    .ai-note { font-size: 0.9rem; color: var(--muted); font-style: italic; margin-bottom: 1.5rem; background: #F3E8FF; padding: 1rem; border-radius: 8px; border: 1px solid #E9D5FF; color: #6B21A8; }
    .footer { text-align: center; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.85rem; }
    @media print {
      body { background: white !important; }
      .header, .card { box-shadow: none !important; break-inside: avoid; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-text">
        <p>SEO Analysis Report</p>
        <h1><a href="${result.snapshot.url}" target="_blank">${result.snapshot.url}</a></h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
      </div>
      <div class="score-box">
        <div class="score-val" style="color: ${result.scores.overall >= 80 ? 'var(--pass)' : result.scores.overall >= 50 ? 'var(--warn)' : 'var(--error)'}">${result.scores.overall}</div>
        <div class="score-lbl">Overall Score</div>
      </div>
    </div>

    <h2 class="section-title">Prioritized Fixes</h2>
    ${result.checks.filter(c => c.status !== 'pass').sort((a, b) => impactRank(a.impact) - impactRank(b.impact)).map(c => `
      <div class="card card-${c.status}">
        <div class="card-header">
          <h3 class="card-title">${c.label}</h3>
          <span class="pill pill-${c.status}">${c.impact} impact</span>
        </div>
        <p>${c.message}</p>
        ${c.evidence ? `<pre>${c.evidence.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>` : ''}
      </div>
    `).join('') || '<p>No errors or warnings found!</p>'}

    ${aiIssues.length > 0 ? `
    <h2 class="section-title">AI Semantic Consultant</h2>
    <p class="ai-note">This semantic analysis is provided by AI and focuses on intent, copywriting, and E-E-A-T trust signals.</p>
    ${aiIssues.map(ai => `
      <div class="card" style="background: #FAFAFA">
        <div class="card-header">
          <h3 class="card-title">${ai.issue}</h3>
          <span class="pill" style="background:#F3E8FF; color:#7E22CE">AI Insight</span>
        </div>
        <p style="margin-top: 0.75rem"><strong>Recommendation:</strong> ${ai.advice}</p>
      </div>
    `).join('')}
    ` : ''}

    <h2 class="section-title">Passed Checks (${result.checks.filter(c => c.status === 'pass').length})</h2>
    <ul class="pass-list">
      ${result.checks.filter(c => c.status === 'pass').map(c => `
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>
          <div>
            <strong>${c.label}</strong>
            <div style="font-size: 0.85rem; color: var(--soft); margin-top: 0.25rem;">${c.message}</div>
          </div>
        </li>
      `).join('')}
    </ul>

    <div class="footer">
      Generated by <strong>SerpCraft SEO Studio</strong>
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `seo-report-${(result.snapshot.url || 'page').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'page'}.html`;
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
              <div className="mt-5 flex items-center gap-2 flex-wrap pt-4 border-t border-sand-200 dark:border-sand-800 print:hidden">
                <button
                  onClick={() => void run()}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-run check
                </button>
                <button onClick={handlePrint} className="btn btn-ghost">
                  <Printer className="w-3.5 h-3.5" /> Print Report
                </button>
                <button onClick={exportHtmlReport} className="btn btn-ghost">
                  <FileText className="w-3.5 h-3.5" /> Export HTML
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

          {/* AI Semantic Consultant */}
          {(aiLoading || aiIssues.length > 0 || aiError) && (
            <section className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-4 h-4 text-choco-600 dark:text-choco-400" />
                <h3 className="text-sm font-semibold text-ink dark:text-sand-50">AI Semantic Consultant</h3>
                <span className="text-xs text-ink-muted dark:text-sand-400">— semantic & intent analysis</span>
              </div>
              
              {aiLoading ? (
                <div className="p-5 rounded-xl border border-sand-200 dark:border-sand-800 bg-white dark:bg-sand-900 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-choco-600 dark:text-choco-400" />
                  <p className="text-sm text-ink-soft dark:text-sand-300">AI is analyzing semantic intent and E-E-A-T signals...</p>
                </div>
              ) : aiError ? (
                // Graceful degradation: show a quiet warning if AI fails, but don't break the page
                <div className="p-4 rounded-xl border border-warning/30 bg-warning/[0.04] text-sm text-warning flex items-start gap-2.5 print:hidden">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>AI analysis is temporarily unavailable due to high demand. Your technical SEO results above are still 100% accurate.</p>
                </div>
              ) : aiIssues.length === 0 ? (
                <div className="p-4 rounded-xl border border-success/25 bg-success/[0.03] flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-ink-soft dark:text-sand-200">The AI found no semantic or intent issues. Your content appears highly relevant and well-structured.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {aiIssues.map((ai, i) => (
                    <div key={i} className="p-4 rounded-xl border border-sand-200 dark:border-sand-800 bg-white dark:bg-sand-900">
                      <div className="flex items-start gap-3 mb-2">
                        <Sparkles className="w-4 h-4 text-choco-600 dark:text-choco-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-ink dark:text-sand-50">{ai.issue}</p>
                        </div>
                      </div>
                      <div className="pl-7">
                        <p className="text-sm text-ink-soft dark:text-sand-300 bg-sand-50 dark:bg-sand-900/50 p-3 rounded-lg border border-sand-100 dark:border-sand-800/60">
                          <span className="font-semibold block mb-1">Recommendation:</span>
                          {ai.advice}
                        </p>
                      </div>
                    </div>
                  ))}
                  <SmartLink
                    to="/visual-seo-studio"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-choco-600 dark:text-choco-400 hover:underline underline-offset-2 print:hidden"
                  >
                    Fix these semantic issues in the Visual SEO Studio <ArrowRight className="w-3.5 h-3.5" />
                  </SmartLink>
                </div>
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
            Paste a URL above. SerpCraft fetches it server-side and runs 21 in-page SEO checks — meta tags, content, Open Graph, structured data, accessibility, and machine-readiness signals. We extract raw HTML evidence (like canonical mismatches and redirect chains) so you know exactly what search engines see. No account, no email, no install.
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
