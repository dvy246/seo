import { useState, useEffect, lazy, Suspense } from 'react';
import type { PageSetup, BrandProfile, RobotsRules } from '@/types';
import { createBlankPageSetup, applyBrandToSetup } from '@/types';
import { loadBrandProfile, saveBrandProfile } from '@/lib/storage';
import { generateMetaTags, generateJsonLd, generateRobotsTxt } from '@/lib/generators';
import { StudioEditor } from '@/components/StudioEditor';
import { JsonLdForm } from '@/components/JsonLdForm';
import { RobotsTxtGenerator } from '@/components/RobotsTxtGenerator';
import { PreviewPanel, type PreviewPlatform } from '@/components/Previews';
import { OutputPanel } from '@/components/CodeOutput';
import { SaveLoadPanel } from '@/components/SaveLoadPanel';
import { CompanionContent } from '@/components/CompanionContent';
import { getFaqJsonLd } from '@/components/CompanionContent';
import { pageMeta, navTools } from '@/data/pages';
import { problemGuides } from '@/data/problems';
import { SmartLink } from '@/components/SmartLink';
import { navigateTo } from '@/lib/router';
import { ChevronRight, Sparkles, Code2 } from 'lucide-react';

// Standalone tools are code-split so each tool page only downloads its own chunk.
const AuditTool = lazy(() => import('@/components/AuditTool').then((m) => ({ default: m.AuditTool })));
const SeoCheckPage = lazy(() => import('@/components/SeoCheckPage').then((m) => ({ default: m.SeoCheckPage })));
const LlmsTxtGenerator = lazy(() => import('@/components/LlmsTxtGenerator').then((m) => ({ default: m.LlmsTxtGenerator })));
const HreflangGenerator = lazy(() => import('@/components/HreflangGenerator').then((m) => ({ default: m.HreflangGenerator })));
const OgImageChecker = lazy(() => import('@/components/OgImageChecker').then((m) => ({ default: m.OgImageChecker })));
const JsonLdValidator = lazy(() => import('@/components/JsonLdValidator').then((m) => ({ default: m.JsonLdValidator })));

