import { createTheme } from '@mui/material/styles';

// --- Design tokens (v2 — "modern") ---
// Crisp near-white canvas, near-black ink for high-contrast readability,
// a single confident indigo→cyan gradient accent for CTAs and hero moments.
// One typeface family (Plus Jakarta Sans) used everywhere — bold, geometric,
// contemporary SaaS/travel feel — instead of the old serif/sans pairing.
export const tokens = {
  ink: '#0F172A',
  inkSoft: '#1E293B',
  slate: '#64748B',
  slateLight: '#94A3B8',
  canvas: '#F8FAFC',
  paper: '#FFFFFF',
  border: '#E2E8F0',
  indigo: '#4F46E5',
  indigoDark: '#4338CA',
  cyan: '#06B6D4',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  gradient: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: tokens.ink, light: tokens.inkSoft, contrastText: '#FFFFFF' },
    secondary: { main: tokens.indigo, dark: tokens.indigoDark, contrastText: '#FFFFFF' },
    success: { main: tokens.success },
    warning: { main: tokens.warning },
    error: { main: tokens.danger },
    background: { default: tokens.canvas, paper: tokens.paper },
    text: { primary: tokens.ink, secondary: tokens.slate },
    divider: tokens.border,
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.015em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingLeft: 22,
          paddingRight: 22,
          paddingTop: 10,
          paddingBottom: 10,
        },
        containedSecondary: {
          backgroundImage: tokens.gradient,
          boxShadow: '0 8px 20px -6px rgba(79,70,229,0.5)',
          '&:hover': { boxShadow: '0 10px 24px -6px rgba(79,70,229,0.65)', backgroundImage: tokens.gradient },
        },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
      },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 999, fontWeight: 600 } } },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: `1px solid ${tokens.border}`,
          boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
          transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease, border-color 220ms ease',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 12 },
        },
      },
    },
  },
});

export default theme;
