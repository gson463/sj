'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import MuiButton from '@mui/material/Button'
import { ArrowRight, CheckCircle2, Smartphone, Wallet, Truck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { getBannerSlotEnabled } from '@/lib/cms-resolve'
import type { CmsSiteSettings } from '@/lib/types'
import { CmsOptionalLink } from '@/components/cms/cms-optional-link'

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'

type HeroSectionProps = {
  cms?: CmsSiteSettings | null
}

export function HeroSection({ cms }: HeroSectionProps) {
  const { t, locale } = useLanguage()
  const reduceMotion = useReducedMotion()

  const features = locale === 'en' 
    ? ['Small deposit (10%)', 'No interest', 'Secure payments']
    : ['Amana ndogo (10%)', 'Bila riba', 'Usalama wa malipo']

  const heroSlot = getBannerSlotEnabled(cms, 'home_hero_side')
  const heroImageSrc = heroSlot?.image_url?.trim() || FALLBACK_HERO_IMAGE
  const heroImageAlt =
    heroSlot?.alt?.trim() ||
    (locale === 'en' ? 'Smartphones collection' : 'Mkusanyiko wa simu')
  const heroLink = heroSlot?.link_url?.trim()

  const heroImg = (
    <Image
      src={heroImageSrc}
      alt={heroImageAlt}
      width={600}
      height={600}
      className="relative rounded-2xl object-cover shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
      priority
    />
  )

  const heroImgWrapped = (
    <CmsOptionalLink
      href={heroLink}
      className="relative block rounded-2xl focus-visible:ring-offset-2"
    >
      {heroImg}
    </CmsOptionalLink>
  )

  return (
    <section className="relative overflow-x-clip overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-7xl px-3 py-12 sm:px-4 sm:py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 28, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 85, damping: 22 }}
            style={{ perspective: 900 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Wallet className="h-4 w-4" />
              {t("hero.badge")}
            </div>
            
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            
            <p className="max-w-lg text-pretty text-lg text-muted-foreground">
              {t("hero.subtitle")}
            </p>

            <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
              <MuiButton
                component={Link}
                href="/shop"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ '@media (min-width: 640px)': { width: 'auto' } }}
                endIcon={<ArrowRight className="h-4 w-4" />}
              >
                {t("hero.cta_browse")}
              </MuiButton>
              <MuiButton
                component={Link}
                href="#how-it-works"
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                sx={{ '@media (min-width: 640px)': { width: 'auto' } }}
              >
                {t("hero.cta_how")}
              </MuiButton>
            </div>

            {/* Features */}
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.94, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ type: 'spring', stiffness: 70, damping: 18 }}
            style={{ perspective: 1200 }}
          >
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/20 to-accent/20 blur-3xl" />
              {heroImgWrapped}
            </div>

            {/* Floating Cards */}
            <motion.div
              className="absolute left-2 top-1/4 rounded-lg bg-card/95 p-3 shadow-lg ring-1 ring-border/50 backdrop-blur-sm sm:-left-4 sm:p-4"
              initial={{ opacity: 0, y: 20, rotateX: 14 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 95, damping: 18, delay: 0.15 }}
            >
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">+500</p>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'en' ? 'Phones sold' : 'Simu zimeuzwa'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute right-2 bottom-1/4 rounded-lg bg-card/95 p-3 shadow-lg ring-1 ring-border/50 backdrop-blur-sm sm:-right-4 sm:p-4"
              initial={{ opacity: 0, y: 20, rotateX: 14 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 95, damping: 18, delay: 0.28 }}
            >
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Truck className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Delivery</p>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'en' ? 'All Tanzania' : 'Tanzania nzima'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
