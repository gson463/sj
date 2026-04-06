'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { type Category } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface HomeRecommendedCategoriesProps {
  categories: Category[]
}

export function HomeRecommendedCategories({ categories }: HomeRecommendedCategoriesProps) {
  const { t } = useLanguage()
  const items = categories.slice(0, 6)
  if (items.length === 0) return null

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t('home.recommendedTitle')}</h2>
            <p className="mt-2 text-muted-foreground">{t('home.recommendedSubtitle')}</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t('common.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={cat.image_url || '/placeholder.svg'}
                  alt=""
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground group-hover:text-primary">{cat.name}</p>
                {cat.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{cat.description}</p>
                )}
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
