import { AuthLanguageBar } from '@/components/auth-language-bar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-start overflow-x-clip bg-linear-to-b from-sky-50/90 via-muted/25 to-muted/40 px-3 pt-6 pb-12 sm:px-4">
      <AuthLanguageBar />
      {/* Auth UI is modal-only (see AuthStandaloneDialog); logo lives in dialog + home */}
      {children}
    </div>
  )
}
