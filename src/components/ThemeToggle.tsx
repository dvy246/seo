import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center w-[76px] h-9 rounded-full border border-sand-200 dark:border-sand-700 bg-sand-100 dark:bg-sand-800 transition-colors px-1.5 focus-visible:ring-2 focus-visible:ring-choco-500/50"
    >
      <Sun
        size={14}
        aria-hidden
        className={`absolute left-3 transition-colors ${isDark ? 'text-sand-500' : 'text-terra-500'}`}
      />
      <Moon
        size={14}
        aria-hidden
        className={`absolute right-3 transition-colors ${isDark ? 'text-sand-100' : 'text-sand-400'}`}
      />
      <span
        aria-hidden
        className={`flex items-center justify-center h-6 w-6 rounded-full bg-white dark:bg-sand-900 shadow-sm ring-1 ring-black/5 transition-transform duration-300 ease-smooth ${
          isDark ? 'translate-x-[40px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
