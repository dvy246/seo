import { useState, useEffect } from 'react';
import { navTools } from '@/data/pages';
import { Menu, X, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getTranslations } from '@/lib/translations';
import { locales, type Locale } from '@/lib/i18n';
import { localizeHref } from '@/lib/router';

interface HeaderProps {
  currentPath: string;
  locale: Locale;
}

export function Header({ currentPath, locale }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const t = getTranslations(locale);

  useEffect(() => {
    setMobileOpen(false);
    setToolsOpen(false);
  }, [currentPath]);

  const href = (path: string) => localizeHref(path, locale);
  // Trust pages exist only in English (no /es/about etc.), so never locale-prefix them.
  const trustHref = (path: string) => path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-sand-50/90 dark:bg-sand-950/90 backdrop-blur-md border-b border-sand-200 dark:border-sand-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href={href('/')} aria-label="SerpCraft home" className="flex items-center gap-2.5 flex-none">
              <div className="w-8 h-8 rounded-lg bg-choco-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M5 8h14M5 13h10M5 18h7" />
                </svg>
              </div>
              <span className="text-lg font-serif font-semibold text-ink dark:text-sand-50 tracking-tight">SerpCraft</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <a
                href={href('/studio')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPath === '/studio' ? 'text-choco-600 dark:text-choco-400' : 'text-ink-soft dark:text-sand-300 hover:text-ink dark:hover:text-sand-50 hover:bg-sand-100 dark:hover:bg-sand-800'
                }`}
              >
                {t.navStudio}
              </a>

              {/* SEO Dropdown */}
              <div
                className="relative group"
              >
                <button
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    ['/seo-check', '/url-debugger', '/hreflang-generator', '/robots-txt-generator', '/release-diff', '/serp-preview-tool', '/social-meta', '/og-image-checker', '/social-preview-tool'].includes(currentPath)
                      ? 'text-choco-600 dark:text-choco-400'
                      : 'text-ink-soft dark:text-sand-300 hover:text-ink dark:hover:text-sand-50 group-hover:bg-sand-100 dark:group-hover:bg-sand-800'
                  }`}
                >
                  SEO
                  <svg className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 pt-1 w-[480px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="rounded-xl border border-sand-200 dark:border-sand-700 bg-white dark:bg-sand-900 shadow-lift p-2 grid grid-cols-2 gap-1">
                    {navTools.filter(t => ['/seo-check', '/url-debugger', '/hreflang-generator', '/robots-txt-generator', '/release-diff', '/serp-preview-tool', '/social-meta', '/og-image-checker', '/social-preview-tool'].includes(t.path)).map((tool) => (
                      <a
                        key={tool.path}
                        href={href(tool.path)}
                        className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg text-left hover:bg-sand-50 dark:hover:bg-sand-800 transition-colors"
                      >
                        <span className="text-sm font-medium text-ink dark:text-sand-100">{tool.shortLabel}</span>
                        <span className="text-xs text-ink-muted dark:text-sand-400">{tool.description}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* AEO Dropdown */}
              <div
                className="relative group"
              >
                <button
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    ['/schema-markup-generator', '/json-ld', '/visual-seo-studio'].includes(currentPath)
                      ? 'text-choco-600 dark:text-choco-400'
                      : 'text-ink-soft dark:text-sand-300 hover:text-ink dark:hover:text-sand-50 group-hover:bg-sand-100 dark:group-hover:bg-sand-800'
                  }`}
                >
                  AEO
                  <svg className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 pt-1 w-[260px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="rounded-xl border border-sand-200 dark:border-sand-700 bg-white dark:bg-sand-900 shadow-lift p-2 flex flex-col gap-1">
                    {navTools.filter(t => ['/schema-markup-generator', '/json-ld', '/visual-seo-studio'].includes(t.path)).map((tool) => (
                      <a
                        key={tool.path}
                        href={href(tool.path)}
                        className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg text-left hover:bg-sand-50 dark:hover:bg-sand-800 transition-colors"
                      >
                        <span className="text-sm font-medium text-ink dark:text-sand-100">{tool.shortLabel}</span>
                        <span className="text-xs text-ink-muted dark:text-sand-400">{tool.description}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* GEO Dropdown */}
              <div
                className="relative group"
              >
                <button
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    ['/llms-txt-generator'].includes(currentPath)
                      ? 'text-choco-600 dark:text-choco-400'
                      : 'text-ink-soft dark:text-sand-300 hover:text-ink dark:hover:text-sand-50 group-hover:bg-sand-100 dark:group-hover:bg-sand-800'
                  }`}
                >
                  GEO
                  <svg className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 pt-1 w-[260px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="rounded-xl border border-sand-200 dark:border-sand-700 bg-white dark:bg-sand-900 shadow-lift p-2 flex flex-col gap-1">
                    {navTools.filter(t => ['/llms-txt-generator', '/url-debugger'].includes(t.path)).map((tool) => (
                      <a
                        key={tool.path}
                        href={href(tool.path)}
                        className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg text-left hover:bg-sand-50 dark:hover:bg-sand-800 transition-colors"
                      >
                        <span className="text-sm font-medium text-ink dark:text-sand-100">{tool.shortLabel}</span>
                        <span className="text-xs text-ink-muted dark:text-sand-400">{tool.description}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={trustHref('/about')}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPath === '/about' ? 'text-choco-600 dark:text-choco-400' : 'text-ink-soft dark:text-sand-300 hover:text-ink dark:hover:text-sand-50 hover:bg-sand-100 dark:hover:bg-sand-800'
                }`}
              >
                {t.navAbout}
              </a>
            </nav>

            {/* Right: theme + language + mobile menu */}
            <div className="flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-1">
                <LanguageSwitcher currentLocale={locale} />
                <ThemeToggle />
              </div>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-md text-ink-soft dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-sand-50 dark:bg-sand-950 animate-fade-in overflow-auto">
          <div className="flex items-center justify-between h-16 px-4 border-b border-sand-200 dark:border-sand-800">
            <span className="text-lg font-serif font-semibold text-ink dark:text-sand-50">Menu</span>
            <div className="flex items-center gap-1">
              <LanguageSwitcher currentLocale={locale} />
              <ThemeToggle />
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X size={22} className="text-ink-soft dark:text-sand-300" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-1">
            <MobileLink label={t.navStudio} href={href('/studio')} active={currentPath === '/studio'} />
            <div className="py-2 px-3 text-xs font-semibold text-ink-muted dark:text-sand-500 uppercase tracking-wide mt-2">SEO Tools</div>
            {navTools.filter(t => ['/seo-check', '/url-debugger', '/hreflang-generator', '/robots-txt-generator', '/release-diff', '/serp-preview-tool', '/social-meta', '/og-image-checker', '/social-preview-tool'].includes(t.path)).map((tool) => (
              <MobileLink
                key={tool.path}
                label={tool.label}
                sublabel={tool.description}
                href={href(tool.path)}
                active={currentPath === tool.path}
              />
            ))}

            <div className="py-2 px-3 text-xs font-semibold text-ink-muted dark:text-sand-500 uppercase tracking-wide mt-4">AEO Tools</div>
            {navTools.filter(t => ['/schema-markup-generator', '/json-ld', '/visual-seo-studio'].includes(t.path)).map((tool) => (
              <MobileLink
                key={tool.path}
                label={tool.label}
                sublabel={tool.description}
                href={href(tool.path)}
                active={currentPath === tool.path}
              />
            ))}

            <div className="py-2 px-3 text-xs font-semibold text-ink-muted dark:text-sand-500 uppercase tracking-wide mt-4">GEO Tools</div>
            {navTools.filter(t => ['/llms-txt-generator', '/url-debugger'].includes(t.path)).map((tool) => (
              <MobileLink
                key={tool.path}
                label={tool.label}
                sublabel={tool.description}
                href={href(tool.path)}
                active={currentPath === tool.path}
              />
            ))}
            <div className="py-2 px-3 text-xs font-semibold text-ink-muted dark:text-sand-500 uppercase tracking-wide mt-4">Info</div>
            <MobileLink label={t.footerAbout} href={trustHref('/about')} active={currentPath === '/about'} />
            <MobileLink label={t.footerPrivacy} href={href('/privacy')} active={currentPath === '/privacy'} />
            <MobileLink label={t.footerTerms} href={href('/terms')} active={currentPath === '/terms'} />

            {/* Language selector for mobile */}
            <div className="py-2 px-3 text-xs font-semibold text-ink-muted dark:text-sand-500 uppercase tracking-wide mt-4">{t.language}</div>
            <div className="grid grid-cols-3 gap-2 px-1">
              {locales.map((l) => (
                <a
                  key={l.code}
                  href={localizeHref(currentPath, l.code)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    l.code === locale
                      ? 'bg-choco-50 dark:bg-choco-900/30 text-choco-600 dark:text-choco-400 font-medium'
                      : 'text-ink-soft dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800'
                  }`}
                >
                  {l.nativeName}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MobileLink({
  label,
  sublabel,
  href,
  active,
}: {
  label: string;
  sublabel?: string;
  href: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
        active ? 'bg-choco-50 dark:bg-choco-900/30 text-choco-700 dark:text-choco-300' : 'text-ink-soft dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-800'
      }`}
    >
      <div>
        <div className="text-sm font-medium">{label}</div>
        {sublabel && <div className="text-xs text-ink-muted dark:text-sand-500">{sublabel}</div>}
      </div>
      <ChevronRight size={16} className="text-ink-muted dark:text-sand-500" />
    </a>
  );
}
