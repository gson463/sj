'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { type Category } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface ProductFiltersProps {
  categories: Category[]
  brands: string[]
  /** `toolbar` = sheet + inline controls only (shop layout). Default = sidebar + mobile sheet. */
  layout?: 'sidebar' | 'toolbar'
}

type ProductFilterContentProps = {
  hideSort?: boolean
  categories: Category[]
  brands: string[]
  searchParams: ReturnType<typeof useSearchParams>
  router: ReturnType<typeof useRouter>
  createQueryString: (name: string, value: string) => string
  t: (key: string) => string
  hasFilters: boolean
  clearFilters: () => void
}

function ProductFilterContent({
  hideSort = false,
  categories,
  brands,
  searchParams,
  router,
  createQueryString,
  t,
  hasFilters,
  clearFilters,
}: ProductFilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">{t('common.search')}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder={t('nav.search')}
            className="pl-9"
            defaultValue={searchParams.get('q') || ''}
            onChange={(e) => {
              const query = createQueryString('q', e.target.value)
              router.push(`/shop?${query}`)
            }}
          />
        </div>
      </div>

      {!hideSort && (
        <div className="space-y-2">
          <Label>{t('products.sort')}</Label>
          <Select
            defaultValue={searchParams.get('sort') || ''}
            onValueChange={(value) => {
              const query = createQueryString('sort', value)
              router.push(`/shop?${query}`)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('products.sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t('products.featured')}</SelectItem>
              <SelectItem value="newest">{t('common.next')}</SelectItem>
              <SelectItem value="price-asc">
                {t('products.price')}: Low to High
              </SelectItem>
              <SelectItem value="price-desc">
                {t('products.price')}: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Accordion type="multiple" defaultValue={['category', 'brand', 'price']} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>{t('products.category')}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Button
                variant={!searchParams.get('category') ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const query = createQueryString('category', '')
                  router.push(`/shop?${query}`)
                }}
              >
                {t('products.all')}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    searchParams.get('category') === category.slug ? 'secondary' : 'ghost'
                  }
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const query = createQueryString('category', category.slug)
                    router.push(`/shop?${query}`)
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>{t('products.brand')}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Button
                variant={!searchParams.get('brand') ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const query = createQueryString('brand', '')
                  router.push(`/shop?${query}`)
                }}
              >
                {t('products.all')}
              </Button>
              {brands.map((brand) => (
                <Button
                  key={brand}
                  variant={searchParams.get('brand') === brand ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const query = createQueryString('brand', brand)
                    router.push(`/shop?${query}`)
                  }}
                >
                  {brand}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>{t('products.price')} (TZS)</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="min-price" className="text-xs">
                  Min
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  defaultValue={searchParams.get('min') || ''}
                  onChange={(e) => {
                    const query = createQueryString('min', e.target.value)
                    router.push(`/shop?${query}`)
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="max-price" className="text-xs">
                  Max
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="5000000"
                  defaultValue={searchParams.get('max') || ''}
                  onChange={(e) => {
                    const query = createQueryString('max', e.target.value)
                    router.push(`/shop?${query}`)
                  }}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          {t('products.filter')} {t('common.delete')}
        </Button>
      )}
    </div>
  )
}

export function ProductFilters({
  categories,
  brands,
  layout = 'sidebar',
}: ProductFiltersProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const clearFilters = () => {
    router.push('/shop')
  }

  const hasFilters = searchParams.toString().length > 0

  const filterContentProps = {
    categories,
    brands,
    searchParams,
    router,
    createQueryString,
    t,
    hasFilters,
    clearFilters,
  }

  const renderFilterSheet = (hideSortInSheet: boolean) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={
            layout === 'toolbar'
              ? 'shrink-0 border-sky-200 bg-white hover:bg-sky-50/80'
              : 'w-full'
          }
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t('products.filter')}
          {hasFilters && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              !
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={layout === 'toolbar' ? 'right' : 'left'}
        className="w-[min(100vw-2rem,28rem)] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{t('products.filter')}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ProductFilterContent {...filterContentProps} hideSort={hideSortInSheet} />
        </div>
      </SheetContent>
    </Sheet>
  )

  if (layout === 'toolbar') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[160px] flex-1 sm:min-w-[200px]">
          <Label className="sr-only">{t('products.sort')}</Label>
          <Select
            value={searchParams.get('sort') || 'featured'}
            onValueChange={(value) => {
              const query = createQueryString('sort', value)
              router.push(`/shop?${query}`)
            }}
          >
            <SelectTrigger className="border-sky-200 bg-white">
              <SelectValue placeholder={t('products.sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t('products.featured')}</SelectItem>
              <SelectItem value="newest">{t('common.next')}</SelectItem>
              <SelectItem value="price-asc">
                {t('products.price')}: Low to High
              </SelectItem>
              <SelectItem value="price-desc">
                {t('products.price')}: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {renderFilterSheet(true)}
      </div>
    )
  }

  return (
    <>
      <div className="hidden rounded-lg border border-sky-100/80 bg-card p-4 lg:block">
        <h2 className="mb-4 font-semibold text-foreground">{t('products.filter')}</h2>
        <ProductFilterContent {...filterContentProps} hideSort={false} />
      </div>
      <div className="lg:hidden">{renderFilterSheet(false)}</div>
    </>
  )
}
