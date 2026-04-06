'use client'

import { useMemo } from 'react'
import { ShopProductCard } from '@/components/shop/shop-product-card'
import { type Category, type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface HomeTrendingTabsProps {
  categories: Category[]
  products: Product[]
}

export function HomeTrendingTabs({ categories, products }: HomeTrendingTabsProps) {
  const { t } = useLanguage()
  const tabCategories = useMemo(() => categories.slice(0, 5), [categories])

  const byCategory = useMemo(() => {
    const map = new Map<string, Product[]>()
    map.set('all', products)
    for (const c of tabCategories) {
      map.set(
        c.id,
        products.filter((p) => p.category_id === c.id),
      )
    }
    return map
  }, [products, tabCategories])

  if (products.length === 0) {
    return (
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-3 text-center text-muted-foreground sm:px-4">
          <p>{t('home.emptyTrending')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-x-clip py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {t('home.trendingTitle')}
          </h2>
          <p className="mt-2 text-muted-foreground">{t('home.trendingSubtitle')}</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className={cn(
                'rounded-full border px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10',
              )}
            >
              {t('home.tabAll')}
            </TabsTrigger>
            {tabCategories.map((c) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className="rounded-full border px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-primary/10"
              >
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <TrendingGrid list={byCategory.get('all') ?? []} />
          </TabsContent>
          {tabCategories.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-0">
              <TrendingGrid list={byCategory.get(c.id) ?? []} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function TrendingGrid({ list }: { list: Product[] }) {
  const { t } = useLanguage()
  if (list.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">{t('home.emptyTrending')}</p>
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {list.slice(0, 10).map((product) => (
        <div key={product.id} className="h-full">
          <ShopProductCard product={product} className="h-full" />
        </div>
      ))}
    </div>
  )
}
