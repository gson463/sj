'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  CreditCard,
  Bell,
  Heart,
  Settings,
  LogOut,
  User as UserIcon,
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

interface DashboardSidebarProps {
  user: User
  profile: Profile | null
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  const navItems = [
    { href: '/dashboard', label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: '/dashboard/wallets', label: t("dashboard.myWallets"), icon: Wallet },
    { href: '/dashboard/orders', label: t("dashboard.myOrders"), icon: ShoppingBag },
    { href: '/dashboard/payments', label: t("dashboard.payments"), icon: CreditCard },
    { href: '/dashboard/notifications', label: t("dashboard.notifications"), icon: Bell },
    { href: '/dashboard/wishlist', label: t('dashboard.wishlist'), icon: Heart },
    { href: '/dashboard/profile', label: t("dashboard.profile"), icon: UserIcon },
    { href: '/dashboard/settings', label: t("dashboard.settings"), icon: Settings },
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo size={40} />
            <span className="hidden text-xs text-muted-foreground lg:inline">{t('common.lipaKidogo')}</span>
          </Link>
        </div>

        <div className="border-b px-4 py-2">
          <Button variant="outline" size="sm" className="h-8 w-full justify-center gap-2 text-xs font-medium" asChild>
            <Link href="/shop" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {t('nav.shop')}
            </Link>
          </Button>
        </div>

        {/* User Info */}
        <div className="border-b p-4">
          <p className="font-medium text-foreground">
            {profile?.full_name || t("common.customer")}
          </p>
          <p className="text-sm text-muted-foreground">
            {profile?.phone || t("common.noPhone")}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("common.signOut")}
          </Button>
        </div>
      </div>
    </aside>
  )
}
