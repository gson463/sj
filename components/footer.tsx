'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { useLanguage } from '@/lib/i18n/language-context'

export function Footer() {
  const { t, locale } = useLanguage()

  const quickLinks = [
    { href: '/shop', label: t('nav.shop') },
    { href: '/sell?apply=1', label: t('nav.sell') },
    { href: '#how-it-works', label: t('nav.lipaKidogo') },
    { href: '/about', label: t('nav.about') },
    { href: '/faq', label: locale === 'en' ? 'FAQ' : 'Maswali Yanayoulizwa' },
  ]

  const supportLinks = locale === 'en'
    ? [
        { href: '/terms', label: 'Terms & Conditions' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/returns', label: 'Return Policy' },
        { href: '/contact', label: 'Contact Us' },
      ]
    : [
        { href: '/terms', label: 'Masharti na Vigezo' },
        { href: '/privacy', label: 'Sera ya Faragha' },
        { href: '/returns', label: 'Sera ya Kurudisha' },
        { href: '/contact', label: 'Wasiliana Nasi' },
      ]

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
              <BrandLogo size={52} />
              <span className="hidden max-w-52 text-sm font-semibold leading-tight text-foreground sm:inline md:text-base">
                {t('nav.tagline')}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("footer.aboutText")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {locale === 'en' ? 'Support' : 'Msaada'}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{t("footer.phone")}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{t("footer.email")}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{t("footer.address")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 border-t pt-8">
          <p className="mb-4 text-center text-sm font-medium text-foreground">
            {locale === 'en' ? 'Payment Methods' : 'Njia za Kulipa'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Halopesa', 'CRDB', 'NMB', 'Visa', 'MasterCard'].map((method) => (
              <span
                key={method}
                className="rounded-md bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SIMU JIJI. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  )
}
