'use client'

import { motion } from 'framer-motion'
import { Search, Wallet, CreditCard, Package } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import {
  staggerContainer,
  staggerItem,
  sectionHeader,
} from '@/components/motion/scroll-reveal'

export function HowItWorks() {
  const { t } = useLanguage()

  const steps = [
    {
      icon: Search,
      title: t("howItWorks.step1_title"),
      description: t("howItWorks.step1_desc"),
    },
    {
      icon: Wallet,
      title: t("howItWorks.step2_title"),
      description: t("howItWorks.step2_desc"),
    },
    {
      icon: CreditCard,
      title: t("howItWorks.step3_title"),
      description: t("howItWorks.step3_desc"),
    },
    {
      icon: Package,
      title: t("howItWorks.step4_title"),
      description: t("howItWorks.step4_desc"),
    },
  ]

  return (
    <section id="how-it-works" className="overflow-x-clip bg-muted/30 py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.div className="mb-12 text-center" variants={sectionHeader}>
            <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              {t("howItWorks.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              {t("howItWorks.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            style={{ perspective: 1000 }}
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={staggerItem} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  <motion.div
                    className="relative mb-4"
                    whileHover={{ scale: 1.06, rotateX: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 shadow-sm ring-1 ring-primary/15 transition-shadow duration-300 hover:shadow-md">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                      {index + 1}
                    </span>
                  </motion.div>

                  <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
