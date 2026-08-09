import { useState } from 'react';
import type { PageSetup, BrandProfile } from '@/types';
import { upsertPageSetup, deletePageSetup, loadPageSetups } from '@/lib/storage';
import { Save, Trash2, Library, Edit3, Building2, X } from 'lucide-react';

interface SaveLoadPanelProps {
  currentSetup: PageSetup;
  onLoadSetup: (setup: PageSetup) => void;
  brand: BrandProfile | null;
  onSaveBrand: (brand: BrandProfile) => void;
}

export function SaveLoadPanel({ currentSetup, onLoadSetup, brand, onSaveBrand }: SaveLoadPanelProps) {
  const [savedSetups, setSavedSetups] = useState<PageSetup[]>(() => loadPageSetups());
  const [showBrandEditor, setShowBrandEditor] = useState(false);
  const [brandDraft, setBrandDraft] = useState<BrandProfile>(
    brand || {
      brandName: '',
      domain: '',
      logoUrl: '',
      defaultOgImage: '',
      twitterHandle: '',
      defaultLanguage: 'en',
    }
  );

  const handleSave = () => {
    const updated = upsertPageSetup(currentSetup);
    setSavedSetups(updated);
  };

  const handleDelete = (id: string) => {
    const updated = deletePageSetup(id);
    setSavedSetups(updated);
  };

  const handleSaveBrand = () => {
    onSaveBrand(brandDraft);
    setShowBrandEditor(false);
  };

  return (
    <div className="space-y-4">
      {/* Brand Profile */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-choco-500" />
            <h3 className="text-sm font-semibold text-ink dark:text-sand-100">Brand Profile</h3>
          </div>
          <button onClick={() => setShowBrandEditor(!showBrandEditor)} className="btn-ghost text-xs px-2 py-1.5">
            {showBrandEditor ? <X size={14} /> : <Edit3 size={14} />}
            {showBrandEditor ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {brand && !showBrandEditor ? (
          <div className="space-y-2">
            <BrandRow label="Brand" value={brand.brandName} />
            <BrandRow label="Domain" value={brand.domain} />
            <BrandRow label="OG Image" value={brand.defaultOgImage} />
            <BrandRow label="Twitter" value={brand.twitterHandle ? `@${brand.twitterHandle.replace('@', '')}` : ''} />
            <p className="text-xs text-ink-muted dark:text-sand-400 mt-3">
              These defaults are automatically inherited by every new page setup.
            </p>
          </div>
        ) : showBrandEditor ? (
          <div className="space-y-3 animate-slide-up">
            <div>
              <label className="field-label">Brand Name</label>
              <input className="field-input" value={brandDraft.brandName} onChange={(e) => setBrandDraft({ ...brandDraft, brandName: e.target.value })} placeholder="Acme Inc." />
            </div>
            <div>
              <label className="field-label">Domain</label>
              <input className="field-input" value={brandDraft.domain} onChange={(e) => setBrandDraft({ ...brandDraft, domain: e.target.value })} placeholder="example.com" />
            </div>
            <div>
              <label className="field-label">Logo URL</label>
              <input className="field-input" value={brandDraft.logoUrl} onChange={(e) => setBrandDraft({ ...brandDraft, logoUrl: e.target.value })} placeholder="https://example.com/logo.png" />
            </div>
            <div>
              <label className="field-label">Default OG Image</label>
              <input className="field-input" value={brandDraft.defaultOgImage} onChange={(e) => setBrandDraft({ ...brandDraft, defaultOgImage: e.target.value })} placeholder="https://example.com/og-default.png" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Twitter Handle</label>
                <input className="field-input" value={brandDraft.twitterHandle} onChange={(e) => setBrandDraft({ ...brandDraft, twitterHandle: e.target.value })} placeholder="yoursite" />
              </div>
              <div>
                <label className="field-label">Language</label>
                <input className="field-input" value={brandDraft.defaultLanguage} onChange={(e) => setBrandDraft({ ...brandDraft, defaultLanguage: e.target.value })} placeholder="en" />
              </div>
            </div>
            <button onClick={handleSaveBrand} className="btn-primary w-full text-xs">
              <Save size={14} /> Save Brand Profile
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-sand-300 dark:border-sand-700 px-4 py-6 text-center">
            <Building2 size={20} className="text-sand-400 dark:text-sand-600 mx-auto mb-2" />
            <p className="text-sm text-ink-muted dark:text-sand-400 mb-3">No brand profile yet.</p>
            <button onClick={() => setShowBrandEditor(true)} className="btn-secondary text-xs">
              Create Brand Profile
            </button>
          </div>
        )}
      </div>

      {/* Save current setup */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Save size={18} className="text-choco-500" />
          <h3 className="text-sm font-semibold text-ink dark:text-sand-100">Save This Page Setup</h3>
        </div>
        <p className="text-xs text-ink-muted dark:text-sand-400 mb-3">
          Save this page's SEO setup so you can return, tweak, and re-export without re-entering everything. Stored in your browser.
        </p>
        <button onClick={handleSave} className="btn-primary w-full">
          <Save size={15} /> Save Current Setup
        </button>
      </div>

      {/* Saved library */}
      {savedSetups.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Library size={18} className="text-choco-500" />
            <h3 className="text-sm font-semibold text-ink dark:text-sand-100">Saved Page Setups ({savedSetups.length})</h3>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-auto scrollbar-thin">
            {savedSetups.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-sand-200 dark:border-sand-800 bg-sand-50/50 dark:bg-sand-900/50 px-3 py-2.5 hover:border-sand-300 dark:hover:border-sand-700 transition group"
              >
                <button
                  onClick={() => onLoadSetup(s)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="text-sm font-medium text-ink dark:text-sand-100 truncate">
                    {s.title || s.url || 'Untitled page'}
                  </div>
                  <div className="text-xs text-ink-muted dark:text-sand-400 truncate">
                    {s.url || 'No URL'} · {new Date(s.updatedAt).toLocaleDateString()}
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="opacity-0 group-hover:opacity-100 transition text-ink-muted dark:text-sand-400 hover:text-error dark:hover:text-error p-1.5"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BrandRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-ink-muted dark:text-sand-400 text-xs">{label}</span>
      <span className="text-ink dark:text-sand-100 font-medium text-xs truncate ml-2 max-w-[180px]">{value}</span>
    </div>
  );
}
