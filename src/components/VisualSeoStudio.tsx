import { useState, useMemo } from 'react';
import { ArrowRight, Code2, Globe, LayoutDashboard, Settings, Network, Search, Eye, Download, Sparkles, Wand2 } from 'lucide-react';
import { GoogleSerpPreview, FacebookPreview } from '@/components/Previews';
import type { PageSetup } from '@/types';

// Extraction helper
function extractEditableSeoState(html: string) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const getMeta = (nameOrProp: string) => {
    // Basic regex to find content of meta tags. Handles both name="" and property=""
    const regex1 = new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${nameOrProp}["']\\s+content=["']([^"']*)["']`, 'i');
    const regex2 = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:name|property)=["']${nameOrProp}["']`, 'i');
    
    let m = html.match(regex1);
    if (m) return m[1];
    m = html.match(regex2);
    return m ? m[1] : '';
  };

  const description = getMeta('description');
  const ogTitle = getMeta('og:title');
  const ogDesc = getMeta('og:description');
  const ogImage = getMeta('og:image');

  const jsonLdObjects: any[] = [];
  const sdRegex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let sdMatch;
  while ((sdMatch = sdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(sdMatch[1].trim());
      if (Array.isArray(parsed)) jsonLdObjects.push(...parsed);
      else jsonLdObjects.push(parsed);
    } catch {}
  }

  return { title, description, ogTitle, ogDesc, ogImage, jsonLdObjects };
}

// Recursive Schema Graph Component
function SchemaNode({ data, name, path, onEdit }: { data: any, name: string, path: string, onEdit: (p: string, v: string) => void }) {
  if (typeof data !== 'object' || data === null) {
    return (
      <div className="flex items-start gap-2 py-1 ml-4 group">
        <span className="text-xs text-pastel-600 dark:text-pastel-400 font-medium whitespace-nowrap mt-1 flex-none">{name}:</span>
        <input
          type="text"
          value={String(data)}
          onChange={(e) => onEdit(path, e.target.value)}
          className="bg-transparent border border-transparent hover:border-sand-200 focus:border-choco-400 dark:hover:border-sand-700 focus:outline-none focus:ring-1 focus:ring-choco-400 text-xs text-ink-soft dark:text-sand-300 w-full px-1.5 py-0.5 rounded transition-all"
        />
      </div>
    );
  }
  return (
    <div className="ml-4 pl-3 border-l-2 border-sand-200 dark:border-sand-800 my-1 relative">
      <div className="absolute -left-[2px] top-2.5 w-3 h-[2px] bg-sand-200 dark:bg-sand-800" />
      <div className="text-xs font-bold text-ink dark:text-sand-100 bg-sand-100 dark:bg-sand-800/80 inline-block px-2 py-0.5 rounded-md mb-1.5 ml-2 uppercase tracking-wide">
        {name} {data['@type'] ? `(${data['@type']})` : ''}
      </div>
      {Object.entries(data).filter(([k]) => k !== '@context').map(([k, v]) => (
        <SchemaNode key={k} name={k} data={v} path={path ? `${path}.${k}` : k} onEdit={onEdit} />
      ))}
    </div>
  );
}

