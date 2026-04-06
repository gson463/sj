'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Store } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { VendorApplication } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Props = {
  user: User | null
  profileRole: string | null
  latestApplication: VendorApplication | null
}

export function SellerApplyContent({ user, profileRole, latestApplication }: Props) {
  const { t } = useLanguage()
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCustomer = user && profileRole === 'customer'
  const pending = latestApplication?.status === 'pending'
  const rejected = latestApplication?.status === 'rejected'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isCustomer) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          contact_phone: contactPhone,
          message: message.trim() || null,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (j.error === 'pending_exists' || res.status === 409) {
          setError(t('sellerApply.errorPending'))
        } else if (j.error === 'only_customers') {
          setError(t('sellerApply.errorRole'))
        } else {
          setError(t('sellerApply.errorGeneric'))
        }
        return
      }
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

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
              <Link href="/auth/login?redirect=/sell">{t('sellerApply.loginCta')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/sign-up?redirect=/sell">{t('sellerApply.signupCta')}</Link>
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

          {error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>{t('sellerApply.formTitle')}</CardTitle>
              <CardDescription>{t('sellerApply.formDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="biz">{t('sellerApply.businessName')}</Label>
                  <Input
                    id="biz"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={t('sellerApply.businessPlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('sellerApply.contactPhone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder={t('sellerApply.phonePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="msg">{t('sellerApply.message')}</Label>
                  <Textarea
                    id="msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('sellerApply.messagePlaceholder')}
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('sellerApply.submitting')}
                    </>
                  ) : (
                    t('sellerApply.submit')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
