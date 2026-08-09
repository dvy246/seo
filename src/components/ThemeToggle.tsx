import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-sand-100 dark:text-sand-300 dark:hover:bg-sand-800 transition-colors"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon size={18} className="transition-transform hover:rotate-12" />
      ) : (
        <Sun size={18} className="transition-transform hover:rotate-12" />
      )}
    </button>
  );
}
