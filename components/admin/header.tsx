'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ExternalLink, Menu, Bell, LogOut, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useLanguage } from '@/lib/i18n/language-context'
import { AdminNav } from '@/components/admin/admin-nav'
import { LanguageSwitcher } from '@/components/language-switcher'
import { BrandLogo } from '@/components/brand-logo'
import { Separator } from '@/components/ui/separator'
import type { User } from '@supabase/supabase-js'

interface AdminHeaderProps {
  user: User
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-3 pt-[env(safe-area-inset-top)] sm:px-4">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-[min(100vw-2rem,20rem)] flex-col border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
          <div className="flex h-full min-h-0 flex-1 flex-col">
            <div className="shrink-0 space-y-2 border-b border-sidebar-border px-3 py-3">
              <Link href="/admin" className="flex items-center gap-2">
                <BrandLogo size={36} imgClassName="rounded-lg" />
                <span className="text-sm font-semibold text-sidebar-foreground">SIMU JIJI</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full justify-center gap-2 border-sidebar-border bg-sidebar-accent/30 text-xs font-medium text-sidebar-foreground"
                asChild
              >
                <Link href="/shop" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  {t('admin.sidebarViewShop')}
                </Link>
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden px-1.5 pt-1">
              <AdminNav pathname={pathname} t={t} sheetMode />
            </div>

            <Separator className="bg-sidebar-border/80" />

            <div className="shrink-0 space-y-2 p-3">
              <p className="text-sidebar-foreground/55 text-[10px] font-medium uppercase tracking-wider">
                {t('admin.sidebarFooterHint')}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-sidebar-border/70 bg-sidebar-accent/40 px-2 py-1.5">
                <Sparkles className="text-sidebar-primary h-3 w-3 shrink-0" aria-hidden />
                <span className="text-sidebar-foreground/80 text-[11px] leading-snug">
                  {t('admin.badgeMultiVendor')} · {t('admin.badgeAdvancedAnalytics')}
                </span>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t('common.signOut')}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Page Title - Desktop */}
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-foreground">{t("admin.adminDashboard")}</h1>
      </div>

      {/* Logo - Mobile */}
      <Link href="/admin" className="flex items-center gap-2 md:hidden">
        <BrandLogo size={32} />
        <span className="font-bold text-foreground">Admin</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">{t("dashboard.notifications")}</span>
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
