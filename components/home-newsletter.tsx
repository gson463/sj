'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function HomeNewsletter() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error(t('home.newsletterEmpty'))
      return
    }
    toast.success(t('home.newsletterThanks'))
    setEmail('')
  }

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="rounded-2xl border bg-linear-to-br from-primary/10 via-background to-accent/5 p-8 md:flex md:items-center md:justify-between md:gap-12 md:p-12">
          <div className="mb-6 flex items-start gap-4 md:mb-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Mail className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground md:text-2xl">{t('home.newsletterTitle')}</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">{t('home.newsletterSubtitle')}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:max-w-md sm:flex-row md:w-auto md:min-w-[320px]">
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t('home.newsletterPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
            <Button type="submit" className="shrink-0">
              {t('home.newsletterCta')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
