'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
} from 'next-themes'
import { MuiRegistry } from '@/components/mui-registry'
import { AuthModalProvider } from '@/components/auth/auth-modal-provider'
import { Toaster } from '@/components/ui/sonner'

/** Mandhari ya mwanga pekee — hakuna hali ya giza (dark) kwenye UI. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="light"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <MuiRegistry>
        <AuthModalProvider>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </AuthModalProvider>
      </MuiRegistry>
    </NextThemesProvider>
  )
}
