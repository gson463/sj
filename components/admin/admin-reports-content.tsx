'use client'

import { BarChart3, TrendingUp, ShoppingBag, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTZS } from '@/lib/types'
import { useLanguage } from '@/lib/i18n/language-context'

export interface ReportPeriodStats {
  revenue: number
  ordersCount: number
  newCustomers: number
  activeWallets: number
  totalSavedLipaKidogo: number
}

interface AdminReportsContentProps {
  last30: ReportPeriodStats
  allTime: ReportPeriodStats
}

export function AdminReportsContent({ last30, allTime }: AdminReportsContentProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.reportsTitle')}</h1>
        <p className="text-muted-foreground">{t('admin.reportsSubtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportColumn title={t('admin.reportsLast30')} stats={last30} />
        <ReportColumn title={t('admin.reportsAllTime')} stats={allTime} />
      </div>

      <Card className="border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            {t('admin.reportsTitle')}
          </CardTitle>
          <CardDescription>{t('admin.reportsNote')}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

function ReportColumn({ title, stats }: { title: string; stats: ReportPeriodStats }) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Metric
          icon={TrendingUp}
          label={t('admin.reportsRevenue')}
          value={formatTZS(stats.revenue)}
        />
        <Metric
          icon={ShoppingBag}
          label={t('admin.reportsOrdersCount')}
          value={String(stats.ordersCount)}
        />
        <Metric
          icon={Users}
          label={t('admin.reportsNewCustomers')}
          value={String(stats.newCustomers)}
        />
        <Metric
          icon={Wallet}
          label={t('admin.reportsWalletSavings')}
          value={String(stats.activeWallets)}
          sub={t('admin.reportsTotalSaved') + ': ' + formatTZS(stats.totalSavedLipaKidogo)}
        />
      </CardContent>
    </Card>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </div>
      <div className="mt-1 text-xl font-semibold tabular-nums text-foreground">{value}</div>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  )
}
