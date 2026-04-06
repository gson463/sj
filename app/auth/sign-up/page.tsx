'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthStandaloneDialog } from '@/components/auth/auth-standalone-dialog'

function SignUpWithRedirect() {
  const searchParams = useSearchParams()
  return <AuthStandaloneDialog mode="signup" redirectTo={searchParams.get('redirect')} />
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto h-40 w-full max-w-lg animate-pulse rounded-xl border border-sky-100 bg-sky-50/40" />
      }
    >
      <SignUpWithRedirect />
    </Suspense>
  )
}
