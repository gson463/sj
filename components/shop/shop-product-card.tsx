'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { type Product, formatTZS } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'

interface ShopProductCardProps {
  product: Product
  className?: string
}

export function ShopProductCard({ product, className }: ShopProductCardProps) {
  const { t } = useLanguage()
  const imageSrc = product.images[0] || '/placeholder.svg'
  const discount = product.compare_price
    ? Math.round(
        ((product.compare_price - product.price) / product.compare_price) * 100,
      )
    : 0

  const isOutOfStock =
    product.stock_status === 'out_of_stock' || product.stock === 0

  const lowStock =
    !isOutOfStock &&
    product.stock > 0 &&
    product.stock <= (product.low_stock_threshold ?? 5)

  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={`${product.name}, ${formatTZS(product.price)}`}
      className={cn(
        'group/card relative flex h-full flex-col overflow-hidden rounded-3xl',
        'border border-slate-200/70 bg-white',
        'shadow-[0_2px_20px_-4px_rgba(26,83,155,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset]',
        'transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none',
        'hover:-translate-y-1.5 hover:border-sky-200/90 motion-reduce:hover:translate-y-0',
        'hover:shadow-[0_24px_48px_-16px_rgba(26,83,155,0.2),0_0_0_1px_rgba(226,232,240,0.9)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isOutOfStock && 'opacity-95 hover:translate-y-0 hover:shadow-[0_2px_20px_-4px_rgba(26,83,155,0.08)]',
        className,
      )}
    >
      {/* Image stage — premium light-well */}
      <div
        className={cn(
          'relative aspect-4/5 w-full overflow-hidden',
          'bg-linear-to-b from-sky-50/95 via-white to-slate-50/80',
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(26,83,155,0.14),transparent_58%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_100%,rgba(227,30,36,0.04),transparent_55%)]"
          aria-hidden
        />

        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 640px) 38vw, 88vw"
          className={cn(
            'object-contain p-5 transition-[transform,filter] duration-500 ease-out',
            'group-hover/card:scale-[1.045]',
            isOutOfStock && 'grayscale-[0.35] contrast-[0.92]',
          )}
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 z-1 flex max-w-[calc(100%-4rem)] flex-col gap-1.5">
          {discount > 0 && !isOutOfStock && (
            <span
              className={cn(
                'inline-flex w-fit items-center rounded-lg px-2 py-0.5 text-[11px] font-bold',
                'bg-(--brand-red)/95 text-white shadow-sm',
              )}
            >
              −{discount}%
            </span>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="border-0 bg-slate-900/85 text-[10px] text-white">
              {t('products.outOfStock')}
            </Badge>
          )}
          {lowStock && (
            <Badge
              variant="outline"
              className="w-fit border-amber-300/80 bg-amber-50/95 text-[10px] font-medium text-amber-900"
            >
              {product.stock} {t('products.remaining')}
            </Badge>
          )}
        </div>

        <div className="absolute right-2.5 top-2.5 z-1 flex flex-col items-end gap-1.5">
          {product.featured && !isOutOfStock && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full border border-sky-200/80',
                'bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-primary shadow-sm backdrop-blur-sm',
              )}
            >
              <Sparkles className="h-3 w-3 shrink-0 text-amber-500" aria-hidden />
              {t('products.featured')}
            </span>
          )}
        </div>

        {/* Hover affordance */}
        <div
          className={cn(
            'pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full',
            'bg-primary text-primary-foreground shadow-md opacity-0 transition-all duration-300',
            'group-hover/card:translate-y-0 group-hover/card:opacity-100',
            'translate-y-1',
          )}
          aria-hidden
        >
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col border-t border-slate-100/90 bg-white px-4 pb-4 pt-3.5">
        {product.brand && (
          <p className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/75">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] break-words text-[15px] font-semibold leading-snug tracking-tight text-foreground md:min-h-12 md:text-base">
          {product.name}
        </h3>

        {product.specs && (product.specs.ram || product.specs.storage) && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.specs.ram && (
              <span className="rounded-md border border-sky-100/90 bg-sky-50/80 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {product.specs.ram}
              </span>
            )}
            {product.specs.storage && (
              <span className="rounded-md border border-sky-100/90 bg-sky-50/80 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                {product.specs.storage}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100/80 pt-3.5">
          <div className="min-w-0">
            <p className="text-xl font-bold tabular-nums tracking-tight text-primary md:text-[1.35rem]">
              {formatTZS(product.price)}
            </p>
            {product.compare_price && product.compare_price > product.price && (
              <p className="mt-0.5 text-xs tabular-nums text-muted-foreground line-through">
                {formatTZS(product.compare_price)}
              </p>
            )}
          </div>
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
            {t('products.viewDetails')}
          </span>
        </div>
      </div>
    </Link>
  )
}
