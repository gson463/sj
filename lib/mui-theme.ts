import { createTheme, alpha } from '@mui/material/styles'
import { brand } from '@/lib/brand-colors'

/** MUI theme aligned with SIMU JIJI (`globals.css` + brand). */
export const muiTheme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: brand.blue,
      dark: brand.blueDark,
      light: brand.blueLight,
      contrastText: brand.white,
    },
    secondary: {
      main: brand.blueLight,
      light: '#5a8fc8',
      dark: brand.blueDark,
      contrastText: brand.white,
    },
    error: {
      main: brand.red,
      dark: brand.redDark,
      contrastText: brand.white,
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: brand.blue,
          '&:hover': {
            backgroundColor: brand.blueDark,
          },
        },
        outlinedPrimary: {
          borderColor: brand.blue,
          color: brand.blue,
          '&:hover': {
            borderColor: brand.blueDark,
            backgroundColor: alpha(brand.blue, 0.08),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
        },
      },
    },
  },
})
