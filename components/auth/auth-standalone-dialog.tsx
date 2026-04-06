'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AuthModalShell } from '@/components/auth/auth-modal-shell'

type AuthStandaloneDialogProps = {
  mode: 'login' | 'signup'
  /** Post-login redirect (e.g. `/checkout?...`) */
  redirectTo?: string | null
}

/**
 * Full-page auth routes (`/auth/login`, `/auth/sign-up`) render only this dialog
 * so auth matches the in-app modal experience (including CMS side ad).
 */
export function AuthStandaloneDialog({ mode, redirectTo }: AuthStandaloneDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(true)
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>(mode)

  React.useEffect(() => {
    setAuthMode(mode)
  }, [mode])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      router.push('/')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[min(92vh,720px)] gap-0 overflow-hidden border-sky-200/70 p-0 sm:max-w-[min(96vw,880px)] lg:max-w-4xl"
      >
        <AuthModalShell
          mode={authMode}
          onModeChange={setAuthMode}
          onSuccess={() => setOpen(false)}
          redirectTo={redirectTo}
        />
      </DialogContent>
    </Dialog>
  )
}
