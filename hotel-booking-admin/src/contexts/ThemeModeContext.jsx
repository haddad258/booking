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
      primary: { main: tokens.brass, contrastText: '#14181F' },
      secondary: { main: tokens.brassLight, contrastText: '#14181F' },
      success: { main: tokens.success },
      warning: { main: tokens.warning },
      error: { main: tokens.danger },
      background: { default: '#14181F', paper: '#1C222D' },
      text: { primary: '#F1EFE9', secondary: '#A7AEBB' },
      divider: '#2B3341',
    },
  });
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme_mode') || 'light');

  useEffect(() => {
    localStorage.setItem('theme_mode', mode);
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
