import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { useCopyToClipboard } from '@/lib/useCopyToClipboard';

interface CodeBlockProps {
  label: string;
  code: string;
  language?: string;
  filename?: string;
  maxHeight?: string;
}

export function CodeBlock({ label, code, language = 'html', filename, maxHeight = '400px' }: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard();

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'serpcraft-output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-sand-200 dark:border-sand-800 bg-sand-50 dark:bg-sand-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-sand-100 dark:bg-sand-900 border-b border-sand-200 dark:border-sand-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-soft dark:text-sand-300 uppercase tracking-wide">{label}</span>
          {language && (
            <span className="chip bg-sand-200 dark:bg-sand-800 text-ink-muted dark:text-sand-400">{language}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {filename && (
            <button
              onClick={handleDownload}
              className="btn-ghost px-2 py-1.5 text-xs text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-800"
              title="Download file"
            >
              <Download size={14} />
            </button>
          )}
          <button
            onClick={() => copy(code)}
            className={`btn px-2.5 py-1.5 text-xs transition-all ${
              copied
                ? 'bg-success text-white'
                : 'text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-800'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="overflow-auto scrollbar-thin" style={{ maxHeight }}>
        <pre className="p-4 text-[13px] leading-relaxed font-mono text-ink dark:text-sand-100 whitespace-pre-wrap break-all">
          {code || <span className="text-ink-muted dark:text-sand-500">Fill in the fields to generate output...</span>}
        </pre>
      </div>
    </div>
  );
}

interface OutputTabsProps {
  metaTags: string;
  jsonLd: string;
  robotsTxt: string;
}

type OutputTab = 'meta' | 'jsonld' | 'robots';

export function OutputPanel({ metaTags, jsonLd, robotsTxt }: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState<OutputTab>('meta');

  const tabs: { id: OutputTab; label: string; hasContent: boolean }[] = [
    { id: 'meta', label: 'Meta Tags', hasContent: !!metaTags },
    { id: 'jsonld', label: 'JSON-LD', hasContent: !!jsonLd },
    { id: 'robots', label: 'robots.txt', hasContent: !!robotsTxt },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ink dark:text-sand-100">Generated Output</h3>
        <span className="text-xs text-ink-muted dark:text-sand-400">Copy &amp; paste into your site</span>
      </div>

      <div className="flex gap-1.5 mb-4 border-b border-sand-200 dark:border-sand-800 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-ink text-white dark:bg-sand-100 dark:text-sand-950 shadow-soft'
                : 'text-ink-soft dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800'
            }`}
          >
            {tab.label}
            {tab.hasContent && activeTab !== tab.id && (
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
            )}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === 'meta' && (
          <CodeBlock label="HTML Head Tags" code={metaTags} language="html" filename="meta-tags.html" />
        )}
        {activeTab === 'jsonld' && (
          <CodeBlock label="JSON-LD Structured Data" code={jsonLd} language="json" filename="structured-data.html" />
        )}
        {activeTab === 'robots' && (
          <CodeBlock label="robots.txt" code={robotsTxt} language="text" filename="robots.txt" />
        )}
      </div>
    </div>
  );
}