// Minimal loading placeholder for the code-split tool chunks.
function ToolFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 rounded-full border-2 border-choco-500/30 border-t-choco-500 animate-spin" />
    </div>
  );
}

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
    let el = document.head.querySelector('script[data-serpcraft-faq]') as HTMLScriptElement | null;
    if (faqJsonLd) {
      if (!el) {
        el = document.createElement('script');
        el.type = 'application/ld+json';
        el.setAttribute('data-serpcraft-faq', 'true');
        document.head.appendChild(el);
      }
      el.textContent = faqJsonLd;
    } else if (el) {
      el.remove();
    }
    return () => {
      const existing = document.head.querySelector('script[data-serpcraft-faq]');
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
  const isAuditPage = path === '/url-debugger';
  const isSeoCheckPage = path === '/seo-check';
  const isLlmsPage = path === '/llms-txt-generator';
  const isHreflangPage = path === '/hreflang-generator';
  const isOgImagePage = path === '/og-image-checker';
  const isJsonLdValidatorPage = path === '/json-ld-validator';
  const isJsonLdPage = path === '/json-ld-generator' || path === '/schema-markup-generator';
  const isRobotsPage = path === '/robots-txt-generator';
  const isSocialPreviewPage = path === '/social-preview-tool' || path === '/serp-preview-tool';
  const isStandaloneTool = isAuditPage || isSeoCheckPage || isLlmsPage || isHreflangPage || isOgImagePage || isJsonLdValidatorPage;

  const showJsonLdForm = isStudioPage || isJsonLdPage || (!isRobotsPage && !isSocialPreviewPage && !isStandaloneTool);
  const showRobotsForm = isStudioPage || isRobotsPage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      {path !== '/studio' && (
        <nav className="flex items-center gap-1.5 text-sm text-ink-muted dark:text-sand-400 mb-6">
          <SmartLink to="/" className="hover:text-choco-600 dark:hover:text-choco-400 transition-colors">Home</SmartLink>
          <ChevronRight size={14} />
          <SmartLink to="/studio" className="hover:text-choco-600 dark:hover:text-choco-400 transition-colors">Studio</SmartLink>
          <ChevronRight size={14} />
          <span className="text-ink dark:text-sand-50 font-medium">{meta.h1}</span>
        </nav>
      )}

      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-ink dark:text-sand-50 tracking-tight text-balance">
          {meta.h1}
        </h1>
        <p className="mt-3 text-lg text-ink-soft dark:text-sand-300 leading-relaxed max-w-2xl text-balance">
          {meta.description.split('.')[0]}.
        </p>
      </div>

      {/* Quick tool switcher for non-studio pages */}
      {!isStudioPage && (
        <div className="flex flex-wrap gap-2 mb-8">
          {navTools.map((tool) => (
            <SmartLink
              key={tool.path}
              to={tool.path}
              aria-current={path === tool.path ? 'page' : undefined}
              className={`chip transition-colors ${
                path === tool.path
                  ? 'bg-choco-500 text-white'
                  : 'bg-white dark:bg-sand-900 border border-sand-200 dark:border-sand-700 text-ink-soft dark:text-sand-300 hover:border-sand-300 dark:hover:border-sand-600'
              }`}
            >
              {tool.shortLabel}
            </SmartLink>
          ))}
        </div>
      )}

      {/* View tabs for tool pages */}
      {!isStudioPage && !isRobotsPage && !isStandaloneTool && (
        <div className="flex gap-1 mb-6 border-b border-sand-200 dark:border-sand-800">
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
      ) : isAuditPage ? (
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<ToolFallback />}>
            <AuditTool />
          </Suspense>
        </div>
      ) : isSeoCheckPage ? (
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<ToolFallback />}>
            <SeoCheckPage />
          </Suspense>
        </div>
      ) : isLlmsPage ? (
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<ToolFallback />}>
            <LlmsTxtGenerator onOpenAudit={() => navigateTo('/url-debugger')} />
          </Suspense>
        </div>
      ) : isHreflangPage ? (
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<ToolFallback />}>
            <HreflangGenerator />
          </Suspense>
        </div>
      ) : isOgImagePage ? (
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<ToolFallback />}>
            <OgImageChecker />
          </Suspense>
        </div>
      ) : isJsonLdValidatorPage ? (
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<ToolFallback />}>
            <JsonLdValidator />
          </Suspense>
        </div>
      ) : isJsonLdPage ? (
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-5">
            {activeView === 'studio' && (
              <>
                <JsonLdForm schemaType={setup.schemaType} schemaData={setup.schemaData} onChange={handleSchemaChange} />
                <OutputPanel metaTags={metaTags} jsonLd={jsonLd} robotsTxt={robotsTxt} />
              </>
            )}
            {activeView === 'jsonld' && (
              <>
                <JsonLdForm schemaType={setup.schemaType} schemaData={setup.schemaData} onChange={handleSchemaChange} />
                <OutputPanel metaTags={metaTags} jsonLd={jsonLd} robotsTxt={robotsTxt} />
              </>
            )}
          </div>
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
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-6">
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
      )}

      {/* SEO Companion content per tool page */}
      <div className="mt-16 pt-12 border-t border-sand-200 dark:border-sand-800">
        <CompanionContent path={path} />
      </div>

      {/* Internal tool cross-linking grid */}
      <div className="mt-16 pt-12 border-t border-sand-200 dark:border-sand-800">
        <h2 className="text-xl font-serif font-semibold text-ink dark:text-sand-50 mb-6">More SEO Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {navTools
            .filter((t) => t.path !== path)
            .slice(0, 4)
            .map((tool) => (
              <SmartLink
                key={tool.path}
                to={tool.path}
                className="card p-4 block hover:shadow-lift transition-all duration-200 hover:border-sand-300 dark:hover:border-sand-600"
              >
                <div className="text-sm font-medium text-ink dark:text-sand-100 mb-1">{tool.label}</div>
                <div className="text-xs text-ink-muted dark:text-sand-400">{tool.description}</div>
              </SmartLink>
            ))}
        </div>

        {/* Problem guides: permanent, crawlable inbound links */}
        <div className="mt-8 pt-6 border-t border-sand-200 dark:border-sand-800">
          <h2 className="text-lg font-serif font-semibold text-ink dark:text-sand-50 mb-4">Fixing a known problem?</h2>
          <div className="flex flex-wrap gap-2">
            {problemGuides.map((g) => (
              <SmartLink
                key={g.slug}
                to={g.path}
                className="chip bg-sand-100 dark:bg-sand-800 text-ink-soft dark:text-sand-300 hover:bg-sand-200 dark:hover:bg-sand-700 transition-colors"
              >
                {g.h1}
              </SmartLink>
            ))}
          </div>
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
          ? 'border-choco-500 text-choco-600 dark:text-choco-400'
          : 'border-transparent text-ink-muted dark:text-sand-400 hover:text-ink dark:hover:text-sand-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