export function VisualSeoStudio() {
  const [htmlInput, setHtmlInput] = useState('');
  const [isIngested, setIsIngested] = useState(false);
  const [activeTab, setActiveTab] = useState<'serp' | 'schema' | 'export'>('serp');
  
  const [seoState, setSeoState] = useState({
    title: '',
    description: '',
    ogTitle: '',
    ogDesc: '',
    ogImage: '',
    jsonLdObjects: [] as any[]
  });

  const handleAnalyze = () => {
    if (!htmlInput.trim()) return;
    const extracted = extractEditableSeoState(htmlInput);
    setSeoState(extracted);
    setIsIngested(true);
  };

  const handleReset = () => {
    setHtmlInput('');
    setIsIngested(false);
    setSeoState({ title: '', description: '', ogTitle: '', ogDesc: '', ogImage: '', jsonLdObjects: [] });
  };

  const handleJsonEdit = (path: string, value: string) => {
    setSeoState(prev => {
      const newObjs = JSON.parse(JSON.stringify(prev.jsonLdObjects));
      const parts = path.split('.');
      let current = newObjs;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return { ...prev, jsonLdObjects: newObjs };
    });
  };

  const mockSetup = useMemo(() => ({
    brandName: '', domain: '', defaultLanguage: 'en',
    url: 'https://example.com/your-page',
    title: seoState.title,
    description: seoState.description,
    ogTitle: seoState.ogTitle,
    ogDescription: seoState.ogDesc,
    ogImage: seoState.ogImage,
    schemaType: 'None',
    schemaData: {},
    robotsRules: { allow: [], disallow: [], sitemap: '', crawlDelay: 0 }
  } as unknown as PageSetup), [seoState]);

  const exportedCode = useMemo(() => {
    let code = `<!-- SEO Meta Tags -->\n<title>${seoState.title}</title>\n<meta name="description" content="${seoState.description}">\n`;
    if (seoState.ogTitle || seoState.ogDesc || seoState.ogImage) {
      code += `\n<!-- Open Graph Tags -->\n`;
      if (seoState.ogTitle) code += `<meta property="og:title" content="${seoState.ogTitle}">\n`;
      if (seoState.ogDesc) code += `<meta property="og:description" content="${seoState.ogDesc}">\n`;
      if (seoState.ogImage) code += `<meta property="og:image" content="${seoState.ogImage}">\n`;
      code += `<meta property="og:type" content="website">\n`;
    }
    if (seoState.jsonLdObjects.length > 0) {
      code += `\n<!-- Structured Data -->\n`;
      seoState.jsonLdObjects.forEach(obj => {
        code += `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", ...obj }, null, 2)}\n</script>\n`;
      });
    }
    return code;
  }, [seoState]);

  if (!isIngested) {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-choco-500/20 to-pastel-500/20 mb-6 ring-1 ring-choco-500/30">
            <Wand2 className="w-8 h-8 text-choco-600 dark:text-choco-400" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-ink dark:text-sand-50 mb-3">Visual SEO Remediation Studio</h2>
          <p className="text-ink-soft dark:text-sand-300">Paste your rendered HTML to extract, visually edit, and re-export your Meta and Schema graphs.</p>
        </div>
        
        <div className="card p-6 shadow-xl shadow-sand-900/5 dark:shadow-black/20">
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={12}
            placeholder="Paste your page's full HTML source here...&#10;&#10;<html>&#10;  <head>&#10;    <title>...</title>&#10;    <script type=&quot;application/ld+json&quot;>...</script>&#10;  </head>&#10;</html>"
            className="field-input font-mono text-xs resize-y bg-sand-50/50 dark:bg-sand-900/50 border-sand-200 dark:border-sand-800"
          />
          <div className="flex justify-end mt-4">
            <button onClick={handleAnalyze} disabled={!htmlInput.trim()} className="btn btn-primary px-6">
              Extract SEO State <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in grid lg:grid-cols-[400px_1fr] gap-6 items-start">
      {/* LEFT PANE: Editor Forms */}
      <div className="card p-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand-200 dark:border-sand-800">
          <h3 className="font-semibold text-ink dark:text-sand-100 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-choco-500" /> Live Editor
          </h3>
          <button onClick={handleReset} className="text-xs text-ink-muted hover:text-error underline underline-offset-2 transition-colors">
            Start over
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-ink-muted dark:text-sand-400 mb-1.5 uppercase tracking-wider">Search Snippet</label>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-ink-soft dark:text-sand-300 mb-1 block">Title Tag</span>
                <input
                  type="text"
                  value={seoState.title}
                  onChange={(e) => setSeoState({ ...seoState, title: e.target.value })}
                  className="field-input text-sm"
                />
              </div>
              <div>
                <span className="text-xs text-ink-soft dark:text-sand-300 mb-1 block">Meta Description</span>
                <textarea
                  value={seoState.description}
                  onChange={(e) => setSeoState({ ...seoState, description: e.target.value })}
                  rows={3}
                  className="field-input text-sm resize-y"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-sand-200 dark:border-sand-800">
            <label className="block text-xs font-medium text-ink-muted dark:text-sand-400 mb-1.5 uppercase tracking-wider">Social / Open Graph</label>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-ink-soft dark:text-sand-300 mb-1 block">OG Title</span>
                <input
                  type="text"
                  value={seoState.ogTitle}
                  onChange={(e) => setSeoState({ ...seoState, ogTitle: e.target.value })}
                  className="field-input text-sm"
                />
              </div>
              <div>
                <span className="text-xs text-ink-soft dark:text-sand-300 mb-1 block">OG Description</span>
                <textarea
                  value={seoState.ogDesc}
                  onChange={(e) => setSeoState({ ...seoState, ogDesc: e.target.value })}
                  rows={2}
                  className="field-input text-sm resize-y"
                />
              </div>
              <div>
                <span className="text-xs text-ink-soft dark:text-sand-300 mb-1 block">OG Image URL</span>
                <input
                  type="text"
                  value={seoState.ogImage}
                  onChange={(e) => setSeoState({ ...seoState, ogImage: e.target.value })}
                  className="field-input text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Visualizations */}
      <div className="space-y-6">
        <div className="flex gap-2 p-1.5 bg-sand-100 dark:bg-sand-900 border border-sand-200 dark:border-sand-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('serp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'serp' ? 'bg-white dark:bg-sand-800 shadow-soft text-ink dark:text-sand-50' : 'text-ink-muted dark:text-sand-400 hover:text-ink dark:hover:text-sand-100'
            }`}
          >
            <Search className="w-4 h-4" /> Visual SERP
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'schema' ? 'bg-white dark:bg-sand-800 shadow-soft text-ink dark:text-sand-50' : 'text-ink-muted dark:text-sand-400 hover:text-ink dark:hover:text-sand-100'
            }`}
          >
            <Network className="w-4 h-4" /> Schema Graph
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'export' ? 'bg-white dark:bg-sand-800 shadow-soft text-ink dark:text-sand-50' : 'text-ink-muted dark:text-sand-400 hover:text-ink dark:hover:text-sand-100'
            }`}
          >
            <Code2 className="w-4 h-4" /> Export Fixes
          </button>
        </div>

        {activeTab === 'serp' && (
          <div className="card p-6 animate-fade-in space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-ink dark:text-sand-100 mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-pastel-500" /> Google Desktop Snippet
              </h3>
              <div className="p-5 bg-white dark:bg-sand-950 border border-sand-200 dark:border-sand-800 rounded-xl shadow-inner">
                <GoogleSerpPreview setup={mockSetup} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink dark:text-sand-100 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-choco-500" /> Social Preview (Open Graph)
              </h3>
              <div className="p-5 bg-white dark:bg-sand-950 border border-sand-200 dark:border-sand-800 rounded-xl shadow-inner flex justify-center">
                <FacebookPreview setup={mockSetup} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="card p-6 animate-fade-in">
            <h3 className="text-sm font-semibold text-ink dark:text-sand-100 mb-2 flex items-center gap-2">
              <Network className="w-4 h-4 text-choco-500" /> Entity Knowledge Graph
            </h3>
            <p className="text-xs text-ink-muted dark:text-sand-400 mb-6">
              Click any value in the tree to edit it directly. The schema is mapped hierarchically without code.
            </p>
            
            {seoState.jsonLdObjects.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-sand-200 dark:border-sand-800 rounded-xl bg-sand-50/50 dark:bg-sand-900/20">
                <p className="text-sm text-ink-muted dark:text-sand-400">No JSON-LD structured data found in the provided HTML.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {seoState.jsonLdObjects.map((obj, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-sand-900/50 border border-sand-200 dark:border-sand-800 rounded-xl shadow-sm overflow-x-auto">
                    <SchemaNode data={obj} name="Root Entity" path={i.toString()} onEdit={handleJsonEdit} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'export' && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-ink dark:text-sand-100 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-choco-500" /> Implementation Code
              </h3>
              <button
                onClick={() => navigator.clipboard.writeText(exportedCode)}
                className="chip bg-choco-500 text-white shadow-sm hover:bg-choco-600 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Copy Code
              </button>
            </div>
            <p className="text-xs text-ink-muted dark:text-sand-400 mb-4">
              Paste this block into the <code>&lt;head&gt;</code> of your HTML document.
            </p>
            <div className="relative group">
              <pre className="p-4 bg-ink dark:bg-[#1a1b1e] text-sand-100 rounded-xl text-[13px] font-mono overflow-x-auto border border-transparent dark:border-sand-800 shadow-inner leading-relaxed">
                <code>{exportedCode}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
