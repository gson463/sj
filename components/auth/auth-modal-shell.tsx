'use client'

import Image from 'next/image'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoginForm } from '@/components/auth/login-form'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { useLanguage } from '@/lib/i18n/language-context'
import { useAuthModalCms, type AuthModalCmsPayload } from '@/hooks/use-auth-modal-cms'
import { cn } from '@/lib/utils'

function AuthModalSidePanel({ cms }: { cms: AuthModalCmsPayload | null }) {
  const url = cms?.auth_modal_ad_image_url?.trim() || ''
  const link = cms?.auth_modal_ad_link_url?.trim() || ''
  const alt = cms?.auth_modal_ad_alt?.trim() || 'Promotion'

  return (
    <div
      className={cn(
        'relative min-h-[168px] w-full overflow-hidden bg-muted lg:min-h-0',
        'border-b border-sky-100/80 lg:border-b-0 lg:border-r',
      )}
    >
      <div className="relative aspect-5/4 w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:min-h-[min(90vh,600px)]">
        {url ? (
          <>
            <Image
              src={url}
              alt={alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 420px, 100vw"
              priority
            />
            {link && (link.startsWith('http://') || link.startsWith('https://')) && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-1 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="sr-only">{alt}</span>
              </a>
            )}
          </>
        ) : (
          <div className="flex h-full min-h-[168px] flex-col items-center justify-center bg-linear-to-br from-primary via-sky-700 to-primary/90 p-6 text-center text-primary-foreground">
            <p className="text-lg font-bold tracking-tight">SIMU JIJI</p>
            <p className="mt-2 max-w-56 text-xs leading-relaxed text-primary-foreground/85">
              Admin → CMS: upload the “Login & sign-up modal” banner there (direct upload — no paste required).
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

type AuthModalShellProps = {
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
  onSuccess: () => void
  /** Only used on `/auth/login` with `?redirect=` */
  redirectTo?: string | null
}

export function AuthModalShell({
  mode,
  onModeChange,
  onSuccess,
  redirectTo,
}: AuthModalShellProps) {
  const { t } = useLanguage()
  const { data: cms } = useAuthModalCms()

  return (
    <div className="grid min-h-0 w-full gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <AuthModalSidePanel cms={cms} />

      <div className="flex min-h-0 min-w-0 flex-col overflow-y-auto bg-linear-to-b from-sky-50/80 via-background to-background">
        <div className="border-b border-sky-100/80 bg-sky-100/40 px-6 py-4">
          <DialogHeader className="gap-1 text-left sm:text-left">
            <DialogTitle className="text-xl">
              {mode === 'login' ? t('auth.welcomeBack') : t('auth.signup')}
            </DialogTitle>
            <DialogDescription>
              {mode === 'login' ? t('auth.loginToContinue') : t('auth.signupDescription')}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 py-5">
          {mode === 'login' ? (
            <LoginForm
              variant="modal"
              redirectTo={redirectTo ?? undefined}
              onSuccess={onSuccess}
              onRequestSignUp={() => onModeChange('signup')}
            />
          ) : (
            <SignUpForm
              variant="modal"
              onSuccess={onSuccess}
              onRequestLogin={() => onModeChange('login')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
