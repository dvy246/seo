import { useState, useEffect } from 'react';
import { PageSetup, BrandProfile, RobotsRules } from '@/types';
import { createBlankPageSetup, applyBrandToSetup } from '@/types';
import { loadBrandProfile, saveBrandProfile } from '@/lib/storage';
import { generateMetaTags, generateJsonLd, generateRobotsTxt } from '@/lib/generators';
import { StudioEditor } from '@/components/StudioEditor';
import { JsonLdForm } from '@/components/JsonLdForm';
import { RobotsTxtGenerator } from '@/components/RobotsTxtGenerator';
import { PreviewPanel, PreviewPlatform } from '@/components/Previews';
import { OutputPanel } from '@/components/CodeOutput';
import { SaveLoadPanel } from '@/components/SaveLoadPanel';
import { CompanionContent } from '@/components/CompanionContent';
import { getFaqJsonLd } from '@/components/CompanionContent';
import { pageMeta, navTools } from '@/data/pages';
import { navigateTo } from '@/lib/router';
import { ChevronRight, Sparkles, Eye, Code2 } from 'lucide-react';

interface StudioPageProps {
  path: string;
}

export function StudioPage({ path }: StudioPageProps) {
  const [setup, setSetup] = useState<PageSetup>(() => {
    const brand = loadBrandProfile();
    return applyBrandToSetup(createBlankPageSetup(brand || undefined), brand || { brandName: '', domain: '', logoUrl: '', defaultOgImage: '', twitterHandle: '', defaultLanguage: 'en' });
  });
  const [brand, setBrand] = useState<BrandProfile | null>(() => loadBrandProfile());
  const [activePlatform, setActivePlatform] = useState<PreviewPlatform>('google');
  const [activeView, setActiveView] = useState<'studio' | 'jsonld' | 'robots'>('studio');

  const meta = pageMeta[path] || pageMeta['/'];

  // Inject FAQ schema when companion content has FAQs
  useEffect(() => {
    const faqJsonLd = getFaqJsonLd(path);
    let el = document.head.querySelector('script[data-metaforge-faq]') as HTMLScriptElement | null;
    if (faqJsonLd) {
      if (!el) {
        el = document.createElement('script');
        el.type = 'application/ld+json';
        el.setAttribute('data-metaforge-faq', 'true');
        document.head.appendChild(el);
      }
      el.textContent = faqJsonLd;
    } else if (el) {
      el.remove();
    }
    return () => {
      const existing = document.head.querySelector('script[data-metaforge-faq]');
      if (existing) existing.remove();
    };
  }, [path]);

  const metaTags = generateMetaTags(setup);
  const jsonLd = generateJsonLd(setup);
  const robotsTxt = generateRobotsTxt(setup.robotsRules);

  const handleSetupChange = (newSetup: PageSetup) => {
    setSetup(newSetup);
  };

  const handleSchemaChange = (type: PageSetup['schemaType'], data: Record<string, unknown>) => {
    setSetup({ ...setup, schemaType: type, schemaData: data });
  };

  const handleRobotsChange = (rules: RobotsRules) => {
    setSetup({ ...setup, robotsRules: rules });
  };

  const handleLoadSetup = (loaded: PageSetup) => {
    setSetup(loaded);
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBrand = (newBrand: BrandProfile) => {
    saveBrandProfile(newBrand);
    setBrand(newBrand);
    setSetup((prev) => applyBrandToSetup(prev, newBrand));
  };

  // Determine which sections to show based on the page
  const isStudioPage = path === '/studio';
  const isMetaTagPage = path === '/meta-tag-generator';
  const isOgPage = path === '/open-graph-generator';
  const isTwitterPage = path === '/twitter-card-generator';
  const isSocialPreviewPage = path === '/social-preview-tool' || path === '/serp-preview-tool';
  const isJsonLdPage = path === '/json-ld-generator' || path === '/schema-markup-generator';
  const isRobotsPage = path === '/robots-txt-generator';

  // For dedicated tool pages, show only the relevant sections
  const showEditor = !isJsonLdPage && !isRobotsPage;
  const showJsonLdForm = isStudioPage || isJsonLdPage || (!isRobotsPage && !isSocialPreviewPage);
  const showRobotsForm = isStudioPage || isRobotsPage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      {path !== '/studio' && (
        <nav className="flex items-center gap-1.5 text-sm text-ink-muted mb-6">
          <button onClick={() => navigateTo('/')} className="hover:text-choco-600 transition-colors">Home</button>
          <ChevronRight size={14} />
          <button onClick={() => navigateTo('/studio')} className="hover:text-choco-600 transition-colors">Studio</button>
          <ChevronRight size={14} />
          <span className="text-ink font-medium">{meta.h1}</span>
        </nav>
      )}

      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-ink tracking-tight text-balance">
          {meta.h1}
        </h1>
        <p className="mt-3 text-lg text-ink-soft leading-relaxed max-w-2xl text-balance">
          {meta.description.split('.')[0]}.
        </p>
      </div>

      {/* Quick tool switcher for non-studio pages */}
      {!isStudioPage && (
        <div className="flex flex-wrap gap-2 mb-8">
          {navTools.map((tool) => (
            <button
              key={tool.path}
              onClick={() => navigateTo(tool.path)}
              className={`chip transition-colors ${
                path === tool.path
                  ? 'bg-choco-500 text-white'
                  : 'bg-white border border-sand-200 text-ink-soft hover:border-sand-300'
              }`}
            >
              {tool.shortLabel}
            </button>
          ))}
        </div>
      )}

      {/* View tabs for tool pages */}
      {!isStudioPage && !isRobotsPage && (
        <div className="flex gap-1 mb-6 border-b border-sand-200">
          <ViewTab active={activeView === 'studio'} onClick={() => setActiveView('studio')} icon={<Sparkles size={15} />} label="Editor & Preview" />
          {showJsonLdForm && (
            <ViewTab active={activeView === 'jsonld'} onClick={() => setActiveView('jsonld')} icon={<Code2 size={15} />} label="JSON-LD" />
          )}
          {showRobotsForm && (
            <ViewTab active={activeView === 'robots'} onClick={() => setActiveView('robots')} icon={<Code2 size={15} />} label="robots.txt" />
          )}
        </div>
      )}

      {/* Main layout */}
      {isStudioPage ? (
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-6">
          {/* Left: editor + JSON-LD + robots */}
          <div className="space-y-5">
            <StudioEditor setup={setup} brand={brand} onChange={handleSetupChange} />
            <JsonLdForm schemaType={setup.schemaType} schemaData={setup.schemaData} onChange={handleSchemaChange} />
            <RobotsTxtGenerator rules={setup.robotsRules} onChange={handleRobotsChange} />
            <OutputPanel metaTags={metaTags} jsonLd={jsonLd} robotsTxt={robotsTxt} />
          </div>
          {/* Right: preview + save/load */}
          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-auto scrollbar-thin">
            <PreviewPanel setup={setup} activePlatform={activePlatform} onPlatformChange={setActivePlatform} />
            <SaveLoadPanel
              currentSetup={setup}
              onLoadSetup={handleLoadSetup}
              brand={brand}
              onSaveBrand={handleSaveBrand}
            />
          </div>
        </div>
      ) : isRobotsPage ? (
        <div className="max-w-4xl mx-auto">
          <RobotsTxtGenerator rules={setup.robotsRules} onChange={handleRobotsChange} />
        </div>
      ) : isJsonLdPage ? (
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-5">
            {activeView === 'studio' && (
              <>
                <StudioEditor setup={setup} brand={brand} onChange={handleSetupChange} />
                <OutputPanel metaTags={metaTags} jsonLd={jsonLd} robotsTxt={robotsTxt} />
              </>
            )}
            {activeView === 'jsonld' && (
              <>
                <JsonLdForm schemaType={setup.schemaType} schemaData={setup.schemaData} onChange={handleSchemaChange} />
                <OutputPanel metaTags={metaTags} jsonLd={jsonLd} robotsTxt={robotsTxt} />
              </>
            )}
            {activeView === 'robots' && (
              <RobotsTxtGenerator rules={setup.robotsRules} onChange={handleRobotsChange} />
            )}
          </div>
          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <PreviewPanel setup={setup} activePlatform={activePlatform} onPlatformChange={setActivePlatform} />
          </div>
        </div>
      ) : (
        /* Other tool pages: meta tags, OG, twitter, social preview, SERP preview */
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-5">
            {activeView === 'studio' && (
              <>
                <StudioEditor setup={setup} brand={brand} onChange={handleSetupChange} />
                <OutputPanel metaTags={metaTags} jsonLd={jsonLd} robotsTxt={robotsTxt} />
              </>
            )}
            {activeView === 'jsonld' && (
              <JsonLdForm schemaType={setup.schemaType} schemaData={setup.schemaData} onChange={handleSchemaChange} />
            )}
            {activeView === 'robots' && (
              <RobotsTxtGenerator rules={setup.robotsRules} onChange={handleRobotsChange} />
            )}
          </div>
          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <PreviewPanel setup={setup} activePlatform={activePlatform} onPlatformChange={setActivePlatform} />
            <SaveLoadPanel
              currentSetup={setup}
              onLoadSetup={handleLoadSetup}
              brand={brand}
              onSaveBrand={handleSaveBrand}
            />
          </div>
        </div>
      )}

      {/* Companion content */}
      <div className="mt-16 pt-10 border-t border-sand-200">
        <CompanionContent path={path} />
      </div>

      {/* Related tools */}
      <div className="mt-16 pt-10 border-t border-sand-200">
        <h2 className="font-serif text-2xl font-semibold text-ink mb-6">Related Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {navTools
            .filter((t) => t.path !== path)
            .slice(0, 4)
            .map((tool) => (
              <button
                key={tool.path}
                onClick={() => navigateTo(tool.path)}
                className="card p-4 text-left hover:shadow-lift transition-all duration-200 hover:border-sand-300"
              >
                <div className="text-sm font-medium text-ink mb-1">{tool.label}</div>
                <div className="text-xs text-ink-muted">{tool.description}</div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

function ViewTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
        active
          ? 'border-choco-500 text-choco-600'
          : 'border-transparent text-ink-muted hover:text-ink'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
