"use client"

import Link from 'next/link'
import { ShoppingBag, Package, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatTZS, type Order, type Product } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface OrdersContentProps {
  orders: (Order & { product: Product })[]
}

export function OrdersContent({ orders }: OrdersContentProps) {
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("orders.title")}</h1>
          <p className="text-muted-foreground">{t("common.orderHistory")}</p>
        </div>
        <Button asChild>
          <Link href="/shop">
            <ShoppingBag className="mr-2 h-4 w-4" />
            {t("common.buyAnotherPhone")}
          </Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="font-medium text-foreground">{t("common.noOrders")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("common.startBuyingFirst")}
            </p>
            <Button className="mt-4" asChild>
              <Link href="/shop">{t("dashboard.viewPhones")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = status.icon
            const progress = order.total_price > 0 
              ? Math.round((order.amount_paid / order.total_price) * 100) 
              : 0

            return (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-base">{order.product?.name}</CardTitle>
                      <CardDescription>
                        {t("orders.orderNumber")} #{order.id.slice(0, 8).toUpperCase()} - {' '}
                        {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={status.color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{t("orders.price")}:</span>
                        <span className="font-medium text-foreground">{formatTZS(order.total_price)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{t("orders.youPaid")}:</span>
                        <span className="font-medium text-foreground">{formatTZS(order.amount_paid)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{t("orders.method")}:</span>
                        <span className="text-foreground">
                          {order.payment_type === 'lipa_kidogo' ? 'Lipa Kidogo Kidogo' : 'Cash'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{t("orders.deliveryMethod")}:</span>
                        <span className="text-foreground">
                          {order.delivery_method === 'pickup' ? t("orders.pickupStore") : t("orders.homeDelivery")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {order.payment_type === 'lipa_kidogo' && order.status !== 'paid' && order.status !== 'delivered' && (
                        <>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{t("orders.progress")}</p>
                            <p className="text-lg font-bold text-primary">{progress}%</p>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/orders/${order.id}/pay`}>
                              {t("dashboard.payNow")}
                            </Link>
                          </Button>
                        </>
                      )}
                      {(order.status === 'paid' || order.status === 'delivered') && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{t("orders.total")}</p>
                          <p className="text-lg font-bold text-green-600">{formatTZS(order.amount_paid)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
