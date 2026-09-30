import { createTheme } from '@mui/material/styles';

const shared = {
  accent: '#E50914',
  gold: '#F5B301',
  fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
};

const shape = {
  borderRadius: 6,
};

const typography = {
  fontFamily: shared.fontFamily,
  h1: { fontSize: '2.75rem', fontWeight: 700, lineHeight: 1.2 },
  h2: { fontSize: '2.375rem', fontWeight: 700, lineHeight: 1.25 },
  h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
  h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none',
  },
};

const getComponents = (mode, colors) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: colors.background,
        color: colors.textPrimary,
      },
      '*:focus-visible': {
        outline: `2px solid ${shared.accent}`,
        outlineOffset: '2px',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        textTransform: 'none',
        fontWeight: 600,
      },
      containedPrimary: {
        backgroundColor: shared.accent,
        '&:hover': {
          backgroundColor: '#C50710',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 999,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: 'none',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 6,
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor:
          mode === 'dark' ? 'rgba(11, 11, 13, 0.85)' : 'rgba(246, 246, 247, 0.85)',
        backdropFilter: 'blur(12px)',
        boxShadow: 'none',
        borderBottom: `1px solid ${colors.border}`,
      },
    },
  },
});

const darkColors = {
  background: '#0B0B0D',
  surface: '#17171A',
  raisedSurface: '#222227',
  border: '#2A2A30',
  textPrimary: '#F5F5F5',
  textMuted: '#9A9AA2',
};

const lightColors = {
  background: '#F6F6F7',
  surface: '#FFFFFF',
  raisedSurface: '#ECECEE',
  border: '#E2E2E5',
  textPrimary: '#111111',
  textMuted: '#666666',
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: shared.accent },
    secondary: { main: shared.gold },
    background: {
      default: darkColors.background,
      paper: darkColors.surface,
    },
    text: {
      primary: darkColors.textPrimary,
      secondary: darkColors.textMuted,
    },
    error: { main: shared.accent },
    custom: {
      raisedSurface: darkColors.raisedSurface,
      border: darkColors.border,
      accent: shared.accent,
      gold: shared.gold,
    },
  },
  typography,
  shape,
  components: getComponents('dark', darkColors),
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: shared.accent },
    secondary: { main: shared.gold },
    background: {
      default: lightColors.background,
      paper: lightColors.surface,
    },
    text: {
      primary: lightColors.textPrimary,
      secondary: lightColors.textMuted,
    },
    error: { main: shared.accent },
    custom: {
      raisedSurface: lightColors.raisedSurface,
      border: lightColors.border,
      accent: shared.accent,
      gold: shared.gold,
    },
  },
  typography,
  shape,
  components: getComponents('light', lightColors),
});
