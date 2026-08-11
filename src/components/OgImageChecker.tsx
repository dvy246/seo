import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Image,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react';
import type { AuditCheck } from '@/lib/validator';

interface OgImageResult {
  url: string;
  resolvedUrl: string;
  contentType: string;
  format: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number;
  checks: AuditCheck[];
  pass: boolean;
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

export function OgImageChecker() {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState<OgImageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    const url = imageUrl.trim();
    if (!url || loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/og-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image check failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Image size={18} className="text-choco-500" />
        <h3 className="text-sm font-semibold text-ink dark:text-sand-100">OG Image Checker</h3>
      </div>
      <p className="text-xs text-ink-muted dark:text-sand-400 mb-5">
        Paste the URL of your Open Graph image and SerpCraft verifies it server-side: correct format, 1200×630
        dimensions, 1.91:1 aspect ratio, and file size — exactly how Facebook, X, and LinkedIn will fetch it.
        Browsers can't do this reliably on their own (CORS), so this check actually reads the image bytes.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted dark:text-sand-400 pointer-events-none" />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="https://yoursite.com/og-image.png"
            className="field-input pl-10"
          />
        </div>
        <button onClick={run} disabled={loading || !imageUrl.trim()} className="btn btn-primary">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Checking...
            </>
          ) : (
            <>
              Check image <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-ink-muted dark:text-sand-400 mt-2.5 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5" />
        Fetched server-side (no CORS limits). Limited to 30 checks per hour per IP. Results cached 24h.
      </p>

      {error && (
        <div className="max-w-2xl mx-auto mt-5">
          <div className="p-3.5 rounded-lg border border-error/25 bg-error/5 text-sm text-error">{error}</div>
        </div>
      )}

      {loading && (
        <div className="max-w-2xl mx-auto mt-6 space-y-4 animate-pulse">
          <div className="h-48 bg-sand-100 dark:bg-sand-800 rounded-lg" />
          <div className="h-3 w-full bg-sand-100 dark:bg-sand-800 rounded" />
          <div className="h-3 w-3/4 bg-sand-100 dark:bg-sand-800 rounded" />
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 space-y-5">
          {/* Verdict banner */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              result.pass ? 'border-success/25 bg-success/5' : 'border-warning/25 bg-warning/5'
            }`}
          >
            {result.pass ? (
              <Sparkles className="w-5 h-5 text-success flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${result.pass ? 'text-success' : 'text-warning'}`}>
                {result.pass ? 'This image is ready for social sharing' : 'This image needs fixes before sharing'}
              </p>
              <p className="text-xs text-ink-soft dark:text-sand-300 mt-0.5 break-all">{result.resolvedUrl}</p>
            </div>
            {result.cached && <span className="chip bg-pastel-500/10 text-pastel-600 dark:text-pastel-300 shrink-0">Cached result</span>}
          </div>

          {/* Image preview + facts */}
          <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 items-start">
            <div className="rounded-xl border border-sand-200 dark:border-sand-800 bg-sand-50 dark:bg-sand-950 overflow-hidden">
              <img
                src={result.resolvedUrl}
                alt="Open Graph preview"
                className="w-full h-auto max-h-72 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Format', value: result.format ? result.format.toUpperCase() : 'Unknown' },
                { label: 'Dimensions', value: result.width && result.height ? `${result.width}×${result.height}` : '—' },
                { label: 'File Size', value: `${(result.sizeBytes / 1024).toFixed(0)} KB` },
                { label: 'Aspect Ratio', value: result.width && result.height ? `1:${(result.width / result.height).toFixed(2)}` : '—' },
              ].map((f) => (
                <div key={f.label} className="card p-3">
                  <p className="text-xs text-ink-muted dark:text-sand-400 mb-0.5">{f.label}</p>
                  <p className="text-sm font-medium text-ink dark:text-sand-100">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checks */}
          <div className="space-y-2.5">
            {result.checks.map((check, i) => (
              <div key={i} className={`p-4 rounded-xl border ${statusBg(check.status)} flex items-start gap-3`}>
                {statusIcon(check.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-medium text-ink dark:text-sand-100">{check.label}</span>
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
            ))}
          </div>

          <button
            onClick={run}
            className="btn-ghost text-sm text-choco-600 dark:text-choco-400 hover:bg-sand-100 dark:hover:bg-sand-800 inline-flex items-center gap-1.5"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Re-check
          </button>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="max-w-2xl mx-auto text-center py-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pastel-500/10 mb-3">
            <Image className="w-7 h-7 text-pastel-600 dark:text-pastel-300" />
          </div>
          <p className="text-sm text-ink-muted dark:text-sand-400 max-w-md mx-auto">
            Tip: paste the exact URL from your <code className="font-mono text-xs">og:image</code> meta tag to make
            sure Facebook and X will render it correctly.
          </p>
        </div>
      )}
    </div>
  );
}
