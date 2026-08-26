import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'theme';

function getPreferredTheme() {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getPreferredTheme);

  // Apply on mount + whenever it changes; the very first application happens
  // synchronously before paint via the inline script in index.html, this is
  // just here to keep React state and the DOM in sync afterwards.
  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Follow the OS theme unless the user has explicitly chosen one.
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mql) return;
    const onChange = (e) => {
      if (!window.localStorage.getItem(STORAGE_KEY + ':explicit')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  const setThemeExplicit = useCallback((next) => {
    window.localStorage.setItem(STORAGE_KEY + ':explicit', '1');
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';

    // Use the View Transitions API for a smooth cross-fade when available;
    // falls back to the plain CSS transition defined in index.css otherwise.
    if (document.startViewTransition) {
      document.documentElement.style.viewTransitionName = 'theme-root';
      document.startViewTransition(() => setThemeExplicit(next));
    } else {
      setThemeExplicit(next);
    }
  }, [theme, setThemeExplicit]);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme: setThemeExplicit }), [theme, toggleTheme, setThemeExplicit]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
