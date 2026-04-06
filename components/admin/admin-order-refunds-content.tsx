'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTZS, type Order, type Product, type Profile } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

type OrderRow = Order & { product: Product; profile: Profile }

interface Props {
  flagged: OrderRow[]
}

export function AdminOrderRefundsContent({ flagged }: Props) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.orderRefunds.title')}</h1>
        <p className="text-muted-foreground">{t('admin.placeholders.orderRefunds.body')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders & cancellations</CardTitle>
          <CardDescription>
            Cancelled orders and rows whose notes mention refunds. Use the main orders list to update status and
            notes.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {flagged.length === 0 ? (
            <p className="text-sm text-muted-foreground">No refund or cancellation rows match yet.</p>
          ) : (
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Date</th>
                  <th className="pb-2 pr-4 font-medium">{t('admin.customer')}</th>
                  <th className="pb-2 pr-4 font-medium">Product</th>
                  <th className="pb-2 pr-4 font-medium">Paid</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {flagged.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4">{o.profile?.full_name || '—'}</td>
                    <td className="py-2 pr-4">{o.product?.name || '—'}</td>
                    <td className="py-2 pr-4 tabular-nums">{formatTZS(o.amount_paid)}</td>
                    <td className="py-2 pr-4">
                      <Badge variant="secondary">{o.status}</Badge>
                    </td>
                    <td className="max-w-[220px] truncate py-2 text-muted-foreground">{o.notes || '—'}</td>
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
