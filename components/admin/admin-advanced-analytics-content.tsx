'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTZS } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export type TopProductRow = { name: string; orders: number; revenue: number }
export type CategoryRow = { name: string; revenue: number; orders: number }

interface Props {
  topProducts: TopProductRow[]
  categoryBreakdown: CategoryRow[]
  aov: number
  repeatCustomerRate: number
}

export function AdminAdvancedAnalyticsContent({
  topProducts,
  categoryBreakdown,
  aov,
  repeatCustomerRate,
}: Props) {
  const { t } = useLanguage()

  const topChart = topProducts.slice(0, 8).map((p) => ({
    name: p.name.length > 18 ? `${p.name.slice(0, 18)}…` : p.name,
    revenue: p.revenue,
  }))

  const catChart = categoryBreakdown.slice(0, 8).map((c) => ({
    name: c.name.length > 14 ? `${c.name.slice(0, 14)}…` : c.name,
    revenue: c.revenue,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.analyticsAdvanced.title')}</h1>
        <p className="text-muted-foreground">{t('admin.placeholders.analyticsAdvanced.body')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average order value</CardTitle>
            <CardDescription>From completed order amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{formatTZS(aov)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repeat customers</CardTitle>
            <CardDescription>Share with 2+ orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{Math.round(repeatCustomerRate * 100)}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
            <CardDescription>By revenue (all time)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {topChart.length === 0 ? (
              <p className="text-sm text-muted-foreground">No product data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topChart} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => formatTZS(v)} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by category</CardTitle>
            <CardDescription>Allocated from product categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {catChart.length === 0 ? (
              <p className="text-sm text-muted-foreground">No category breakdown yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip formatter={(v: number) => formatTZS(v)} />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product leaderboard</CardTitle>
          <CardDescription>Full list by orders and revenue</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Product</th>
                <th className="pb-2 pr-4 font-medium">Orders</th>
                <th className="pb-2 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topProducts.map((p) => (
                <tr key={p.name}>
                  <td className="py-2 pr-4 font-medium">{p.name}</td>
                  <td className="py-2 pr-4 tabular-nums">{p.orders}</td>
                  <td className="py-2 tabular-nums">{formatTZS(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
