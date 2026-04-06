'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { LucideProps } from 'lucide-react'
import {
  Headphones,
  Laptop,
  Monitor,
  Refrigerator,
  Smartphone,
  Star,
  Tablet,
  Tv,
  Watch,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Category } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

/** Thin line-art stroke like Samsung category nav (minimal weight). */
const iconProps: LucideProps = {
  className: 'h-6 w-6 shrink-0 md:h-7 md:w-7',
  strokeWidth: 1,
  absoluteStrokeWidth: true,
}

function iconForSlug(slug: string) {
  const s = slug.toLowerCase()
  if (s.includes('access')) return Headphones
  if (s.includes('watch') || s.includes('wear')) return Watch
  if (s.includes('tablet')) return Tablet
  if (s.includes('tv') || s.includes('audio')) return Tv
  if (s.includes('monitor')) return Monitor
  if (s.includes('comput') || s.includes('laptop')) return Laptop
  if (s.includes('home') || s.includes('appliance') || s.includes('fridge'))
    return Refrigerator
  return Smartphone
}

interface ShopCategoryTabsProps {
  categories: Category[]
}

export function ShopCategoryTabs({ categories }: ShopCategoryTabsProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === '') params.delete(k)
        else params.set(k, v)
      })
      const q = params.toString()
      router.push(q ? `/shop?${q}` : '/shop')
    },
    [router, searchParams],
  )

  const tabs = [
    {
      key: 'all',
      label: t('shop.allCategories'),
      Icon: Star,
      onClick: () => pushParams({ category: null }),
      active: !currentCategory,
    },
    ...categories.map((cat) => {
      const Icon = iconForSlug(cat.slug)
      return {
        key: cat.id,
        label: cat.name,
        Icon,
        onClick: () => pushParams({ category: cat.slug }),
        active: currentCategory === cat.slug,
      }
    }),
  ]

  return (
    <div className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-5 md:py-6">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:gap-2 md:gap-3">
          {tabs.map((tab) => {
            const Icon = tab.Icon
            return (
              <button
                key={tab.key}
                type="button"
                onClick={tab.onClick}
                className={cn(
                  'flex min-w-19 shrink-0 flex-col items-center gap-2 rounded-lg px-2.5 py-2.5 text-center transition-colors md:min-w-22 md:px-3',
                  tab.active
                    ? 'bg-slate-100 text-foreground ring-1 ring-slate-200/90 sm:bg-sky-50 sm:ring-sky-200/60'
                    : 'text-slate-500 hover:bg-slate-50/90 hover:text-slate-700',
                )}
              >
                <Icon
                  {...iconProps}
                  className={cn(
                    iconProps.className,
                    tab.active
                      ? 'text-primary'
                      : 'text-slate-400',
                  )}
                />
                <span
                  className={cn(
                    'max-w-26 text-[10px] leading-snug tracking-tight md:text-[11px]',
                    tab.active
                      ? 'font-semibold text-foreground'
                      : 'font-normal text-slate-500',
                  )}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
