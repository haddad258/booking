import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className={[
        'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border',
        'bg-hover transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300',
        className,
      ].join(' ')}
    >
      <span
        className={[
          'absolute inset-y-0.5 flex h-7 w-7 items-center justify-center rounded-full',
          'bg-gradient-to-br from-brand-600 to-brand-800 shadow-md transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)]',
          isDark ? 'left-[calc(100%-1.875rem)] from-gold-400 to-gold-500' : 'left-0.5',
        ].join(' ')}
      >
        <SunIcon
          className={[
            'absolute h-4 w-4 text-brand-900 transition-all duration-300',
            isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
          ].join(' ')}
        />
        <MoonIcon
          className={[
            'absolute h-4 w-4 text-white transition-all duration-300',
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0',
          ].join(' ')}
        />
      </span>
    </button>
  );
}
