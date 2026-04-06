'use client'

import { ShopProductCard } from '@/components/shop/shop-product-card'
import { type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface HomeTrendingWeekProps {
  products: Product[]
}

export function HomeTrendingWeek({ products }: HomeTrendingWeekProps) {
  const { t } = useLanguage()

  if (products.length === 0) return null

  return (
    <section className="overflow-x-clip py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="mb-8">
          <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">{t('home.weekTitle')}</h2>
          <p className="mt-2 text-muted-foreground">{t('home.weekSubtitle')}</p>
        </div>
        <div className="-mx-3 flex gap-4 overflow-x-auto pb-4 pt-1 px-3 sm:mx-0 sm:px-0">
          {products.map((product) => (
            <div key={product.id} className="h-full w-[min(100%,280px)] shrink-0 sm:w-72">
              <ShopProductCard product={product} className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
