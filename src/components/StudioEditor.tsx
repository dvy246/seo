import type { PageSetup, BrandProfile } from '@/types';
import { Link as LinkIcon, FileText, Image as ImageIcon, Twitter, Settings2, Info } from 'lucide-react';
import { useState, useRef } from 'react';
import { parseMetaFromHtml } from '@/lib/generators';

interface StudioEditorProps {
  setup: PageSetup;
  brand?: BrandProfile | null;
  onChange: (setup: PageSetup) => void;
}

type Section = 'basic' | 'openGraph' | 'twitter' | 'advanced';

export function StudioEditor({ setup, brand, onChange }: StudioEditorProps) {
  const [openSections, setOpenSections] = useState<Record<Section, boolean>>({
    basic: true,
    openGraph: true,
    twitter: true,
    advanced: false,
  });
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggle = (s: Section) => setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const update = (field: keyof PageSetup, value: string | boolean) => {
    onChange({ ...setup, [field]: value });
  };

  const handleImport = () => {
    const parsed = parseMetaFromHtml(importText);
    onChange({
      ...setup,
      title: parsed.title || setup.title,
      description: parsed.description || setup.description,
      canonicalUrl: parsed.canonical || setup.canonicalUrl,
      ogTitle: parsed.ogTitle || setup.ogTitle,
      ogDescription: parsed.ogDescription || setup.ogDescription,
      ogImage: parsed.ogImage || setup.ogImage,
      ogType: parsed.ogType || setup.ogType,
      twitterCard: (parsed.twitterCard as PageSetup['twitterCard']) || setup.twitterCard,
      twitterTitle: parsed.twitterTitle || setup.twitterTitle,
      twitterDescription: parsed.twitterDescription || setup.twitterDescription,
      twitterImage: parsed.twitterImage || setup.twitterImage,
      twitterSite: parsed.twitterSite || setup.twitterSite,
      twitterCreator: parsed.twitterCreator || setup.twitterCreator,
      keywords: parsed.keywords || setup.keywords,
      noindex: parsed.noindex ?? setup.noindex,
      nofollow: parsed.nofollow ?? setup.nofollow,
    });
    setShowImport(false);
    setImportText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) || '';
      setImportText(text);
      setShowImport(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5">
      {/* Import bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-choco-50 flex items-center justify-center flex-none">
              <FileText size={16} className="text-choco-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink">Import existing tags</div>
              <div className="text-xs text-ink-muted">Paste HTML or upload an HTML file to pre-fill fields</div>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs px-3 py-2">
              Upload HTML
            </button>
            <button onClick={() => setShowImport(!showImport)} className="btn-secondary text-xs px-3 py-2">
              {showImport ? 'Cancel' : 'Paste HTML'}
            </button>
          </div>
        </div>
        {showImport && (
          <div className="mt-4 animate-slide-up">
            <textarea
              className="field-input min-h-[120px] font-mono text-[13px]"
              placeholder="Paste your HTML <head> section here..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={5}
            />
            <button onClick={handleImport} disabled={!importText.trim()} className="btn-primary mt-2 text-xs px-3 py-2">
              Import Tags
            </button>
          </div>
        )}
      </div>

      {/* Basic section */}
      <SectionCard
        title="Page Basics"
        icon={<FileText size={16} className="text-choco-500" />}
        isOpen={openSections.basic}
        onToggle={() => toggle('basic')}
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">Page URL</label>
            <input
              type="url"
              className="field-input"
              value={setup.url}
              onChange={(e) => update('url', e.target.value)}
              placeholder="https://example.com/blog/my-post"
            />
            <p className="field-hint">The full URL of the page. Used for previews and as a default for canonical.</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label !mb-0">Title Tag</label>
              <CharCounter value={setup.title} max={60} />
            </div>
            <input
              type="text"
              className="field-input"
              value={setup.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Your Page Title — Brand Name"
            />
            <p className="field-hint">The &lt;title&gt; tag. Google truncates by pixel width (~580px). Aim for 50-60 characters.</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label !mb-0">Meta Description</label>
              <CharCounter value={setup.description} max={160} />
            </div>
            <textarea
              className="field-input min-h-[80px] resize-y"
              value={setup.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="A compelling description that makes people want to click..."
              rows={3}
            />
            <p className="field-hint">Shows in Google search results. Aim for 150-160 characters. Google truncates at ~920px.</p>
          </div>
          <div>
            <label className="field-label">Canonical URL</label>
            <div className="relative">
              <LinkIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="url"
                className="field-input pl-9"
                value={setup.canonicalUrl}
                onChange={(e) => update('canonicalUrl', e.target.value)}
                placeholder={setup.url || 'https://example.com/blog/my-post'}
              />
            </div>
            <p className="field-hint">Defaults to your page URL if empty. Use when multiple URLs show the same content.</p>
          </div>
        </div>
      </SectionCard>

      {/* Open Graph section */}
      <SectionCard
        title="Open Graph (Facebook, LinkedIn, Slack, Discord)"
        icon={<ImageIcon size={16} className="text-choco-500" />}
        isOpen={openSections.openGraph}
        onToggle={() => toggle('openGraph')}
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">OG Type</label>
            <select
              className="field-input cursor-pointer"
              value={setup.ogType}
              onChange={(e) => update('ogType', e.target.value)}
            >
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
              <option value="profile">profile</option>
              <option value="book">book</option>
              <option value="music.song">music.song</option>
              <option value="video.movie">video.movie</option>
            </select>
            <p className="field-hint">The type of content. Most pages use "website" or "article".</p>
          </div>
          <div>
            <label className="field-label">og:title</label>
            <input
              type="text"
              className="field-input"
              value={setup.ogTitle}
              onChange={(e) => update('ogTitle', e.target.value)}
              placeholder={setup.title || 'Falls back to your title tag'}
            />
            <p className="field-hint">Title for social cards. Leave empty to use your title tag.</p>
          </div>
          <div>
            <label className="field-label">og:description</label>
            <textarea
              className="field-input min-h-[60px] resize-y"
              value={setup.ogDescription}
              onChange={(e) => update('ogDescription', e.target.value)}
              placeholder={setup.description || 'Falls back to your meta description'}
              rows={2}
            />
            <p className="field-hint">Description for social cards. Leave empty to use your meta description.</p>
          </div>
          <div>
            <label className="field-label">og:image</label>
            <input
              type="url"
              className="field-input"
              value={setup.ogImage}
              onChange={(e) => update('ogImage', e.target.value)}
              placeholder="https://example.com/og-image.png"
            />
            <p className="field-hint">
              Recommended: 1200×630px. Use an absolute URL.
              {brand?.defaultOgImage && !setup.ogImage && (
                <span className="text-choco-600"> Your brand default image will be used.</span>
              )}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Twitter section */}
      <SectionCard
        title="Twitter / X Card"
        icon={<Twitter size={16} className="text-choco-500" />}
        isOpen={openSections.twitter}
        onToggle={() => toggle('twitter')}
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">Card Type</label>
            <select
              className="field-input cursor-pointer"
              value={setup.twitterCard}
              onChange={(e) => update('twitterCard', e.target.value as PageSetup['twitterCard'])}
            >
              <option value="summary">summary — small square image</option>
              <option value="summary_large_image">summary_large_image — large image</option>
              <option value="app">app — mobile app</option>
              <option value="player">player — video/audio</option>
            </select>
            <p className="field-hint">"summary_large_image" gives the biggest visual impact.</p>
          </div>
          <div>
            <label className="field-label">twitter:title</label>
            <input
              type="text"
              className="field-input"
              value={setup.twitterTitle}
              onChange={(e) => update('twitterTitle', e.target.value)}
              placeholder={setup.ogTitle || setup.title || 'Falls back to OG title or title tag'}
            />
          </div>
          <div>
            <label className="field-label">twitter:description</label>
            <textarea
              className="field-input min-h-[60px] resize-y"
              value={setup.twitterDescription}
              onChange={(e) => update('twitterDescription', e.target.value)}
              placeholder={setup.ogDescription || setup.description || 'Falls back to OG description'}
              rows={2}
            />
          </div>
          <div>
            <label className="field-label">twitter:image</label>
            <input
              type="url"
              className="field-input"
              value={setup.twitterImage}
              onChange={(e) => update('twitterImage', e.target.value)}
              placeholder={setup.ogImage || 'https://example.com/twitter-image.png'}
            />
            <p className="field-hint">Falls back to your OG image if empty.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">twitter:site</label>
              <input
                type="text"
                className="field-input"
                value={setup.twitterSite}
                onChange={(e) => update('twitterSite', e.target.value)}
                placeholder="@yoursite"
              />
              <p className="field-hint">The site's X handle.</p>
            </div>
            <div>
              <label className="field-label">twitter:creator</label>
              <input
                type="text"
                className="field-input"
                value={setup.twitterCreator}
                onChange={(e) => update('twitterCreator', e.target.value)}
                placeholder="@author"
              />
              <p className="field-hint">The author's X handle.</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Advanced section */}
      <SectionCard
        title="Advanced"
        icon={<Settings2 size={16} className="text-choco-500" />}
        isOpen={openSections.advanced}
        onToggle={() => toggle('advanced')}
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">Keywords (optional)</label>
            <input
              type="text"
              className="field-input"
              value={setup.keywords}
              onChange={(e) => update('keywords', e.target.value)}
              placeholder="seo, meta tags, open graph"
            />
            <p className="field-hint">Most search engines ignore this now, but some tools use it.</p>
          </div>
          <div>
            <label className="field-label">Language</label>
            <input
              type="text"
              className="field-input"
              value={setup.language}
              onChange={(e) => update('language', e.target.value)}
              placeholder="en"
            />
            <p className="field-hint">ISO language code (e.g. en, fr, de, es).</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-sand-300 text-choco-500 focus:ring-choco-500/30"
                checked={setup.noindex}
                onChange={(e) => update('noindex', e.target.checked)}
              />
              <div>
                <span className="text-sm font-medium text-ink">noindex</span>
                <span className="text-xs text-ink-muted ml-2">Tell search engines not to index this page</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-sand-300 text-choco-500 focus:ring-choco-500/30"
                checked={setup.nofollow}
                onChange={(e) => update('nofollow', e.target.checked)}
              />
              <div>
                <span className="text-sm font-medium text-ink">nofollow</span>
                <span className="text-xs text-ink-muted ml-2">Tell crawlers not to follow links on this page</span>
              </div>
            </label>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-sand-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
        </div>
        <svg
          className={`w-4 h-4 text-ink-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="px-5 pb-5 pt-1 animate-slide-up">{children}</div>}
    </div>
  );
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = (value || '').length;
  const ratio = len / max;
  const color = ratio > 1 ? 'text-error' : ratio > 0.85 ? 'text-warning' : 'text-ink-muted';
  return (
    <span className={`text-xs font-mono ${color}`}>
      {len}/{max}
    </span>
  );
}
