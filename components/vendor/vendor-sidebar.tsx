'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { type Profile } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { BrandLogo } from '@/components/brand-logo'
import type { User } from '@supabase/supabase-js'

interface VendorSidebarProps {
  user: User
  profile: Profile | null
}

export function VendorSidebar({ profile }: VendorSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  const navItems = [
    { href: '/vendor', label: t('vendor.overview'), icon: LayoutDashboard, exact: true },
    { href: '/vendor/products', label: t('vendor.myProducts'), icon: Package, exact: false },
    { href: '/vendor/orders', label: t('vendor.orders'), icon: ShoppingBag, exact: false },
    { href: '/vendor/notifications', label: t('dashboard.notifications'), icon: Bell, exact: false },
    { href: '/vendor/settings', label: t('vendor.settings'), icon: Settings, exact: false },
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const linkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/vendor" className="flex items-center gap-2">
            <BrandLogo size={40} />
            <div className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{t('vendor.title')}</span>
              <span className="hidden text-xs text-muted-foreground lg:block">{t('vendor.tagline')}</span>
            </div>
          </Link>
        </div>

        <div className="border-b px-4 py-2">
          <Button variant="outline" size="sm" className="h-8 w-full justify-center gap-2 text-xs font-medium" asChild>
            <Link href="/shop" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {t('vendor.shopLink')}
            </Link>
          </Button>
        </div>

        <div className="border-b p-4">
          <p className="font-medium text-foreground">{profile?.full_name || t('common.customer')}</p>
          <p className="text-sm text-muted-foreground">{profile?.phone || t('common.noPhone')}</p>
        </div>

        <nav className="flex-1 space-y-1 p-2" aria-label={t('vendor.title')}>
          {navItems.map((item) => {
            const isActive = linkActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
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
