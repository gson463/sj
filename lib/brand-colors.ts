/**
 * SIMU JIJI brand palette — keep in sync with `app/globals.css` (`--brand-blue`, `--brand-red`).
 */
export const brand = {
  blue: '#1a539b',
  blueDark: '#143f75',
  blueLight: '#2d6bb8',
  /** Sky / highlight tint (flyer backgrounds) */
  sky: '#e8f0fa',
  red: '#e31e24',
  redDark: '#b81820',
  white: '#ffffff',
} as const

/** MUI dark mode: blues lifted for contrast; still reads as brand royal blue family */
export const brandDark = {
  primary: '#7eb0f0',
  primaryLight: '#a8c9f8',
  primaryDark: '#4d84c9',
  secondary: '#94b8e8',
  background: '#0f1419',
  paper: '#1a2228',
  /** Softer red on dark surfaces */
  error: '#f0666e',
} as const
