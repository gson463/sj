'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export function ShopHero() {
  const { t } = useLanguage()

  return (
    <section className="border-b border-sky-100/80 bg-white px-3 py-8 sm:px-4 sm:py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          {t('shop.essentialsTitle')}
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
          {t('shop.essentialsSubtitle')}
        </p>
      </div>
    </section>
  )
}
