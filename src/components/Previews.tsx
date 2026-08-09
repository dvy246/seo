import type { PageSetup } from '@/types';
import { truncateTitle, truncateDescription } from '@/lib/pixelWidth';

function getDomain(url: string): string {
  try {
    if (!url) return 'example.com';
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || 'example.com';
  }
}

function getPath(url: string): string {
  try {
    if (!url) return '';
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts.length > 0 ? ` › ${parts.join(' › ')}` : '';
  } catch {
    return '';
  }
}

function Favicon({ domain }: { domain: string }) {
  return (
    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-sand-200 dark:bg-sand-800 text-[11px] font-semibold text-ink-soft dark:text-sand-200">
      {domain.charAt(0).toUpperCase()}
    </span>
  );
}

// ==================== Google SERP Preview ====================
export function GoogleSerpPreview({ setup }: { setup: PageSetup }) {
  const url = setup.canonicalUrl || setup.url || 'https://example.com';
  const domain = getDomain(url);
  const path = getPath(url);
  const title = (setup.ogTitle || setup.title || 'Your Page Title').trim();
  const description = (setup.description || 'Your page description appears here. Edit your title and description on the left to see the Google preview update in real time.').trim();

  const titleTrunc = truncateTitle(title);
  const descTrunc = truncateDescription(description);

  return (
    <div className="max-w-[600px] w-full">
      <div className="flex items-center gap-2 mb-1">
        <Favicon domain={domain} />
        <div className="min-w-0">
          <div className="text-[14px] text-ink dark:text-sand-100 truncate">{domain}</div>
          {path && <div className="text-[12px] text-ink-muted dark:text-sand-400 truncate -mt-0.5">{path}</div>}
        </div>
      </div>
      <h3 className="text-[20px] leading-[1.3] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer mb-1.5 text-balance font-sans">
        {titleTrunc.text}
      </h3>
      <p className="text-[14px] leading-[1.58] text-[#4d5156] dark:text-[#bdc1c6] text-balance font-sans">
        {descTrunc.text}
      </p>
      {(titleTrunc.truncated || descTrunc.truncated) && (
        <div className="mt-2 flex items-center gap-2 text-[12px]">
          {titleTrunc.truncated && (
            <span className="chip bg-warning/10 text-warning">Title truncated by Google</span>
          )}
          {descTrunc.truncated && !titleTrunc.truncated && (
            <span className="chip bg-warning/10 text-warning">Description truncated by Google</span>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== Facebook / Open Graph ====================
export function FacebookPreview({ setup }: { setup: PageSetup }) {
  const url = setup.canonicalUrl || setup.url || 'https://example.com';
  const domain = getDomain(url);
  const title = (setup.ogTitle || setup.title || 'Your Page Title').trim();
  const description = (setup.ogDescription || setup.description || 'Your page description appears here.').trim();
  const image = setup.ogImage || setup.twitterImage;

  return (
    <div className="max-w-[524px] w-full rounded-lg overflow-hidden border border-sand-200 dark:border-sand-800 bg-white dark:bg-sand-900">
      <div className="aspect-[1.91/1] w-full bg-sand-100 dark:bg-sand-800 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="text-ink-muted dark:text-sand-400 text-sm">No OG image set</div>
        )}
      </div>
      <div className="px-3 py-2.5 bg-[#f0f2f5] dark:bg-sand-800/80">
        <div className="text-[12px] uppercase text-[#65676b] dark:text-sand-400 mb-0.5 tracking-wide">{domain}</div>
        <div className="text-[17px] font-semibold text-[#050505] dark:text-sand-50 leading-snug text-balance line-clamp-2">{title}</div>
        <div className="text-[14px] text-[#65676b] dark:text-sand-300 leading-snug line-clamp-2 mt-0.5">{description}</div>
      </div>
    </div>
  );
}

// ==================== X / Twitter ====================
export function TwitterPreview({ setup }: { setup: PageSetup }) {
  const title = (setup.twitterTitle || setup.ogTitle || setup.title || 'Your Page Title').trim();
  const description = (setup.twitterDescription || setup.ogDescription || setup.description || 'Your page description.').trim();
  const image = setup.twitterImage || setup.ogImage;
  const isLargeCard = setup.twitterCard === 'summary_large_image';

  if (isLargeCard) {
    return (
      <div className="max-w-[506px] w-full rounded-2xl overflow-hidden border border-[#eff3f4] dark:border-sand-800 bg-white dark:bg-sand-900">
        <div className="aspect-[2/1] w-full bg-sand-100 dark:bg-sand-800 flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="text-ink-muted dark:text-sand-400 text-sm">No card image set</div>
          )}
        </div>
        <div className="px-3 py-2.5 border-t border-[#eff3f4] dark:border-sand-800">
          <div className="text-[13px] text-[#536471] dark:text-sand-400 mb-0.5">{getDomain(setup.canonicalUrl || setup.url || 'example.com')}</div>
          <div className="text-[15px] text-[#0f1419] dark:text-sand-50 leading-snug text-balance line-clamp-2">{title}</div>
          <div className="text-[13px] text-[#536471] dark:text-sand-300 leading-snug line-clamp-2 mt-0.5">{description}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[506px] w-full rounded-2xl overflow-hidden border border-[#eff3f4] dark:border-sand-800 bg-white dark:bg-sand-900 flex">
      <div className="w-[120px] flex-none bg-sand-100 dark:bg-sand-800 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="text-ink-muted dark:text-sand-400 text-[10px] text-center px-1">No image</div>
        )}
      </div>
      <div className="px-3 py-2.5 flex-1 min-w-0">
        <div className="text-[13px] text-[#536471] dark:text-sand-400 mb-0.5">{getDomain(setup.canonicalUrl || setup.url || 'example.com')}</div>
        <div className="text-[15px] text-[#0f1419] dark:text-sand-50 leading-snug text-balance line-clamp-2">{title}</div>
        <div className="text-[13px] text-[#536471] dark:text-sand-300 leading-snug line-clamp-2 mt-0.5">{description}</div>
      </div>
    </div>
  );
}

// ==================== LinkedIn ====================
export function LinkedInPreview({ setup }: { setup: PageSetup }) {
  const url = setup.canonicalUrl || setup.url || 'https://example.com';
  const domain = getDomain(url);
  const title = (setup.ogTitle || setup.title || 'Your Page Title').trim();
  const description = (setup.ogDescription || setup.description || 'Your page description appears here.').trim();
  const image = setup.ogImage || setup.twitterImage;

  return (
    <div className="max-w-[555px] w-full rounded-lg overflow-hidden border border-[#e6e6e6] dark:border-sand-800 bg-white dark:bg-sand-900">
      <div className="aspect-[1.91/1] w-full bg-sand-100 dark:bg-sand-800 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="text-ink-muted dark:text-sand-400 text-sm">No OG image set</div>
        )}
      </div>
      <div className="px-3 py-2 bg-white dark:bg-sand-900">
        <div className="text-[12px] text-[#000000e6] dark:text-sand-400 mb-0.5 truncate">{domain}</div>
        <div className="text-[14px] font-semibold text-[#000000e6] dark:text-sand-50 leading-snug text-balance line-clamp-2">{title}</div>
        <div className="text-[12px] text-[#00000099] dark:text-sand-300 leading-snug line-clamp-2 mt-0.5">{description}</div>
      </div>
    </div>
  );
}

