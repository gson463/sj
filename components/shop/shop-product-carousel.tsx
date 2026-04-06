'use client'

import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { ShopProductCard } from '@/components/shop/shop-product-card'
import { type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'
import styles from './shop-product-carousel.module.css'

interface ShopProductCarouselProps {
  products: Product[]
}

export function ShopProductCarousel({ products }: ShopProductCarouselProps) {
  const { t } = useLanguage()
  const [api, setApi] = React.useState<CarouselApi>()
  const [progress, setProgress] = React.useState(0)
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)
  const desktopFillRef = React.useRef<HTMLDivElement>(null)
  const mobileFillRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const wDesktop = `${Math.max(10, progress * 100)}%`
    const wMobile = `${Math.max(12, progress * 100)}%`
    desktopFillRef.current?.style.setProperty('--carousel-progress', wDesktop)
    mobileFillRef.current?.style.setProperty('--carousel-progress', wMobile)
  }, [progress])

  React.useEffect(() => {
    if (!api) return
    const onScroll = () => setProgress(api.scrollProgress())
    const onSelect = () => {
      setCanPrev(api.canScrollPrev())
      setCanNext(api.canScrollNext())
      setProgress(api.scrollProgress())
    }
    api.on('scroll', onScroll)
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    onSelect()
    onScroll()
    return () => {
      api.off('scroll', onScroll)
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  if (products.length === 0) return null

  return (
    <div className="mb-12">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-foreground md:text-xl">
          {t('shop.spotlight')}
        </h2>
        <div className="flex items-center gap-3">
          <div className="hidden h-1.5 w-40 overflow-hidden rounded-full bg-slate-200 md:block lg:w-56">
            <div
              ref={desktopFillRef}
              className={cn(
                styles.progressFill,
                'h-full rounded-full bg-primary transition-all duration-150',
              )}
            />
          </div>
          <IconButton
            size="small"
            disabled={!canPrev}
            onClick={() => api?.scrollPrev()}
            aria-label="Previous"
            sx={{
              border: '1px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'action.hover' },
              '&.Mui-disabled': { opacity: 0.35, borderColor: 'divider' },
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </IconButton>
          <IconButton
            size="small"
            disabled={!canNext}
            onClick={() => api?.scrollNext()}
            aria-label="Next"
            sx={{
              border: '1px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'action.hover' },
              '&.Mui-disabled': { opacity: 0.35, borderColor: 'divider' },
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: false, dragFree: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className={cn(
                'pl-3 md:pl-4',
                'basis-[85%] sm:basis-[48%] md:basis-[32%] lg:basis-[28%] xl:basis-[24%]',
              )}
            >
              <ShopProductCard product={product} className="h-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 md:hidden">
        <div
          ref={mobileFillRef}
          className={cn(
            styles.progressFillMobile,
            'h-full rounded-full bg-primary transition-all duration-150',
          )}
        />
      </div>
    </div>
  )
}
