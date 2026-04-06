'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu,
  Bell,
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  CreditCard,
  Heart,
  Settings,
  LogOut,
  User as UserIcon,
  ExternalLink,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type Profile } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'
import { BrandLogo } from '@/components/brand-logo'
import type { User } from '@supabase/supabase-js'

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
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

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

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
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-4">
              <Link href="/" className="flex items-center gap-2">
                <BrandLogo size={36} />
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
        </SheetContent>
      </Sheet>

      {/* Page Title - Desktop */}
      <div className="hidden md:block">
        <h1 className="text-lg font-semibold text-foreground">{t("nav.dashboard")}</h1>
      </div>

      {/* Logo - Mobile */}
      <Link href="/" className="flex items-center gap-2 md:hidden">
        <BrandLogo size={36} />
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">{t("dashboard.notifications")}</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile?.full_name || t("common.customer")}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t("nav.dashboard")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                {t("dashboard.profile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                {t("dashboard.settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("common.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