// ==================== Slack ====================
export function SlackPreview({ setup }: { setup: PageSetup }) {
  const url = setup.canonicalUrl || setup.url || 'https://example.com';
  const domain = getDomain(url);
  const title = (setup.ogTitle || setup.title || 'Your Page Title').trim();
  const description = (setup.ogDescription || setup.description || 'Your page description appears here.').trim();
  const image = setup.ogImage || setup.twitterImage;

  return (
    <div className="max-w-[520px] w-full p-3 bg-white dark:bg-sand-900 rounded-md border-l-4 border-[#E01E5A] border-y border-r border-sand-200 dark:border-sand-800">
      <div className="flex gap-3">
        {image && (
          <div className="w-[100px] h-[100px] flex-none rounded overflow-hidden bg-sand-100 dark:bg-sand-800">
            <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-[#1d1c1d] dark:text-sand-50 leading-snug text-balance">{title}</div>
          <div className="text-[13px] text-[#1d1c1d] dark:text-sand-200 leading-snug line-clamp-3 mt-0.5">{description}</div>
          <div className="text-[13px] text-[#616061] dark:text-sand-400 mt-1 truncate">{domain}</div>
        </div>
      </div>
    </div>
  );
}

// ==================== Discord ====================
export function DiscordPreview({ setup }: { setup: PageSetup }) {
  const url = setup.canonicalUrl || setup.url || 'https://example.com';
  const domain = getDomain(url);
  const title = (setup.ogTitle || setup.title || 'Your Page Title').trim();
  const description = (setup.ogDescription || setup.description || 'Your page description appears here.').trim();
  const image = setup.ogImage || setup.twitterImage;

  return (
    <div className="max-w-[432px] w-full rounded-md overflow-hidden border-l-4 border-[#5865F2] bg-[#2b2d31] dark:bg-sand-900 p-0">
      {image && (
        <div className="w-full max-h-[200px] overflow-hidden bg-[#1e1f22] dark:bg-sand-950">
          <img src={image} alt="" className="w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div className="px-3 py-2.5">
        <div className="text-[13px] text-[#00a8fc] dark:text-pastel-400 font-medium mb-0.5">{domain}</div>
        <div className="text-[16px] font-semibold text-[#f2f3f5] dark:text-sand-50 leading-snug text-balance">{title}</div>
        {description && (
          <div className="text-[14px] text-[#dbdee1] dark:text-sand-300 leading-snug line-clamp-3 mt-1">{description}</div>
        )}
      </div>
    </div>
  );
}

export type PreviewPlatform = 'google' | 'facebook' | 'twitter' | 'linkedin' | 'slack' | 'discord';

interface PlatformTab {
  id: PreviewPlatform;
  label: string;
}

const platformTabs: PlatformTab[] = [
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'slack', label: 'Slack' },
  { id: 'discord', label: 'Discord' },
];

export function PreviewPanel({ setup, activePlatform, onPlatformChange }: {
  setup: PageSetup;
  activePlatform: PreviewPlatform;
  onPlatformChange: (p: PreviewPlatform) => void;
}) {
  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ink dark:text-sand-100">Live Preview</h3>
        <span className="text-xs text-ink-muted dark:text-sand-400">Updates as you type</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5 border-b border-sand-200 dark:border-sand-800 pb-3">
        {platformTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onPlatformChange(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              activePlatform === tab.id
                ? 'bg-choco-500 text-white shadow-soft'
                : 'text-ink-soft dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px] flex items-start justify-center py-4">
        {activePlatform === 'google' && <GoogleSerpPreview setup={setup} />}
        {activePlatform === 'facebook' && <FacebookPreview setup={setup} />}
        {activePlatform === 'twitter' && <TwitterPreview setup={setup} />}
        {activePlatform === 'linkedin' && <LinkedInPreview setup={setup} />}
        {activePlatform === 'slack' && <SlackPreview setup={setup} />}
        {activePlatform === 'discord' && <DiscordPreview setup={setup} />}
      </div>
    </div>
  );
}
