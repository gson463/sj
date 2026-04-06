import { createClient } from '@/lib/supabase/server'
import { AdminAnalyticsContent } from '@/components/admin/admin-analytics-content'
import { buildDailySeries } from '@/lib/data/admin-metrics'

export const metadata = {
  title: 'Analytics | Admin',
}

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const [{ data: payments }, { data: orders }] = await Promise.all([
    supabase.from('payments').select('amount, created_at').eq('status', 'completed'),
    supabase.from('orders').select('created_at'),
  ])

  const p = payments || []
  const o = orders || []
  const series = buildDailySeries(14, o, p)

  const sumLast = (n: number) => {
    const slice = series.slice(-n)
    return {
      revenue: slice.reduce((s, x) => s + x.revenue, 0),
      orders: slice.reduce((s, x) => s + x.orders, 0),
    }
  }

  const last14 = sumLast(14)
  const last7 = sumLast(7)

  return (
    <AdminAnalyticsContent
      series={series}
      totals={{
        revenue14: last14.revenue,
        orders14: last14.orders,
        revenue7: last7.revenue,
        orders7: last7.orders,
      }}
    />
  )
}
