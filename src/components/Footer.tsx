import { navTools } from '@/data/pages';
import { localizeHref, useRouter } from '@/lib/router';
import { getTranslations } from '@/lib/translations';

export function Footer() {
  const { locale } = useRouter();
  const t = getTranslations(locale);
  const href = (path: string) => localizeHref(path, locale);
  // Trust pages exist only in English (no /es/about etc.), so never locale-prefix them.
  const trustHref = (path: string) => path;

  return (
    <footer className="border-t border-sand-200 dark:border-sand-800 bg-sand-100/50 dark:bg-sand-900/30 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-choco-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M5 8h14M5 13h10M5 18h7" />
                </svg>
              </div>
              <span className="font-serif font-semibold text-ink dark:text-sand-50">SerpCraft</span>
            </div>
            <p className="text-sm text-ink-muted dark:text-sand-400 leading-relaxed">
              The all-in-one SEO meta tag, social preview, and structured data studio. Free, no signup.
            </p>
          </div>

          {/* Tools column 1 */}
          <div>
            <h4 className="text-xs font-semibold text-ink dark:text-sand-200 uppercase tracking-wide mb-3">{t.footerTools}</h4>
            <ul className="space-y-2">
              {navTools.slice(0, 4).map((tool) => (
                <li key={tool.path}>
                  <a href={href(tool.path)} className="text-sm text-ink-muted dark:text-sand-400 hover:text-choco-600 dark:hover:text-choco-400 transition-colors">
                    {tool.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools column 2 */}
          <div>
            <h4 className="text-xs font-semibold text-ink dark:text-sand-200 uppercase tracking-wide mb-3">{t.footerTools}</h4>
            <ul className="space-y-2">
              {navTools.slice(4).map((tool) => (
                <li key={tool.path}>
                  <a href={href(tool.path)} className="text-sm text-ink-muted dark:text-sand-400 hover:text-choco-600 dark:hover:text-choco-400 transition-colors">
                    {tool.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold text-ink dark:text-sand-200 uppercase tracking-wide mb-3">{t.footerCompany}</h4>
            <ul className="space-y-2">
              <li><a href={trustHref('/about')} className="text-sm text-ink-muted dark:text-sand-400 hover:text-choco-600 dark:hover:text-choco-400 transition-colors">{t.footerAbout}</a></li>
              <li><a href={trustHref('/privacy')} className="text-sm text-ink-muted dark:text-sand-400 hover:text-choco-600 dark:hover:text-choco-400 transition-colors">{t.footerPrivacy}</a></li>
              <li><a href={trustHref('/terms')} className="text-sm text-ink-muted dark:text-sand-400 hover:text-choco-600 dark:hover:text-choco-400 transition-colors">{t.footerTerms}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-sand-200 dark:border-sand-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-muted dark:text-sand-500">
            &copy; {new Date().getFullYear()} SerpCraft. {t.footerRights}
          </p>
          <p className="text-xs text-ink-muted dark:text-sand-500">
            All data stays in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
