'use client'

import { useLanguage } from '@/lib/i18n/language-context'

const BRANDS = ['Samsung', 'Apple', 'Google', 'Xiaomi', 'Tecno', 'Infinix', 'Nokia', 'Huawei'] as const

export function HomeBrandsStrip() {
  const { t } = useLanguage()

  return (
    <section className="border-y bg-muted/20 py-10">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <p className="mb-6 text-center text-sm font-medium text-muted-foreground">{t('home.brandsTitle')}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {BRANDS.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-tight text-foreground/70 transition-colors hover:text-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
