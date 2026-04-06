"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ShopProductCard } from '@/components/shop/shop-product-card'
import { type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import {
  staggerContainer,
  staggerItem,
  sectionHeader,
} from '@/components/motion/scroll-reveal'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
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
                {t("products.featured")}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t("home.featuredSubtitle")}
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
            {products.map((product) => (
              <motion.div key={product.id} variants={staggerItem} className="h-full">
                <ShopProductCard product={product} className="h-full" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("common.viewAllProducts")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
