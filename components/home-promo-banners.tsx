'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Percent, ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'
import type { CmsSiteSettings } from '@/lib/types'
import { getBannerSlot } from '@/lib/cms-resolve'
import { cn } from '@/lib/utils'

type Props = {
  cms?: CmsSiteSettings | null
}

export function HomePromoBanners({ cms }: Props) {
  const { t } = useLanguage()
  const left = cms ? getBannerSlot(cms, 'home_promo_left') : null
  const right = cms ? getBannerSlot(cms, 'home_promo_right') : null

  return (
    <section className="border-y bg-muted/20 py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="grid gap-4 md:grid-cols-2">
          <PromoBlock
            slot={left}
            defaultHref="/lipa-kidogo"
            variant="primary"
            icon={<Percent className="mb-3 h-8 w-8 opacity-90" aria-hidden />}
            eyebrow={t('home.promoOff')}
            title={t('home.promoLipaTitle')}
            body={t('home.promoLipaDesc')}
          />
          <PromoBlock
            slot={right}
            defaultHref="/shop?category=accessories"
            variant="card"
            icon={<ShoppingBag className="mb-3 h-8 w-8 text-primary" aria-hidden />}
            title={t('home.promoShopTitle')}
            body={t('home.promoShopDesc')}
          />
        </div>
      </div>
    </section>
  )
}

function PromoBlock({
  slot,
  defaultHref,
  variant,
  icon,
  eyebrow,
  title,
  body,
}: {
  slot: ReturnType<typeof getBannerSlot>
  defaultHref: string
  variant: 'primary' | 'card'
  icon: React.ReactNode
  eyebrow?: string
  title: string
  body: string
}) {
  const { t } = useLanguage()
  const img = slot?.image_url?.trim()
  const rawLink = slot?.link_url?.trim()
  const ctaHref = rawLink || defaultHref

  const cta = ctaHref.startsWith('http') ? (
    <a href={ctaHref} target="_blank" rel="noopener noreferrer">
      {t('home.shopNow')}
    </a>
  ) : (
    <Link href={ctaHref}>{t('home.shopNow')}</Link>
  )

  return (
    <div
      className={cn(
        'relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl p-8 md:min-h-[260px] md:p-10',
        !img && variant === 'primary' && 'bg-linear-to-br from-primary/90 to-primary text-primary-foreground shadow-lg',
        !img && variant === 'card' && 'border border-border/80 bg-card text-foreground shadow-sm',
        img && 'text-white shadow-lg',
      )}
    >
      {img && (
        <>
          <Image src={img} alt={slot?.alt || title} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/25" />
        </>
      )}
      <div className="relative z-[1] flex h-full flex-col">
        {!img && icon}
        {eyebrow && <p className="text-sm font-medium uppercase tracking-wider opacity-90">{eyebrow}</p>}
        <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{title}</h3>
        <p
          className={cn(
            'mt-2 max-w-md text-sm md:text-base',
            img && 'text-white/90',
            !img && variant === 'primary' && 'text-primary-foreground/90',
            !img && variant === 'card' && 'text-muted-foreground',
          )}
        >
          {body}
        </p>
        <Button
          asChild
          variant={img ? 'secondary' : variant === 'primary' ? 'secondary' : 'default'}
          className="mt-6 w-fit font-semibold"
        >
          {cta}
        </Button>
      </div>
    </div>
  )
}
