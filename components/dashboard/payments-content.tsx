"use client"

import { CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTZS, type Payment, type Order, type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface PaymentsContentProps {
  payments: (Payment & { order: Order & { product: Product } })[]
}

export function PaymentsContent({ payments }: PaymentsContentProps) {
  const { t } = useLanguage()

  const paymentMethodLabels: Record<string, string> = {
    mpesa: t("payment.mpesa"),
    tigopesa: t("payment.tigopesa"),
    airtelmoney: t("payment.airtelmoney"),
    halopesa: t("payment.halopesa"),
    bank: t("payment.bank"),
    card: t("payment.card"),
    cash: t("payment.cash"),
  }

  const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    pending: { label: t("orders.pending"), icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    completed: { label: t("wallet.completed"), icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
    failed: { label: t("orders.cancelled"), icon: XCircle, color: 'bg-red-100 text-red-700' },
  }

  // Calculate totals
  const completedPayments = payments.filter(p => p.status === 'completed')
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("dashboard.payments")}</h1>
        <p className="text-muted-foreground">{t("dashboard.phonesLipaKidogo")}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalPaid")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{formatTZS(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("wallet.completed")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{completedPayments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.allOrders")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{payments.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="font-medium text-foreground">{t("common.noResults")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.payments")}</CardTitle>
            <CardDescription>{t("wallet.history")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => {
                const status = statusConfig[payment.status] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <div key={payment.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {payment.order?.product?.name || 'Phone'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{paymentMethodLabels[payment.payment_method]}</span>
                          <span>-</span>
                          <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                        </div>
                        {payment.transaction_ref && (
                          <p className="text-xs text-muted-foreground">
                            Ref: {payment.transaction_ref}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{formatTZS(payment.amount)}</p>
                      <Badge className={status.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
