'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ExternalLink, LogOut, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/lib/i18n/language-context'
import { BrandLogo } from '@/components/brand-logo'
import { AdminNav } from '@/components/admin/admin-nav'
import { cn } from '@/lib/utils'

export function AdminSidebar() {
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
    <aside
      className={cn(
        'hidden w-68 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        'shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.04)]',
        'md:flex md:flex-col',
      )}
    >
      <div className="flex h-full min-h-0 flex-1 flex-col">
        {/* Brand */}
        <div className="shrink-0 px-3 pt-3">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-sidebar-accent/60"
          >
            <BrandLogo size={36} imgClassName="rounded-lg shadow-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">SIMU JIJI</p>
              <p className="text-sidebar-foreground/55 truncate text-[11px] font-medium uppercase tracking-wider">
                {t('admin.adminDashboard')}
              </p>
            </div>
          </Link>
        </div>

        {/* Primary exit hatch: live store */}
        <div className="shrink-0 px-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full justify-center gap-2 border-sidebar-border bg-sidebar-accent/30 text-xs font-medium text-sidebar-foreground hover:bg-sidebar-accent"
            asChild
          >
            <Link href="/shop" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {t('admin.sidebarViewShop')}
            </Link>
          </Button>
        </div>

        <Separator className="mx-3 my-3 bg-sidebar-border/80" />

        {/* Grouped navigation */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col px-1.5">
          <AdminNav pathname={pathname} t={t} />
        </div>

        <Separator className="mx-3 bg-sidebar-border/80" />

        {/* Footer: capabilities + sign out */}
        <div className="shrink-0 space-y-2 p-3">
          <p className="text-sidebar-foreground/55 px-0.5 text-[10px] font-medium uppercase tracking-wider">
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
            className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9 w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t('common.signOut')}
          </Button>
        </div>
      </div>
    </aside>
  )
}
