import { format, subDays, eachDayOfInterval, parseISO, startOfDay } from 'date-fns'

export type DailyPoint = {
  date: string
  label: string
  revenue: number
  orders: number
}

/** Revenue from completed payments; order counts from orders table (same day). */
export function buildDailySeries(
  days: number,
  orders: { created_at: string }[],
  payments: { created_at: string; amount: number | string }[],
): DailyPoint[] {
  const end = startOfDay(new Date())
  const start = subDays(end, days - 1)
  const interval = eachDayOfInterval({ start, end })

  const orderCountByDay = new Map<string, number>()
  const paymentRevenueByDay = new Map<string, number>()

  for (const o of orders) {
    const d = format(parseISO(o.created_at), 'yyyy-MM-dd')
    orderCountByDay.set(d, (orderCountByDay.get(d) || 0) + 1)
  }

  for (const p of payments) {
    const d = format(parseISO(p.created_at), 'yyyy-MM-dd')
    paymentRevenueByDay.set(d, (paymentRevenueByDay.get(d) || 0) + Number(p.amount))
  }

  return interval.map((day) => {
    const key = format(day, 'yyyy-MM-dd')
    return {
      date: key,
      label: format(day, 'MMM d'),
      revenue: paymentRevenueByDay.get(key) || 0,
      orders: orderCountByDay.get(key) || 0,
    }
  })
}
