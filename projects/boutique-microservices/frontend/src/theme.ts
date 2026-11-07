import { createTheme } from '@mui/material/styles';

/**
 * FLOWSTACK STORE THEME
 * Minimal light e-commerce theme — neutral, clean, demo-friendly.
 */

export const flowstack = {
  ink: '#111827',
  muted: '#6B7280',
  paper: '#FFFFFF',
  background: '#F9FAFB',
  border: '#E5E7EB',
  primary: '#111827',
  accent: '#2563EB',
} as const;

const fontStack = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Inter"',
  '"Helvetica Neue"',
  'Helvetica',
  'Arial',
  'sans-serif',
].join(',');

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: flowstack.primary,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: flowstack.accent,
      contrastText: '#FFFFFF',
    },
    background: {
      default: flowstack.background,
      paper: flowstack.paper,
    },
    text: {
      primary: flowstack.ink,
      secondary: flowstack.muted,
    },
    divider: flowstack.border,
  },

  shape: { borderRadius: 10 },

  typography: {
    fontFamily: fontStack,
    h1: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, fontSize: '1.25rem' },
    button: { fontWeight: 600, fontSize: '0.875rem', textTransform: 'none' },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: flowstack.background,
          color: flowstack.ink,
          fontFamily: fontStack,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, padding: '0.55rem 1.25rem', textTransform: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: flowstack.ink,
          borderBottom: '1px solid #E5E7EB',
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
