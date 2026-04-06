'use client'

import * as React from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { muiTheme } from '@/lib/mui-theme'

/**
 * MUI + Emotion for Next.js App Router. `enableCssLayer` keeps MUI in `@layer mui`
 * so Tailwind utilities can override when needed.
 * Mandhari ya mwanga pekee (inalingana na `forcedTheme="light"` kwenye providers).
 */
export function MuiRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
