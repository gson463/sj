import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Package,
  Users,
  Truck,
  CreditCard,
  BarChart3,
  TicketPercent,
  Warehouse,
  PanelsTopLeft,
  Mail,
  Shield,
  Percent,
  Settings,
} from 'lucide-react'

export type AdminNavChild = {
  href: string
  labelKey: string
}

export type AdminNavSection = {
  id: string
  labelKey: string
  icon: LucideIcon
  children: AdminNavChild[]
}

/** Logical groups (information architecture): overview → sales → catalog → ops → finance → content → admin */
export type AdminNavGroup = {
  id: string
  /** i18n: admin.navGroup.<id> */
  labelKey: string
  sections: AdminNavSection[]
}

const SECTIONS = {
  dashboard: {
    id: 'dashboard',
    labelKey: 'admin.nav.dashboardGroup',
    icon: LayoutDashboard,
    children: [
      { href: '/admin', labelKey: 'admin.nav.overview' },
      { href: '/admin/analytics', labelKey: 'admin.nav.analyticsTrends' },
    ],
  },
  marketplace: {
    id: 'marketplace',
    labelKey: 'admin.nav.marketplaceGroup',
    icon: Store,
    children: [{ href: '/admin/marketplace', labelKey: 'admin.nav.marketplaceOverview' }],
  },
  orders: {
    id: 'orders',
    labelKey: 'admin.nav.ordersGroup',
    icon: ShoppingBag,
    children: [
      { href: '/admin/orders', labelKey: 'admin.nav.allOrders' },
      { href: '/admin/orders/refunds', labelKey: 'admin.nav.refundsNotes' },
    ],
  },
  customers: {
    id: 'customers',
    labelKey: 'admin.nav.customersGroup',
    icon: Users,
    children: [
      { href: '/admin/customers', labelKey: 'admin.nav.allCustomers' },
      { href: '/admin/customers/billing', labelKey: 'admin.nav.billingShipping' },
    ],
  },
  coupons: {
    id: 'coupons',
    labelKey: 'admin.nav.couponsGroup',
    icon: TicketPercent,
    children: [{ href: '/admin/coupons', labelKey: 'admin.nav.discountCodes' }],
  },
  products: {
    id: 'products',
    labelKey: 'admin.nav.productsGroup',
    icon: Package,
    children: [
      { href: '/admin/products', labelKey: 'admin.nav.allProducts' },
      { href: '/admin/products/new', labelKey: 'admin.nav.addProduct' },
      { href: '/admin/categories', labelKey: 'admin.nav.categories' },
    ],
  },
  inventory: {
    id: 'inventory',
    labelKey: 'admin.nav.inventoryGroup',
    icon: Warehouse,
    children: [{ href: '/admin/inventory', labelKey: 'admin.nav.stockAlerts' }],
  },
  shipping: {
    id: 'shipping',
    labelKey: 'admin.nav.shippingGroup',
    icon: Truck,
    children: [
      { href: '/admin/shipping', labelKey: 'admin.nav.zonesRates' },
      { href: '/admin/shipping/methods', labelKey: 'admin.nav.shippingMethods' },
    ],
  },
  payments: {
    id: 'payments',
    labelKey: 'admin.nav.paymentsGroup',
    icon: CreditCard,
    children: [
      { href: '/admin/payments', labelKey: 'admin.nav.transactions' },
      { href: '/admin/payments/gateways', labelKey: 'admin.nav.paymentGateways' },
    ],
  },
  reports: {
    id: 'reports',
    labelKey: 'admin.nav.reportsGroup',
    icon: BarChart3,
    children: [
      { href: '/admin/reports', labelKey: 'admin.nav.salesReports' },
      { href: '/admin/analytics/advanced', labelKey: 'admin.nav.advancedAnalytics' },
    ],
  },
  tax: {
    id: 'tax',
    labelKey: 'admin.nav.taxGroup',
    icon: Percent,
    children: [{ href: '/admin/tax', labelKey: 'admin.nav.taxRules' }],
  },
  cms: {
    id: 'cms',
    labelKey: 'admin.nav.cmsGroup',
    icon: PanelsTopLeft,
    children: [{ href: '/admin/cms', labelKey: 'admin.nav.siteContent' }],
  },
  notifications: {
    id: 'notifications',
    labelKey: 'admin.nav.notificationsGroup',
    icon: Mail,
    children: [{ href: '/admin/notifications/email', labelKey: 'admin.nav.emailNotifications' }],
  },
  access: {
    id: 'access',
    labelKey: 'admin.nav.accessGroup',
    icon: Shield,
    children: [
      { href: '/admin/users', labelKey: 'admin.nav.staffVendors' },
      { href: '/admin/roles', labelKey: 'admin.nav.rolesPermissions' },
    ],
  },
  settings: {
    id: 'settings',
    labelKey: 'admin.nav.settingsGroup',
    icon: Settings,
    children: [
      { href: '/admin/settings', labelKey: 'admin.nav.storeSettings' },
      { href: '/admin/settings/mobile', labelKey: 'admin.nav.mobileDashboard' },
    ],
  },
} as const satisfies Record<string, AdminNavSection>

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: 'overview',
    labelKey: 'admin.navGroup.overview',
    sections: [SECTIONS.dashboard, SECTIONS.marketplace],
  },
  {
    id: 'sales',
    labelKey: 'admin.navGroup.sales',
    sections: [SECTIONS.orders, SECTIONS.customers, SECTIONS.coupons],
  },
  {
    id: 'catalog',
    labelKey: 'admin.navGroup.catalog',
    sections: [SECTIONS.products, SECTIONS.inventory],
  },
  {
    id: 'fulfillment',
    labelKey: 'admin.navGroup.fulfillment',
    sections: [SECTIONS.shipping],
  },
  {
    id: 'finance',
    labelKey: 'admin.navGroup.finance',
    sections: [SECTIONS.payments, SECTIONS.reports, SECTIONS.tax],
  },
  {
    id: 'content',
    labelKey: 'admin.navGroup.content',
    sections: [SECTIONS.cms, SECTIONS.notifications],
  },
  {
    id: 'administration',
    labelKey: 'admin.navGroup.administration',
    sections: [SECTIONS.access, SECTIONS.settings],
  },
]

/** Flat list (group order) for scripts or legacy use */
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = ADMIN_NAV_GROUPS.flatMap((g) => g.sections)

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function isAdminNavChildActive(
  pathname: string,
  href: string,
  siblings: { href: string }[],
): boolean {
  const matches = siblings.filter((c) => isAdminNavActive(pathname, c.href))
  if (matches.length === 0) return false
  const best = matches.reduce((a, b) => (a.href.length >= b.href.length ? a : b))
  return href === best.href
}
