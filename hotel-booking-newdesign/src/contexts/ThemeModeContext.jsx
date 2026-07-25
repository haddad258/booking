import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import theme, { tokens } from '../styles/theme';

const ThemeModeContext = createContext(null);

function buildDarkTheme() {
  return createTheme({
    ...theme,
    palette: {
      mode: 'dark',
      primary: { main: '#E2E8F0', contrastText: '#0F172A' },
      secondary: { main: tokens.indigo, dark: tokens.indigoDark, contrastText: '#FFFFFF' },
      success: { main: tokens.success },
      warning: { main: tokens.warning },
      error: { main: tokens.danger },
      background: { default: '#0B1120', paper: '#111827' },
      text: { primary: '#F1F5F9', secondary: '#94A3B8' },
      divider: '#1E293B',
    },
  });
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('site_theme_mode') || 'light');

  useEffect(() => {
    localStorage.setItem('site_theme_mode', mode);
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));
  const activeTheme = useMemo(() => (mode === 'dark' ? buildDarkTheme() : theme), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
