'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTZS, type Order, type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { ShoppingBag } from 'lucide-react'

export type VendorOrderRow = Omit<Order, 'product'> & { product: Product | null }

type Props = {
  orders: VendorOrderRow[]
}

export function VendorOrdersContent({ orders }: Props) {
  const { t } = useLanguage()

  const statusLabel: Record<string, string> = {
    pending: t('orders.pending'),
    partial: t('orders.partial'),
    paid: t('orders.paid'),
    processing: t('orders.processing'),
    shipped: t('orders.shipped'),
    delivered: t('orders.delivered'),
    cancelled: t('orders.cancelled'),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('vendor.orders')}</h1>
        <p className="text-muted-foreground">{t('vendor.statsOrders')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {t('vendor.orders')}
          </CardTitle>
          <CardDescription>
            {orders.length} order{orders.length !== 1 ? 's' : ''} containing your listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium text-foreground">{t('vendor.noOrders')}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t('vendor.noProductsHint')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">{t('vendor.tableCustomerOrder')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('vendor.tableProduct')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('vendor.tableDate')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('vendor.tableTotal')}</th>
                    <th className="pb-2 pr-4 font-medium">{t('vendor.tablePaid')}</th>
                    <th className="pb-2 font-medium">{t('vendor.orderStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border/60">
                      <td className="py-3 pr-4 font-mono text-xs text-foreground">{o.id.slice(0, 8)}…</td>
                      <td className="py-3 pr-4">{o.product?.name ?? '—'}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4">{formatTZS(Number(o.total_price))}</td>
                      <td className="py-3 pr-4">{formatTZS(Number(o.amount_paid))}</td>
                      <td className="py-3">
                        <Badge variant="outline">{statusLabel[o.status] ?? o.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
