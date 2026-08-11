// Internationalization system for SerpCraft.
// Uses URL path prefixes: /en/, /es/, /fr/, /de/, etc.
// Falls back to no-prefix (English) for backward compatibility.

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja';

export interface LocaleConfig {
  code: Locale;
  label: string;
  flag: string;
  nativeName: string;
}

export const locales: LocaleConfig[] = [
  { code: 'en', label: 'English', flag: 'EN', nativeName: 'English' },
  { code: 'es', label: 'Spanish', flag: 'ES', nativeName: 'Español' },
  { code: 'fr', label: 'French', flag: 'FR', nativeName: 'Français' },
  { code: 'de', label: 'German', flag: 'DE', nativeName: 'Deutsch' },
  { code: 'pt', label: 'Portuguese', flag: 'PT', nativeName: 'Português' },
  { code: 'ja', label: 'Japanese', flag: 'JA', nativeName: '日本語' },
];

export const defaultLocale: Locale = 'en';

// Extract locale from a path like "/es/studio" -> "es"
// Returns 'en' if no locale prefix is present.
export function extractLocale(path: string): { locale: Locale; pathWithoutLocale: string } {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0) {
    const first = segments[0] as Locale;
    if (locales.some((l) => l.code === first)) {
      const rest = '/' + segments.slice(1).join('/');
      return { locale: first, pathWithoutLocale: rest === '/' ? '/' : rest };
    }
  }
  return { locale: defaultLocale, pathWithoutLocale: path };
}

// Prepend a locale prefix to a path (unless it's the default locale).
export function withLocale(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path === '/' ? '' : path}`;
}

// Translate a path to a different locale.
export function translatePath(path: string, targetLocale: Locale): string {
  const { pathWithoutLocale } = extractLocale(path);
  return withLocale(targetLocale, pathWithoutLocale);
}
