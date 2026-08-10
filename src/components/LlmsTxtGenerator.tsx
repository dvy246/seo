import { useState } from 'react';
import { Plus, Trash2, FileText, Link2 } from 'lucide-react';
import { CodeBlock } from '@/components/CodeOutput';
import { validateCanonical } from '@/lib/validator';

interface LlmsRow {
  title: string;
  path: string;
  summary: string;
}

interface LlmsTxtGeneratorProps {
  onOpenAudit?: () => void;
}

export function LlmsTxtGenerator({ onOpenAudit }: LlmsTxtGeneratorProps) {
  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [rows, setRows] = useState<LlmsRow[]>([
    { title: '', path: '/', summary: '' },
    { title: '', path: '/about', summary: '' },
  ]);

  const addRow = () => setRows((r) => [...r, { title: '', path: '', summary: '' }]);
  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof LlmsRow, value: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  const urlCheck = validateCanonical(baseUrl);
  const baseUrlOk = baseUrl && !urlCheck.error && urlCheck.status === 'pass';

  const duplicates = rows
    .map((r) => r.path.trim())
    .filter((p, i, all) => p && all.indexOf(p) !== i);
  const duplicatePaths = new Set(duplicates);

  const output = [
    siteName.trim() ? `# ${siteName.trim()}` : '# Your Site Name',
    ...(tagline.trim() ? [`> ${tagline.trim()}`] : []),
    '',
    ...rows
      .filter((r) => r.title.trim() && r.path.trim())
      .map((r) => {
        const url = `${baseUrl.replace(/\/+$/, '')}/${r.path.replace(/^\/+/, '')}`;
        return `- [${r.title.trim()}](${url})${r.summary.trim() ? `: ${r.summary.trim()}` : ''}`;
      }),
  ]
    .filter((line) => line !== '')
    .join('\n');

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <FileText size={18} className="text-choco-500" />
        <h3 className="text-sm font-semibold text-ink dark:text-sand-100">llms.txt Generator</h3>
      </div>
      <p className="text-xs text-ink-muted dark:text-sand-400 mb-4">
        Generate the llms.txt file that AI engines (ChatGPT, Perplexity, Gemini, Claude) read to understand
        your site. Place it at the root of your domain — the AI Readiness Checker verifies it automatically.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div>
          <label className="field-label">Site name</label>
          <input
            type="text"
            className="field-input"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Acme Corporation"
          />
          <p className="field-hint">Shown as the H1 of your llms.txt.</p>
        </div>
        <div>
          <label className="field-label">Tagline (optional)</label>
          <input
            type="text"
            className="field-input"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="B2B software for teams"
          />
          <p className="field-hint">One-line description of your site.</p>
        </div>
        <div>
          <label className="field-label">Base URL</label>
          <input
            type="url"
            className="field-input"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com"
          />
          <p className="field-hint">
            {baseUrl ? urlCheck.message : 'Links are built from this.'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="field-label mb-0">Pages to include</label>
          <button onClick={addRow} className="btn-ghost px-2.5 py-1.5 text-xs text-choco-500 dark:text-choco-300 hover:bg-sand-100 dark:hover:bg-sand-800 flex items-center gap-1">
            <Plus size={14} /> Add page
          </button>
        </div>
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_1fr_1.5fr_auto] gap-2 items-center">
              <input
                type="text"
                className="field-input"
                value={row.title}
                onChange={(e) => updateRow(i, 'title', e.target.value)}
                placeholder="Page title"
              />
              <div className="relative">
                <input
                  type="text"
                  className={`field-input pl-7 ${duplicatePaths.has(row.path.trim()) ? 'border-error dark:border-error' : ''}`}
                  value={row.path}
                  onChange={(e) => updateRow(i, 'path', e.target.value)}
                  placeholder="/product"
                />
                <Link2 size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-sand-500" />
              </div>
              <input
                type="text"
                className="field-input"
                value={row.summary}
                onChange={(e) => updateRow(i, 'summary', e.target.value)}
                placeholder="One-line summary for AI readers"
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
        {duplicatePaths.size > 0 && (
          <p className="field-hint text-error dark:text-error mt-2">
            Duplicate path{duplicatePaths.size > 1 ? 's' : ''}: {[...duplicatePaths].join(', ')} — remove to avoid ambiguity.
          </p>
        )}
      </div>

      <CodeBlock label="llms.txt" code={output} language="text" filename="llms.txt" maxHeight="300px" />

      {onOpenAudit && (
        <button
          onClick={onOpenAudit}
          className="btn-primary w-full justify-center mt-4 text-sm"
        >
          <FileText size={16} /> Verify this URL in the AI Readiness Checker
        </button>
      )}
    </div>
  );
}
