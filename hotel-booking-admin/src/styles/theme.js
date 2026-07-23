import { createTheme } from '@mui/material/styles';

// --- Design tokens ---
// Ink navy sidebar/surfaces, warm brass accent (evokes a hotel key-card / brass
// fixture), warm paper canvas. Space Grotesk for display headings (distinctive,
// geometric), Inter for UI body copy, IBM Plex Mono for data/codes (booking
// numbers, prices, invoice refs) to reinforce an "operational ledger" feel.
export const tokens = {
  ink: '#1B2430',
  inkLight: '#2A3648',
  brass: '#B8863B',
  brassLight: '#D6AD6B',
  canvas: '#F5F3EF',
  paper: '#FFFFFF',
  slate: '#8A94A6',
  slateDark: '#5B6472',
  success: '#2F8F5B',
  warning: '#C97A2B',
  danger: '#C1443C',
  border: '#E4E1D9',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.ink, light: tokens.inkLight, contrastText: '#FFFFFF' },
    secondary: { main: tokens.brass, light: tokens.brassLight, contrastText: '#1B2430' },
    success: { main: tokens.success },
    warning: { main: tokens.warning },
    error: { main: tokens.danger },
    background: { default: tokens.canvas, paper: tokens.paper },
    text: { primary: tokens.ink, secondary: tokens.slateDark },
    divider: tokens.border,
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Inter", -apple-system, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: `1px solid ${tokens.border}` },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6 },
        containedPrimary: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none', borderBottom: `1px solid ${tokens.border}` },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: tokens.slateDark },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default theme;
