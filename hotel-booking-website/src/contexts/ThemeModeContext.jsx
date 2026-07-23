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
      primary: { main: tokens.apricot, contrastText: '#1B1B1B' },
      secondary: { main: tokens.apricot, contrastText: '#1B1B1B' },
      success: { main: tokens.success },
      error: { main: tokens.danger },
      background: { default: '#171F1D', paper: '#1E2826' },
      text: { primary: '#F3EFE6', secondary: '#A9B3B0' },
      divider: '#2C3735',
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
