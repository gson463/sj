'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTZS } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'
import { Package, ShoppingBag, TrendingUp } from 'lucide-react'

type Props = {
  productCount: number
  orderCount: number
  revenue: number
}

export function VendorOverviewContent({ productCount, orderCount, revenue }: Props) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('vendor.welcome')}</h1>
        <p className="text-muted-foreground">{t('vendor.tagline')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('vendor.statsProducts')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('vendor.statsOrders')}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('vendor.statsRevenue')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTZS(revenue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('vendor.overview')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>{t('vendor.noProductsHint')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
