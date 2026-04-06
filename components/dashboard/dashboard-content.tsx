"use client"

import Link from 'next/link'
import { Wallet, ShoppingBag, CreditCard, TrendingUp, ArrowRight, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatTZS, calculateProgress, type Order, type CustomerWallet, type Payment } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

interface DashboardContentProps {
  wallets: (CustomerWallet & { product: { name: string; price: number } })[]
  orders: Order[]
  payments: Payment[]
}

export function DashboardContent({ wallets, orders, payments }: DashboardContentProps) {
  const { t } = useLanguage()

  // Calculate totals
  const totalSaved = wallets.reduce((sum, w) => sum + w.current_balance, 0)
  const totalTarget = wallets.reduce((sum, w) => sum + w.target_amount, 0)
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  const statusLabels: Record<string, string> = {
    pending: t("orders.pending"),
    partial: t("orders.inProgress"),
    paid: t("orders.paid"),
    delivered: t("orders.delivered"),
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("dashboard.welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboard.welcomeSubtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/shop">
            <Smartphone className="mr-2 h-4 w-4" />
            {t("dashboard.startBuying")}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.mySavings")}
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatTZS(totalSaved)}</div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.outOf")} {formatTZS(totalTarget)} {t("dashboard.needed")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.phonesInProgress")}
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{wallets.length}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.phonesYouArePaying")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalPaid")}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatTZS(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.inPayments")} {payments.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.allOrders")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{orders.length}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.allPhonesYouBought")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Wallets / Lipa Kidogo Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("dashboard.mySavingsPhones")}</CardTitle>
            <CardDescription>{t("dashboard.phonesLipaKidogo")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/wallets">
              {t("dashboard.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {wallets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-foreground">{t("dashboard.noActiveSavings")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("dashboard.startFirstPhone")}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/shop">{t("dashboard.viewPhones")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet) => {
                const progress = calculateProgress(wallet.current_balance, wallet.target_amount)
                const remaining = wallet.target_amount - wallet.current_balance
                return (
                  <div key={wallet.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{wallet.product?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("dashboard.remainingAmount")} {formatTZS(remaining)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{progress}%</p>
                        <p className="text-xs text-muted-foreground">{t("dashboard.completed")}</p>
                      </div>
                    </div>
                    <Progress value={progress} className="mt-3 h-2" />
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatTZS(wallet.current_balance)} / {formatTZS(wallet.target_amount)}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/wallets/${wallet.id}/pay`}>
                          {t("dashboard.payNow")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("dashboard.recentOrders")}</CardTitle>
            <CardDescription>{t("dashboard.phonesYouBought")}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">
              {t("dashboard.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              {t("dashboard.noOrdersYet")}
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-foreground">{order.product?.name || 'Phone'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
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
    </div>
  )
}
