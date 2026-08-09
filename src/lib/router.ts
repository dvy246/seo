import { useEffect, useState, useCallback } from 'react';
import { extractLocale, withLocale, type Locale, defaultLocale } from './i18n';

// Router that supports locale-prefixed paths: /en/studio, /es/studio, etc.
// The path returned to components is always WITHOUT the locale prefix,
// so components don't need to know about i18n routing.
// The locale is exposed separately.

export function useRouter() {
  const [rawPath, setRawPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const onPop = () => setRawPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    // Keep the current locale when navigating (unless `to` already has a locale)
    const currentLocale = extractLocale(rawPath).locale;
    const { locale: targetLocale } = extractLocale(to);
    const finalPath = targetLocale === defaultLocale && to.split('/').filter(Boolean)[0] !== defaultLocale
      ? withLocale(currentLocale, to)
      : to;
    if (finalPath === window.location.pathname) return;
    window.history.pushState({}, '', finalPath);
    setRawPath(finalPath);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [rawPath]);

  const { locale, pathWithoutLocale: path } = extractLocale(rawPath);

  return { path, locale, navigate };
}

export function navigateTo(to: string) {
  // Preserve current locale on programmatic navigation
  const currentRaw = window.location.pathname || '/';
  const currentLocale = extractLocale(currentRaw).locale;
  const { locale: targetLocale } = extractLocale(to);
  const finalPath = targetLocale === defaultLocale && to.split('/').filter(Boolean)[0] !== defaultLocale
    ? withLocale(currentLocale, to)
    : to;
  window.history.pushState({}, '', finalPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export function navigateToLocale(locale: Locale) {
  const currentRaw = window.location.pathname || '/';
  const { pathWithoutLocale } = extractLocale(currentRaw);
  const newPath = withLocale(locale, pathWithoutLocale);
  if (newPath === currentRaw) return;
  window.history.pushState({}, '', newPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}
