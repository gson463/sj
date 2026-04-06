'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Store } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { VendorApplication } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { VendorApplyModal } from '@/components/sell/vendor-apply-modal'

type Props = {
  user: User | null
  profileRole: string | null
  latestApplication: VendorApplication | null
}

export function SellerApplyContent({ user, profileRole, latestApplication }: Props) {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)

  const isCustomer = user && profileRole === 'customer'
  const pending = latestApplication?.status === 'pending'
  const rejected = latestApplication?.status === 'rejected'

  useEffect(() => {
    if (searchParams.get('apply') === '1' && isCustomer && !pending) {
      setModalOpen(true)
    }
  }, [searchParams, isCustomer, pending])

  return (
    <div className="mx-auto max-w-2xl px-3 py-12 sm:px-4 sm:py-16">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Store className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">{t('sellerApply.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('sellerApply.subtitle')}</p>
      </div>

      {!user ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('sellerApply.loginTitle')}</CardTitle>
            <CardDescription>{t('sellerApply.loginDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth/login?redirect=/sell%3Fapply%3D1">{t('sellerApply.loginCta')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/sign-up?redirect=/sell%3Fapply%3D1">{t('sellerApply.signupCta')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : !isCustomer ? (
        <Alert>
          <AlertTitle>{t('sellerApply.notCustomerTitle')}</AlertTitle>
          <AlertDescription>{t('sellerApply.notCustomerDesc')}</AlertDescription>
        </Alert>
      ) : pending ? (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertTitle>{t('sellerApply.pendingTitle')}</AlertTitle>
          <AlertDescription>{t('sellerApply.pendingDesc')}</AlertDescription>
        </Alert>
      ) : (
        <>
          {rejected && latestApplication ? (
            <Alert className="mb-6">
              <AlertTitle>{t('sellerApply.rejectedTitle')}</AlertTitle>
              <AlertDescription>{t('sellerApply.rejectedDesc')}</AlertDescription>
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>{t('sellerApply.formTitle')}</CardTitle>
              <CardDescription>{t('sellerApply.formDescModal')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" size="lg" className="w-full sm:w-auto" onClick={() => setModalOpen(true)}>
                {t('sellerApply.openModalCta')}
              </Button>
            </CardContent>
          </Card>

          <VendorApplyModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            onSubmitted={() => router.refresh()}
          />
        </>
      )}
    </div>
  )
}
