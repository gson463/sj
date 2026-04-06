'use client'

import { AlertTriangle, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTZS, type Product, type Category } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export type StockMovementRow = {
  id: string
  qty_delta: number
  reason: string
  ref: string | null
  created_at: string
  product: { name: string } | null
}

interface Props {
  products: (Product & { category: Category | null })[]
  movements: StockMovementRow[]
  lowStockCount: number
}

export function AdminInventoryContent({ products, movements, lowStockCount }: Props) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.placeholders.inventory.title')}</h1>
        <p className="text-muted-foreground">{t('admin.placeholders.inventory.body')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SKUs tracked</CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200/80 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">Low stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{lowStockCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent movements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{movements.length}</p>
            <p className="text-xs text-muted-foreground">Last 40 events</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock levels</CardTitle>
          <CardDescription>Products at or below their low-stock threshold.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Product</th>
                <th className="pb-2 pr-4 font-medium">Category</th>
                <th className="pb-2 pr-4 font-medium">Stock</th>
                <th className="pb-2 pr-4 font-medium">Threshold</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => {
                const threshold = p.low_stock_threshold ?? 5
                const low = p.stock <= threshold
                return (
                  <tr key={p.id}>
                    <td className="py-2 pr-4 font-medium">{p.name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{p.category?.name || '—'}</td>
                    <td className="py-2 pr-4 tabular-nums">{p.stock}</td>
                    <td className="py-2 pr-4 tabular-nums">{threshold}</td>
                    <td className="py-2">
                      {low ? (
                        <Badge variant="destructive" className="font-normal">
                          Low
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="font-normal">
                          OK
                        </Badge>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stock movements</CardTitle>
          <CardDescription>Audit trail from sales and adjustments.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {movements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No movements recorded (run product management migration).</p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">When</th>
                  <th className="pb-2 pr-4 font-medium">Product</th>
                  <th className="pb-2 pr-4 font-medium">Δ</th>
                  <th className="pb-2 pr-4 font-medium">Reason</th>
                  <th className="pb-2 font-medium">Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4">{m.product?.name || '—'}</td>
                    <td className="py-2 pr-4 tabular-nums font-medium">{m.qty_delta}</td>
                    <td className="py-2 pr-4">{m.reason}</td>
                    <td className="max-w-[120px] truncate py-2 font-mono text-xs">{m.ref || '—'}</td>
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
