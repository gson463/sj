'use client'

import { Users, ShoppingBag, CreditCard, TrendingUp, Package, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTZS } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface AdminDashboardContentProps {
  totalCustomers: number
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  totalProducts: number
  activeWallets: number
  totalSavings: number
  recentOrders: Array<{
    id: string
    total_price: number
    amount_paid: number
    status: string
    created_at: string
  }>
}

export function AdminDashboardContent({
  totalCustomers,
  totalRevenue,
  totalOrders,
  pendingOrders,
  totalProducts,
  activeWallets,
  totalSavings,
  recentOrders,
}: AdminDashboardContentProps) {
  const { t } = useLanguage()

  const statusLabels: Record<string, string> = {
    pending: t("orders.pending"),
    partial: t("orders.inProgress"),
    paid: t("orders.paid"),
    delivered: t("orders.delivered"),
    processing: t("orders.processing"),
    shipped: t("orders.shipped"),
    cancelled: t("orders.cancelled"),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("admin.dashboard")}</h1>
        <p className="text-muted-foreground">{t("admin.businessOverview")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.revenue")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatTZS(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">{t("admin.totalPayments")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.customers")}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">{t("admin.registered")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.orders")}
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{pendingOrders} {t("admin.pending")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.products")}
            </CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{t("admin.available")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.lipaKidogo")}
            </CardTitle>
            <Wallet className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeWallets}</div>
            <p className="text-xs text-muted-foreground">{t("admin.inProgress")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.customerSavings")}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatTZS(totalSavings)}</div>
            <p className="text-xs text-muted-foreground">{t("admin.deposited")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.recentOrders")}</CardTitle>
            <CardDescription>{t("admin.last5Orders")}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">{t("admin.noOrdersYet")}</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-US')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{formatTZS(order.total_price)}</p>
                      <span className={`text-xs font-medium ${
                        order.status === 'delivered' ? 'text-green-600' :
                        order.status === 'paid' ? 'text-blue-600' :
                        order.status === 'partial' ? 'text-yellow-600' :
                        'text-muted-foreground'
                      }`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.todaySummary")}</CardTitle>
            <CardDescription>{t("admin.todayActivity")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-800">{t("admin.todayRevenue")}</p>
                    <p className="text-2xl font-bold text-green-600">{formatTZS(0)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-800">{t("admin.todayOrders")}</p>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-purple-50 p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-800">{t("admin.newCustomers")}</p>
                    <p className="text-2xl font-bold text-purple-600">0</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
