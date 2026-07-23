import { createTheme } from '@mui/material/styles';

// --- Design tokens ---
// Deep pine green primary (calm, natural, works for both mountain chalets and
// coastal hotels), warm apricot accent for CTAs, soft cream canvas. Fraunces
// (warm editorial serif) for hero/display headings, Inter for UI & body.
export const tokens = {
  pine: '#1F3A34',
  pineLight: '#2E534A',
  apricot: '#E8935B',
  apricotDark: '#D67A3E',
  canvas: '#FBF8F3',
  paper: '#FFFFFF',
  sand: '#F1E9DC',
  ink: '#26302E',
  slate: '#6B7674',
  border: '#E8E2D6',
  success: '#3C8B5F',
  danger: '#C1443C',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.pine, light: tokens.pineLight, contrastText: '#FFFFFF' },
    secondary: { main: tokens.apricot, dark: tokens.apricotDark, contrastText: '#1B1B1B' },
    success: { main: tokens.success },
    error: { main: tokens.danger },
    background: { default: tokens.canvas, paper: tokens.paper },
    text: { primary: tokens.ink, secondary: tokens.slate },
    divider: tokens.border,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", -apple-system, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingLeft: 20, paddingRight: 20 },
        containedSecondary: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 999, fontWeight: 600 } } },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${tokens.border}`,
          boxShadow: 'none',
          transition: 'transform 180ms ease, box-shadow 180ms ease',
        },
      },
    },
  },
});

export default theme;
