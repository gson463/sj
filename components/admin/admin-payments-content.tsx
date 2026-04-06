'use client'

import { CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTZS, type Payment, type Order, type Profile } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export type PaymentRow = Omit<Payment, 'order'> & {
  order?: Pick<Order, 'id' | 'status' | 'total_price'> | null
  profile?: Pick<Profile, 'id' | 'full_name' | 'phone'> | null
}

interface AdminPaymentsContentProps {
  payments: PaymentRow[]
  stats: {
    total: number
    completed: number
    pending: number
    failed: number
    completedAmount: number
  }
}

function formatMethod(method: string) {
  const m = method.toLowerCase()
  const map: Record<string, string> = {
    mpesa: 'M-Pesa',
    tigopesa: 'Tigo Pesa',
    airtelmoney: 'Airtel Money',
    halopesa: 'HaloPesa',
    bank: 'Bank',
    card: 'Card',
    cash: 'Cash',
  }
  return map[m] ?? method.replace(/_/g, ' ')
}

export function AdminPaymentsContent({ payments, stats }: AdminPaymentsContentProps) {
  const { t } = useLanguage()

  const statusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          {t('admin.paymentsCompleted')}
        </Badge>
      )
    }
    if (status === 'failed') {
      return (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="mr-1 h-3 w-3" />
          {t('admin.paymentsFailed')}
        </Badge>
      )
    }
    return (
      <Badge className="bg-amber-100 text-amber-800">
        <Clock className="mr-1 h-3 w-3" />
        {t('admin.paymentsPending')}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.payments')}</h1>
        <p className="text-muted-foreground">{t('admin.managePayments')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('admin.all')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('admin.paymentsCompleted')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('admin.paymentsPending')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('admin.paymentsFailed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('admin.revenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tabular-nums">{formatTZS(stats.completedAmount)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.paymentsList')}</CardTitle>
          <CardDescription>{t('admin.paymentRecords')}</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-foreground">{t('admin.noPaymentsYet')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">{t('admin.paymentDate')}</th>
                    <th className="pb-3 pr-4 font-medium">{t('admin.customer')}</th>
                    <th className="pb-3 pr-4 font-medium">{t('admin.orderShort')}</th>
                    <th className="pb-3 pr-4 font-medium">{t('admin.paymentAmount')}</th>
                    <th className="pb-3 pr-4 font-medium">{t('admin.paymentMethod')}</th>
                    <th className="pb-3 pr-4 font-medium">{t('admin.transactionRef')}</th>
                    <th className="pb-3 font-medium">{t('admin.paymentStatusLabel')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((p) => (
                    <tr key={p.id} className="text-foreground">
                      <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                        {new Date(p.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-medium">{p.profile?.full_name || '—'}</div>
                        <div className="text-xs text-muted-foreground">{p.profile?.phone || ''}</div>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs">
                        #{p.order_id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 pr-4 font-semibold tabular-nums">{formatTZS(Number(p.amount))}</td>
                      <td className="py-3 pr-4">{formatMethod(p.payment_method)}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                        {p.transaction_ref || '—'}
                      </td>
                      <td className="py-3">{statusBadge(p.status)}</td>
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
