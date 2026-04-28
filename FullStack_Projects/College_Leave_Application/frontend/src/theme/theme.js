import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: '#1e40af',
            light: '#3b82f6',
            dark: '#1e3a8a',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#000000',
          },
          success: {
            main: '#059669',
            light: '#10b981',
            dark: '#047857',
          },
          warning: {
            main: '#d97706',
            light: '#f59e0b',
            dark: '#b45309',
          },
          error: {
            main: '#dc2626',
            light: '#ef4444',
            dark: '#b91c1c',
          },
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
          },
          text: {
            primary: '#1f2937',
            secondary: '#6b7280',
            disabled: '#9ca3af',
          },
          divider: '#e5e7eb',
          grey: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#fbbf24',
            light: '#fcd34d',
            dark: '#f59e0b',
            contrastText: '#000000',
          },
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
          },
          background: {
            default: '#0f172a',
            paper: '#1e293b',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            disabled: '#64748b',
          },
          divider: '#334155',
          grey: {
            50: '#0f172a',
            100: '#1e293b',
            200: '#334155',
            300: '#475569',
            400: '#64748b',
            500: '#94a3b8',
            600: '#cbd5e1',
            700: '#e2e8f0',
            800: '#f1f5f9',
            900: '#f8fafc',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: '2rem' },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 500, fontSize: '1.125rem' },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 500, fontSize: '1rem' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
export default createAppTheme;
