"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { type Category } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { TiltCard } from '@/components/motion/tilt-card'
import {
  staggerContainer,
  staggerItem,
  sectionHeader,
} from '@/components/motion/scroll-reveal'

interface CategoriesSectionProps {
  categories: Category[]
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="overflow-x-clip py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.div
            className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            variants={sectionHeader}
          >
            <div>
              <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                {t("common.shopByCategory")}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t("common.findPhone")}
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
            >
              {t("common.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            style={{ perspective: 1000 }}
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={staggerItem}>
                <TiltCard tiltAmount={8} className="h-full">
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="group relative block h-full overflow-hidden rounded-xl shadow-sm ring-1 ring-border/60 transition-shadow duration-300 hover:shadow-xl"
                  >
                    {/* Product category featured image (categories.image_url); 4:3 — see Admin → Categories. */}
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={category.image_url || '/placeholder.svg'}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/80" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold text-white drop-shadow-sm transition-transform duration-300 group-hover:translate-y-[-2px]">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-1 text-sm text-white/85">{category.description}</p>
                      )}
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("common.viewAllCategories")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
