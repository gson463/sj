'use client'

import { Store, Users, ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTZS } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export type VendorRow = {
  id: string
  full_name: string | null
  phone: string | null
  orders: number
  revenue: number
}

interface Props {
  vendorCount: number
  customerCount: number
  orderCount: number
  vendors: VendorRow[]
}

export function AdminMarketplaceContent({
  vendorCount,
  customerCount,
  orderCount,
  vendors,
}: Props) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.marketplace.title')}</h1>
          <p className="text-muted-foreground">{t('admin.placeholders.marketplace.body')}</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Store className="h-3 w-3" />
          {t('admin.badgeMultiVendor')}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendors</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{vendorCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('admin.customers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{customerCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('admin.totalOrders')}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orderCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor accounts</CardTitle>
          <CardDescription>
            Profiles with the &quot;vendor&quot; role. Assign this role to onboard marketplace sellers; commission
            rules can be layered on next.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {vendors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No vendor profiles yet.</p>
          ) : (
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Phone</th>
                  <th className="pb-2 pr-4 font-medium">Orders</th>
                  <th className="pb-2 font-medium">Revenue (paid)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td className="py-2 pr-4 font-medium">{v.full_name || '—'}</td>
                    <td className="py-2 pr-4">{v.phone || '—'}</td>
                    <td className="py-2 pr-4 tabular-nums">{v.orders}</td>
                    <td className="py-2 tabular-nums">{formatTZS(v.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
