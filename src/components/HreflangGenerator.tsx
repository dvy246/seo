import { useState } from 'react';
import { Plus, Trash2, Languages, Globe } from 'lucide-react';
import { CodeBlock } from '@/components/CodeOutput';

interface HreflangRow {
  path: string;
  locales: string;
}

// Common BCP-47 language-region codes with display labels.
const COMMON_LOCALES = [
  'en', 'en-US', 'en-GB', 'en-CA', 'en-AU', 'en-IN',
  'es', 'es-ES', 'es-MX', 'es-AR',
  'fr', 'fr-FR', 'fr-CA',
  'de', 'de-DE', 'de-AT', 'de-CH',
  'pt', 'pt-PT', 'pt-BR',
  'ja', 'ja-JP', 'zh-CN', 'zh-TW', 'ko', 'it', 'nl', 'pl', 'ru', 'sv', 'tr', 'ar', 'hi',
];

const BCP47 = /^[a-z]{2,3}(?:-[A-Z]{2,3})?(?:-[A-Za-z0-9]{1,8})*$/;

function isValidLocale(code: string): boolean {
  return BCP47.test(code.trim()) && code.length <= 35;
}

export function HreflangGenerator() {
  const [baseUrl, setBaseUrl] = useState('');
  const [xDefault, setXDefault] = useState(true);
  const [rows, setRows] = useState<HreflangRow[]>([{ path: '/', locales: 'en, es, fr, de, pt, ja' }]);

  const addRow = () => setRows((r) => [...r, { path: '', locales: 'en' }]);
  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof HreflangRow, value: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const toggleLocale = (code: string) => {
    if (rows.length === 0) return;
    const current = rows[0].locales.split(',').map((l) => l.trim()).filter(Boolean);
    const next = current.includes(code) ? current.filter((l) => l !== code) : [...current, code];
    updateRow(0, 'locales', next.join(', '));
  };

  // --- Validation (the quality bar competitors skip) ---
  const errors: string[] = [];
  const warnings: string[] = [];

  let baseOk = false;
  if (!baseUrl) {
    warnings.push('No base URL — links will be relative.');
  } else {
    try {
      const u = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad scheme');
      baseOk = true;
    } catch {
      errors.push('Base URL is not a valid absolute URL.');
    }
  }

  const seenUrls = new Set<string>();
  for (const row of rows) {
    if (!row.path.trim()) continue;
    const locales = row.locales.split(',').map((l) => l.trim()).filter(Boolean);
    if (locales.length === 0) {
      errors.push(`"${row.path}" has no locale codes.`);
      continue;
    }
    for (const loc of locales) {
      if (!isValidLocale(loc)) errors.push(`"${loc}" is not a valid BCP-47 locale code (e.g. en, es-ES, pt-BR).`);
    }
    const dup = locales.filter((l, i, all) => all.indexOf(l) !== i);
    if (dup.length > 0) errors.push(`"${row.path}" repeats locale code(s): ${[...new Set(dup)].join(', ')}.`);
    const base = (baseUrl || 'https://example.com').replace(/\/+$/, '');
    const full = `${base}/${row.path.replace(/^\/+/, '')}`;
    if (seenUrls.has(full)) warnings.push(`"${full}" appears more than once with different locales — merge them into one row.`);
    seenUrls.add(full);
  }
  const hasAnyRows = rows.some((r) => r.path.trim() && r.locales.trim());
  if (hasAnyRows && xDefault) {
    const allLocales = rows.flatMap((r) => r.locales.split(',').map((l) => l.trim())).filter(Boolean);
    if (!allLocales.includes('x-default')) warnings.push('x-default points to the page itself — Google uses it for visitors whose language you don\'t serve.');
  }

  // --- Output ---
  const lines: string[] = [];
  for (const row of rows) {
    if (!row.path.trim()) continue;
    const path = row.path.trim().replace(/^\/+/, '');
    const locales = row.locales.split(',').map((l) => l.trim()).filter(Boolean);
    const codes = xDefault && !locales.includes('x-default') ? [...locales, 'x-default'] : locales;
    for (const code of codes) {
      const href = baseOk ? `${baseUrl.replace(/\/+$/, '')}/${path}` : `/path-to/${path}`;
      lines.push(`<link rel="alternate" hreflang="${code}" href="${href}" />`);
    }
  }
  const output = lines.join('\n');

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <Languages size={18} className="text-choco-500" />
        <h3 className="text-sm font-semibold text-ink dark:text-sand-100">Hreflang Generator</h3>
      </div>
      <p className="text-xs text-ink-muted dark:text-sand-400 mb-4">
        Generate hreflang alternate links so Google and AI engines serve the right language version of each page
        to every market. One row per URL, with all its locale variants.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="field-label">Base URL</label>
          <input
            type="url"
            className="field-input"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <p className="field-hint">The absolute URLs are built from this.</p>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-1">
            <input
              type="checkbox"
              checked={xDefault}
              onChange={(e) => setXDefault(e.target.checked)}
              className="accent-choco-500"
            />
            <span className="text-xs text-ink-soft dark:text-sand-300">
              Add <code className="font-mono">x-default</code> (recommended — catches untargeted locales)
            </span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="field-label mb-0">URLs &amp; locales</label>
          <button onClick={addRow} className="btn-ghost px-2.5 py-1.5 text-xs text-choco-500 dark:text-choco-300 hover:bg-sand-100 dark:hover:bg-sand-800 flex items-center gap-1">
            <Plus size={14} /> Add URL
          </button>
        </div>
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_1.6fr_auto] gap-2 items-center">
              <input
                type="text"
                className="field-input"
                value={row.path}
                onChange={(e) => updateRow(i, 'path', e.target.value)}
                placeholder="/product"
              />
              <input
                type="text"
                className="field-input font-mono text-[13px]"
                value={row.locales}
                onChange={(e) => updateRow(i, 'locales', e.target.value)}
                placeholder="en, es-ES, pt-BR"
              />
              <button
                onClick={() => removeRow(i)}
                className="btn-ghost p-2 text-ink-muted dark:text-sand-500 hover:text-error dark:hover:text-error"
                title="Remove row"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {rows.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {COMMON_LOCALES.map((code) => {
            const active = rows[0].locales.split(',').map((l) => l.trim()).includes(code);
            return (
              <button
                key={code}
                onClick={() => toggleLocale(code)}
                className={`chip transition-all ${active ? 'bg-choco-500 text-white border-transparent' : 'bg-sand-100 dark:bg-sand-800 text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-700'}`}
              >
                {code}
              </button>
            );
          })}
        </div>
      )}

      {(errors.length > 0 || warnings.length > 0) && (
        <div className="mb-4 space-y-1">
          {errors.map((e, i) => (
            <p key={`e${i}`} className="text-xs text-error dark:text-error flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-error inline-block shrink-0" /> {e}
            </p>
          ))}
          {warnings.map((w, i) => (
            <p key={`w${i}`} className="text-xs text-warning dark:text-warning flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block shrink-0" /> {w}
            </p>
          ))}
        </div>
      )}

      <CodeBlock label="hreflang tags" code={output} language="html" filename="hreflang.html" maxHeight="300px" />

      <div className="mt-4 p-3 rounded-lg bg-sand-50 dark:bg-sand-900 border border-sand-200 dark:border-sand-800 text-xs text-ink-muted dark:text-sand-400 flex items-start gap-2">
        <Globe size={14} className="mt-0.5 shrink-0 text-pastel-500" />
        <span>
          Google requires hreflang pages to be <em>mutually reciprocal</em>: every URL in the set must link back
          to every other URL in the same set. Generate this block for each of the URLs above.
        </span>
      </div>
    </div>
  );
}
