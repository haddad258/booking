import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Smooth icon-crossfade theme switcher. The actual color transition across
 * the app is handled globally in index.css; this just flips the `.dark`
 * class via ThemeContext and animates its own icon swap.
 */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle dark mode"
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-ink transition hover:bg-brand-50 dark:text-white dark:hover:bg-white/10 ${className}`}
    >
      <SunIcon
        className={`absolute h-5 w-5 transition-all duration-300 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
      />
      <MoonIcon
        className={`absolute h-5 w-5 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
      />
    </button>
  );
}
