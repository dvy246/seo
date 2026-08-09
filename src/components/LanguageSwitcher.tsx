import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { locales, type Locale } from '@/lib/i18n';
import { navigateToLocale } from '@/lib/router';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = locales.find((l) => l.code === currentLocale) || locales[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 w-9 h-9 rounded-lg justify-center text-ink-soft hover:bg-sand-100 dark:text-sand-300 dark:hover:bg-sand-800 transition-colors"
        aria-label="Change language"
        title="Change language"
      >
        <Globe size={18} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-sand-200 bg-white shadow-lift py-1.5 z-50 animate-fade-in dark:border-sand-700 dark:bg-sand-900">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                navigateToLocale(l.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors ${
                l.code === currentLocale
                  ? 'text-choco-600 dark:text-choco-400 bg-choco-50 dark:bg-choco-900/30'
                  : 'text-ink-soft hover:bg-sand-50 dark:text-sand-300 dark:hover:bg-sand-800'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono font-semibold w-5 text-center text-ink-muted dark:text-sand-500">{l.flag}</span>
                {l.nativeName}
              </span>
              {l.code === currentLocale && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
