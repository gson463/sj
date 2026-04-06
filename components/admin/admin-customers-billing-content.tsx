'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTZS, type Profile } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export type BillingRow = Profile & {
  ordersCount: number
  totalSpent: number
}

interface Props {
  customers: BillingRow[]
}

export function AdminCustomersBillingContent({ customers }: Props) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.customerBilling.title')}</h1>
        <p className="text-muted-foreground">{t('admin.placeholders.customerBilling.body')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Addresses & profiles</CardTitle>
          <CardDescription>
            Phone, city, and address on file for each customer. Totals reflect completed payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">{t('admin.customer')}</th>
                <th className="pb-2 pr-4 font-medium">Phone</th>
                <th className="pb-2 pr-4 font-medium">City</th>
                <th className="pb-2 pr-4 font-medium">Address</th>
                <th className="pb-2 pr-4 font-medium">{t('admin.ordersLabel')}</th>
                <th className="pb-2 font-medium">{t('admin.totalPaid')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="py-2 pr-4 font-medium">{c.full_name || t('admin.noName')}</td>
                  <td className="py-2 pr-4">{c.phone || t('admin.noPhone')}</td>
                  <td className="py-2 pr-4">{c.city || '—'}</td>
                  <td className="max-w-[200px] truncate py-2 pr-4 text-muted-foreground">{c.address || '—'}</td>
                  <td className="py-2 pr-4 tabular-nums">{c.ordersCount}</td>
                  <td className="py-2 tabular-nums">{formatTZS(c.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
