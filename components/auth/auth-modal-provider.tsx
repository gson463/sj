'use client'

import * as React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AuthModalShell } from '@/components/auth/auth-modal-shell'

type AuthMode = 'login' | 'signup'

type AuthModalContextValue = {
  openLogin: () => void
  openSignUp: () => void
  close: () => void
}

const AuthModalContext = React.createContext<AuthModalContextValue | null>(null)

/** Safe no-ops if used outside provider (e.g. tests). */
export function useAuthModal(): AuthModalContextValue {
  const ctx = React.useContext(AuthModalContext)
  return (
    ctx ?? {
      openLogin: () => {},
      openSignUp: () => {},
      close: () => {},
    }
  )
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<AuthMode>('login')

  const openLogin = React.useCallback(() => {
    setMode('login')
    setOpen(true)
  }, [])

  const openSignUp = React.useCallback(() => {
    setMode('signup')
    setOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setOpen(false)
  }, [])

  const value = React.useMemo(
    () => ({ openLogin, openSignUp, close }),
    [openLogin, openSignUp, close],
  )

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="max-h-[min(92vh,720px)] gap-0 overflow-hidden border-sky-200/70 p-0 sm:max-w-[min(96vw,880px)] lg:max-w-4xl"
        >
          <AuthModalShell
            mode={mode}
            onModeChange={setMode}
            onSuccess={close}
          />
        </DialogContent>
      </Dialog>
    </AuthModalContext.Provider>
  )
}
