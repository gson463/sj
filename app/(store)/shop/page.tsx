'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ShopHero } from '@/components/shop/shop-hero'
import { ShopCategoryTabs } from '@/components/shop/shop-category-tabs'
import { ShopProductCarousel } from '@/components/shop/shop-product-carousel'
import { ShopProductCard } from '@/components/shop/shop-product-card'
import { staggerContainer, staggerItem } from '@/components/motion/scroll-reveal'
import { ProductFilters } from '@/components/product-filters'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Product, type Category, type CmsSiteSettings } from '@/lib/types'
import { CmsSlotBanner } from '@/components/cms/cms-slot-banner'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/lib/i18n/language-context'

function ShopGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-24 rounded-t-2xl" />
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      ))}
    </div>
  )
}

/** Main storefront catalog (the “shop” page). */
export default function ShopPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cms, setCms] = useState<CmsSiteSettings | null>(null)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(name, value)
      else params.delete(name)
      return params.toString()
    },
    [searchParams],
  )

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((j) => setCms(j as CmsSiteSettings))
      .catch(() => setCms(null))
  }, [])

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setCategories((categoriesData as Category[]) || [])

      const { data: brandsData } = await supabase
        .from('products')
        .select('brand')
        .eq('active', true)
        .not('brand', 'is', null)

      const uniqueBrands = [
        ...new Set(brandsData?.map((p) => p.brand).filter(Boolean)),
      ] as string[]
      setBrands(uniqueBrands)

      let query = supabase.from('products').select('*').eq('active', true)

      const category = searchParams.get('category')
      const brand = searchParams.get('brand')
      const min = searchParams.get('min')
      const max = searchParams.get('max')
      const sort = searchParams.get('sort')
      const q = searchParams.get('q')

      if (category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single()

        if (categoryData) {
          query = query.eq('category_id', categoryData.id)
        }
      }

      if (brand) {
        query = query.eq('brand', brand)
      }

      if (min) {
        query = query.gte('price', parseInt(min))
      }

      if (max) {
        query = query.lte('price', parseInt(max))
      }

      if (q) {
        query = query.ilike('name', `%${q}%`)
      }

      switch (sort) {
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'featured':
          query = query
            .order('featured', { ascending: false })
            .order('created_at', { ascending: false })
          break
        default:
          query = query
            .order('featured', { ascending: false })
            .order('created_at', { ascending: false })
      }

      const { data: productsData } = await query
      setProducts((productsData as Product[]) || [])
      setIsLoading(false)
    }

    fetchData()
  }, [searchParams])

  const spotlightProducts = [...products]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <CmsSlotBanner cms={cms} slotId="shop_top" variant="compact" />
      <ShopHero />
      <ShopCategoryTabs categories={categories} />

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 max-w-md flex-1">
            <Label htmlFor="shop-search" className="sr-only">
              {t('common.search')}
            </Label>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="shop-search"
              type="search"
              placeholder={t('nav.search')}
              className="border-sky-200 bg-white pl-9 shadow-sm"
              defaultValue={searchParams.get('q') || ''}
              onChange={(e) => {
                const query = createQueryString('q', e.target.value)
                router.push(query ? `/shop?${query}` : '/shop')
              }}
            />
          </div>
          <ProductFilters
            categories={categories}
            brands={brands}
            layout="toolbar"
          />
        </div>

        {!isLoading && (
          <p className="mb-6 text-sm font-medium text-foreground">
            <span className="tabular-nums">{products.length}</span>{' '}
            <span className="font-normal text-muted-foreground">
              {t('shop.results')}
            </span>
          </p>
        )}

        {isLoading ? (
          <ShopGridSkeleton />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sky-200 bg-white py-20 text-center">
            <p className="text-lg font-medium text-foreground">
              {t('products.noResults')}
            </p>
            <p className="mt-2 text-muted-foreground">{t('products.tryAgain')}</p>
          </div>
        ) : (
          <>
            <ShopProductCarousel products={spotlightProducts} />

            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {t('shop.browseGrid')}
            </h2>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerContainer}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              style={{ perspective: 1000 }}
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <ShopProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
