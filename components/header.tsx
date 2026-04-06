'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User, ShoppingBag, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAuthModal } from '@/components/auth/auth-modal-provider'
import { useLanguage } from '@/lib/i18n/language-context'
import { BrandLogo } from '@/components/brand-logo'

interface HeaderProps {
  user?: { id: string; email?: string } | null
  /** Customer dashboard, vendor workspace, or admin — resolved in store layout from profile role */
  dashboardHref?: string
}

export function Header({ user, dashboardHref = '/dashboard' }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { t } = useLanguage()
  const { openLogin, openSignUp } = useAuthModal()

  const navLinks = [
    { href: '/', label: t("nav.home") },
    { href: '/shop', label: t('nav.shop') },
    { href: '/sell?apply=1', label: t('nav.sell') },
    { href: '/lipa-kidogo', label: t("nav.lipaKidogo") },
    { href: '/shop?category=accessories', label: t("nav.accessories") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-100/60 bg-linear-to-b from-sky-50/90 via-background/95 to-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex min-h-17 max-w-7xl items-center justify-between gap-2 px-3 py-1 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
          <BrandLogo size={56} priority />
          <span className="hidden max-w-52 text-sm font-semibold leading-tight text-foreground sm:inline md:text-base">
            {t('nav.tagline')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Search */}
          {isSearchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder={t("nav.search")}
                className="w-full min-w-0 max-w-64"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">{t("common.search")}</span>
            </Button>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher />

          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href={dashboardHref}>
                  <ShoppingBag className="h-5 w-5" />
                  <span className="sr-only">{t("nav.dashboard")}</span>
                </Link>
              </Button>
              <Button asChild>
                <Link href={dashboardHref}>
                  <User className="mr-2 h-4 w-4" />
                  {t("nav.dashboard")}
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" type="button" onClick={openLogin}>
                {t("nav.login")}
              </Button>
              <Button type="button" onClick={openSignUp}>
                {t("nav.signup")}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-4" />
                {user ? (
                  <Button asChild className="w-full">
                    <Link href={dashboardHref}>
                      <User className="mr-2 h-4 w-4" />
                      {t("nav.dashboard")}
                    </Link>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        onClick={openLogin}
                      >
                        {t("nav.login")}
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button type="button" className="w-full" onClick={openSignUp}>
                        {t("nav.signup")}
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="border-t p-4 md:hidden">
          <Input
            type="search"
            placeholder={t("nav.search")}
            className="w-full"
            autoFocus
          />
        </div>
      )}
    </header>
  )
}
