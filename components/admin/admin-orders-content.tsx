'use client'

import { ShoppingBag, CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatTZS, type Order, type Product, type Profile } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface AdminOrdersContentProps {
  orders: (Order & { product: Product; profile: Profile })[]
  stats: {
    total: number
    pending: number
    paid: number
    delivered: number
    revenue: number
  }
}

export function AdminOrdersContent({ orders, stats }: AdminOrdersContentProps) {
  const { t } = useLanguage()

  const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    pending: { label: t("orders.pending"), icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    partial: { label: t("orders.inProgress"), icon: Clock, color: 'bg-blue-100 text-blue-700' },
    paid: { label: t("orders.paid"), icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
    processing: { label: t("orders.processing"), icon: Package, color: 'bg-blue-100 text-blue-700' },
    shipped: { label: t("orders.shipped"), icon: Truck, color: 'bg-purple-100 text-purple-700' },
    delivered: { label: t("orders.delivered"), icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
    cancelled: { label: t("orders.cancelled"), icon: XCircle, color: 'bg-red-100 text-red-700' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("admin.orders")}</h1>
        <p className="text-muted-foreground">{t("admin.manageOrders")}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.all")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.pendingOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.paidOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.deliveredOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.delivered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("admin.revenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatTZS(stats.revenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.ordersList")}</CardTitle>
          <CardDescription>{t("admin.allCustomerOrders")}</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-foreground">{t("admin.noOrdersYet")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending
                const StatusIcon = status.icon
                const progress = order.total_price > 0 
                  ? Math.round((order.amount_paid / order.total_price) * 100) 
                  : 0

                return (
                  <div key={order.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <Badge className={status.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">{order.product?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("admin.customer")}: {order.profile?.full_name || t("admin.noName")} - {order.profile?.phone || t("admin.noPhone")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString('en-US')}
                        </p>
                      </div>

                      <div className="space-y-2 text-right">
                        <div>
                          <p className="text-lg font-bold text-foreground">{formatTZS(order.total_price)}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("admin.paid")}: {formatTZS(order.amount_paid)} ({progress}%)
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Badge variant="outline">
                            {order.payment_type === 'lipa_kidogo' ? t('admin.lipaKidogo') : t('admin.cash')}
                          </Badge>
                          <Badge variant="outline">
                            {order.delivery_method === 'pickup' ? t("admin.pickup") : t("admin.delivery")}
                          </Badge>
                        </div>
                        {(order.status === 'paid' || order.status === 'processing') && (
                          <Button size="sm">{t("admin.prepareDelivery")}</Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
