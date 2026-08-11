import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, Download, Loader2, X, GitCompare, Globe, FileText } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';
import type { ReleaseDiffReport, DiffFinding, DiffSeverity } from '@/lib/releaseDiff';

interface FormState {
  urlA: string;
  urlB: string;
}

export function ReleaseDiffPage() {
  const { theme } = useTheme();
  const [form, setForm] = useState<FormState>({ urlA: '', urlB: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [report, setReport] = useState<ReleaseDiffReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const validate = () => {
    const newErrors: Partial<FormState> = {};
    if (!form.urlA.trim()) newErrors.urlA = 'Baseline URL (staging/old) is required';
    else if (!/^https?:\/\/.+/.test(form.urlA)) newErrors.urlA = 'Must be a valid HTTP/HTTPS URL';
    if (!form.urlB.trim()) newErrors.urlB = 'New URL (production/new) is required';
    else if (!/^https?:\/\/.+/.test(form.urlB)) newErrors.urlB = 'Must be a valid HTTP/HTTPS URL';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const response = await fetch('/api/release-diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Comparison failed');
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const markdown = generateMarkdown(report);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `release-diff-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const severityConfig: Record<DiffSeverity, { icon: typeof AlertTriangle; label: string; color: string; bg: string }> = {
    blocker: { icon: AlertTriangle, label: 'Release Blocker', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
    warning: { icon: AlertTriangle, label: 'Warning', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
    info: { icon: Info, label: 'Informational', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
  };

  const severityOrder: DiffSeverity[] = ['blocker', 'warning', 'info'];

  if (!report) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-choco-900/30' : 'bg-choco-100'}`}>
              <GitCompare className="w-8 h-8 text-choco-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">SEO Release Diff</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Compare two URLs and catch SEO regressions before you ship. Evidence-first reports — no scores, just what changed, why it matters, and how to fix it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={`rounded-2xl border p-8 space-y-6 ${theme === 'dark' ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white'}`}>
            <div>
              <label className="block text-sm font-medium mb-2">Baseline URL <span className="text-muted-foreground">(staging / old version)</span></label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="url"
                  value={form.urlA}
                  onChange={e => { setForm(prev => ({ ...prev, urlA: e.target.value })); if (errors.urlA) setErrors(prev => ({ ...prev, urlA: undefined })); }}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.urlA ? 'border-red-500' : theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}
                  placeholder="https://staging.example.com/page"
                  autoFocus
                />
              </div>
              {errors.urlA && <p className="mt-1 text-sm text-red-500">{errors.urlA}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New URL <span className="text-muted-foreground">(production / new version)</span></label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="url"
                  value={form.urlB}
                  onChange={e => { setForm(prev => ({ ...prev, urlB: e.target.value })); if (errors.urlB) setErrors(prev => ({ ...prev, urlB: undefined })); }}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.urlB ? 'border-red-500' : theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}`}
                  placeholder="https://example.com/page"
                />
              </div>
              {errors.urlB && <p className="mt-1 text-sm text-red-500">{errors.urlB}</p>}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Both URLs must be publicly accessible (no auth/firewall). Max 10s timeout per URL.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  <GitCompare className="w-5 h-5" />
                  Compare URLs
                </>
              )}
            </button>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </form>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className={`rounded-xl p-6 text-center ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} border`}>
              <GitCompare className="w-10 h-10 mx-auto text-choco-500 mb-3" />
              <h3 className="font-semibold mb-1">Staging vs Production</h3>
              <p className="text-sm text-muted-foreground">Catch noindex, canonical, redirect issues before deploy</p>
            </div>
            <div className={`rounded-xl p-6 text-center ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} border`}>
              <GitCompare className="w-10 h-10 mx-auto text-choco-500 mb-3" />
              <h3 className="font-semibold mb-1">Migration Guard</h3>
              <p className="text-sm text-muted-foreground">Old URL → New URL: verify 301s, canonicals, indexability</p>
            </div>
            <div className={`rounded-xl p-6 text-center ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} border`}>
              <GitCompare className="w-10 h-10 mx-auto text-choco-500 mb-3" />
              <h3 className="font-semibold mb-1">Regression Watch</h3>
              <p className="text-sm text-muted-foreground">Save baseline, compare later, get notified on changes</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Report view
  const { findings, summary, urlA, urlB, timestamp } = report;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Release Diff Report</h1>
            <p className="text-muted-foreground">
              Generated {new Date(timestamp).toLocaleString()} ·{' '}
              <span className="font-mono text-sm">{urlA}</span> → <span className="font-mono text-sm">{urlB}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Markdown
            </button>
            <button
              onClick={() => { setReport(null); setForm({ urlA: '', urlB: '' }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
              New Comparison
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className={`rounded-xl p-5 border ${theme === 'dark' ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-red-700 dark:text-red-300">Release Blockers</span>
            </div>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400">{summary.blockers}</div>
            <p className="text-sm text-muted-foreground mt-1">Must fix before release</p>
          </div>
          <div className={`rounded-xl p-5 border ${theme === 'dark' ? 'bg-amber-900/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-amber-700 dark:text-amber-300">Warnings</span>
            </div>
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">{summary.warnings}</div>
            <p className="text-sm text-muted-foreground mt-1">Review before release</p>
          </div>
          <div className={`rounded-xl p-5 border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-700 dark:text-blue-300">Informational</span>
            </div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{summary.info}</div>
            <p className="text-sm text-muted-foreground mt-1">No action required</p>
          </div>
        </div>

        {/* Findings */}
        {findings.length === 0 ? (
          <div className={`rounded-2xl p-12 text-center ${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} border`}>
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Differences Found</h2>
            <p className="text-muted-foreground">Both URLs are identical across all 12 critical SEO checks. Safe to release!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {severityOrder.map(severity => {
              const items = findings.filter(f => f.severity === severity);
              if (items.length === 0) return null;
              const config = severityConfig[severity];
              const Icon = config.icon;

              return (
                <section key={severity} className="space-y-3">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Icon className={config.color} />
                    {config.label} ({items.length})
                  </h2>
                  <div className="space-y-3">
                    {items.map(finding => {
                      const isExpanded = expandedIds.has(finding.id);
                      return (
                        <article
                          key={finding.id}
                          className={`rounded-xl border p-5 transition-all ${config.bg} ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-semibold text-lg">{finding.label}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                                  {finding.category}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-3">{finding.message}</p>

                              <div className="grid gap-3 md:grid-cols-2 mb-3">
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Consequence</p>
                                  <p className="text-sm">{finding.consequence}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Fix</p>
                                  <p className="text-sm">{finding.fix}</p>
                                </div>
                              </div>

                              {(finding.evidenceA || finding.evidenceB) && (
                                <details className={isExpanded ? 'open' : ''} onToggle={() => toggleExpand(finding.id)}>
                                  <summary className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer">
                                    <FileText className="w-4 h-4" />
                                    Evidence
                                    <span className="ml-auto text-xs">({isExpanded ? 'Hide' : 'Show'})</span>
                                  </summary>
                                  <div className="mt-3 overflow-x-auto">
                                    <table className="w-full text-sm font-mono">
                                      <thead>
                                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                                          <th className="text-left py-2 px-3 font-medium text-muted-foreground"></th>
                                          <th className="text-left py-2 px-3 font-medium">Version A (Baseline)</th>
                                          <th className="text-left py-2 px-3 font-medium">Version B (New)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border-b border-neutral-100 dark:border-neutral-800">
                                          <td className="py-2 px-3 font-medium text-muted-foreground">Value</td>
                                          <td className="py-2 px-3">{finding.evidenceA || '(missing)'}</td>
                                          <td className="py-2 px-3">{finding.evidenceB || '(missing)'}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </details>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center text-sm text-muted-foreground">
          <p>Report generated by <a href="https://serpcraft.app" className="underline hover:no-underline">SerpCraft Release Guard</a></p>
          <p className="mt-1">Compare URLs · Catch regressions · Ship with confidence</p>
        </div>
      </div>
    </div>
  );
}

function generateMarkdown(report: ReleaseDiffReport): string {
  const lines: string[] = [
    `# SerpCraft Release Guard — Diff Report`,
    ``,
    `**URL A (Baseline):** ${report.urlA}`,
    `**URL B (New):** ${report.urlB}`,
    `**Generated:** ${new Date(report.timestamp).toLocaleString()}`,
    ``,
    `## Summary`,
    ``,
    `- 🔴 **Release Blockers:** ${report.summary.blockers}`,
    `- 🟡 **Warnings:** ${report.summary.warnings}`,
    `- 🟢 **Informational:** ${report.summary.info}`,
    ``,
    `---`,
    ``,
  ];

  const grouped = report.findings.reduce((acc, f) => {
    if (!acc[f.severity]) acc[f.severity] = [];
    acc[f.severity].push(f);
    return acc;
  }, {} as Record<DiffSeverity, DiffFinding[]>);

  for (const severity of ['blocker', 'warning', 'info'] as DiffSeverity[]) {
    const items = grouped[severity] || [];
    if (items.length === 0) continue;

    const icons = { blocker: '🔴', warning: '🟡', info: '🟢' };
    const titles = { blocker: 'Release Blockers', warning: 'Warnings', info: 'Informational' };

    lines.push(`## ${icons[severity]} ${titles[severity]}`);
    lines.push('');

    for (const finding of items) {
      lines.push(`### ${finding.label} [${finding.category}]`);
      lines.push('');
      lines.push(`**Finding:** ${finding.message}`);
      lines.push('');
      lines.push(`**Consequence:** ${finding.consequence}`);
      lines.push('');
      lines.push(`**Fix:** ${finding.fix}`);
      lines.push('');
      if (finding.evidenceA || finding.evidenceB) {
        lines.push(`**Evidence:**`);
        lines.push('');
        lines.push(`| | Version A (Baseline) | Version B (New) |`);
        lines.push(`|---|---|---|`);
        lines.push(`| Value | \`${finding.evidenceA?.replace(/`/g, '\\`') || '(missing)'}\` | \`${finding.evidenceB?.replace(/`/g, '\\`') || '(missing)'}\` |`);
        lines.push('');
      }
      lines.push(`---`);
      lines.push('');
    }
  }

  lines.push(`*Report generated by [SerpCraft Release Guard](https://serpcraft.app) — Compare URLs, catch regressions, ship with confidence.*`);

  return lines.join('\n');
}