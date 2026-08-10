import { useState } from 'react';
import { Braces, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Sparkles, Trash2 } from 'lucide-react';
import { validateJsonLd } from '@/lib/validator';
import { useCopyToClipboard } from '@/lib/useCopyToClipboard';
import { navigateTo } from '@/lib/router';

const EXAMPLE = [
  '{',
  '  "@context": "https://schema.org",',
  '  "@type": "Article",',
  '  "headline": "How to write meta tags in 2026",',
  '  "datePublished": "2026-01-15",',
  '  "author": { "@type": "Organization", "name": "MetaForge" },',
  '  "url": "https://metaforge.app/blog/meta-tags"',
  '}',
].join('\n');

export function JsonLdValidator() {
  const [input, setInput] = useState('');
  const { copied, copy } = useCopyToClipboard();

  const trimmed = input.trim();
  const verdict = trimmed ? validateJsonLd(input) : null;

  let pretty: string | null = null;
  let types: string[] = [];
  if (trimmed && verdict && verdict.status !== 'error') {
    try {
      const parsed = JSON.parse(trimmed);
      pretty = JSON.stringify(parsed, null, 2);
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      types = nodes.map((n) => (n && typeof n === 'object' ? String((n as Record<string, unknown>)['@type'] ?? 'unknown') : 'unknown'));
    } catch {
      pretty = null;
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Braces size={18} className="text-choco-500" />
        <h3 className="text-sm font-semibold text-ink dark:text-sand-100">JSON-LD Validator</h3>
      </div>
      <p className="text-xs text-ink-muted dark:text-sand-400 mb-5">
        Paste JSON-LD structured data and get instant feedback on syntax, required fields, and rich-result
        eligibility — the same engine that powers the studio and the AI Readiness Checker, so the verdict is
        always consistent.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <button
          onClick={() => setInput(EXAMPLE)}
          className="btn-ghost px-3 py-2 text-xs text-choco-600 dark:text-choco-400 hover:bg-sand-100 dark:hover:bg-sand-800"
        >
          Load example
        </button>
        <button
          onClick={() => setInput('')}
          disabled={!input}
          className="btn-ghost px-3 py-2 text-xs text-ink-muted dark:text-sand-500 hover:text-error dark:hover:text-error hover:bg-sand-100 dark:hover:bg-sand-800 inline-flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={12}
        spellCheck={false}
        placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Your headline"\n}'}
        className={`field-input font-mono text-xs resize-y ${
          verdict?.status === 'error'
            ? 'border-error/50 focus:border-error'
            : verdict?.status === 'warning'
              ? 'border-warning/50 focus:border-warning'
              : ''
        }`}
      />

      {verdict && (
        <div
          className={`mt-3 p-4 rounded-xl border flex items-start gap-3 ${
            verdict.status === 'pass'
              ? 'border-success/25 bg-success/5'
              : verdict.status === 'warning'
                ? 'border-warning/25 bg-warning/5'
                : 'border-error/25 bg-error/5'
          }`}
        >
          {verdict.status === 'pass' ? (
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          ) : verdict.status === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold ${
                verdict.status === 'pass' ? 'text-success' : verdict.status === 'warning' ? 'text-warning' : 'text-error'
              }`}
            >
              {verdict.status === 'pass' ? 'Valid' : verdict.status === 'warning' ? 'Heads up' : 'Invalid'}
            </p>
            <p className="text-sm text-ink-soft dark:text-sand-300 mt-0.5">{verdict.message}</p>
            {pretty && types.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {types.map((t) => (
                  <span key={t} className="chip bg-pastel-500/10 text-pastel-600 dark:text-pastel-300">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {pretty && verdict && verdict.status !== 'error' && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-soft dark:text-sand-300 uppercase tracking-wide">Pretty-printed JSON</span>
            <button
              onClick={() => copy(pretty)}
              className={`btn px-2.5 py-1.5 text-xs transition-all ${
                copied ? 'bg-success text-white' : 'text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-800'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 rounded-xl border border-sand-200 dark:border-sand-800 bg-sand-50 dark:bg-sand-950 text-[13px] leading-relaxed font-mono text-ink dark:text-sand-100 whitespace-pre-wrap break-all max-h-96 overflow-auto">
            {pretty}
          </pre>
        </div>
      )}

      {verdict && verdict.status === 'pass' && (
        <div className="mt-4 p-4 rounded-xl border border-sand-200 dark:border-sand-800 bg-sand-50 dark:bg-sand-900 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-ink dark:text-sand-50 mb-1">Next step: embed it</h4>
            <p className="text-sm text-ink-soft dark:text-sand-300">
              Add this as a <code className="font-mono text-xs">&lt;script type="application/ld+json"&gt;</code> block in
              your page&apos;s <code className="font-mono text-xs">&lt;head&gt;</code> — or build richer schema visually in the studio.
            </p>
            <button
              onClick={() => navigateTo('/json-ld-generator')}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-choco-600 dark:text-choco-400 hover:underline"
            >
              Open the JSON-LD Generator <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
