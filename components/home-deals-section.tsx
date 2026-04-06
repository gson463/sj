'use client'

import Link from 'next/link'
import { Flame } from 'lucide-react'
import { ShopProductCard } from '@/components/shop/shop-product-card'
import { type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'

interface HomeDealsSectionProps {
  products: Product[]
}

export function HomeDealsSection({ products }: HomeDealsSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="bg-muted/30 py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              {t('home.dealsTitle')}
            </h2>
            <p className="mt-2 text-muted-foreground">{t('home.dealsSubtitle')}</p>
          </div>
          <Button variant="outline" asChild className="hidden md:inline-flex">
            <Link href="/shop">{t('common.viewAll')}</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-primary/30 bg-linear-to-br from-primary/10 to-background p-8 lg:min-h-[320px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Flame className="h-6 w-6" aria-hidden />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">{t('home.dealsHot')}</p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{t('home.dealsCta')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('home.promoOff')}</p>
            <Button asChild className="mt-6 w-fit">
              <Link href="/shop">{t('home.shopNow')}</Link>
            </Button>
          </div>

          <div className="lg:col-span-2">
            {products.length === 0 ? (
              <div className="flex min-h-[240px] items-center justify-center rounded-2xl border bg-card p-8 text-center text-muted-foreground">
                {t('home.emptyDeals')}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="h-full">
                    <ShopProductCard product={product} className="h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/shop">{t('common.viewAll')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
