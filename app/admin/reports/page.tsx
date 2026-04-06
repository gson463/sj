import { createClient } from '@/lib/supabase/server'
import {
  AdminReportsContent,
  type ReportPeriodStats,
} from '@/components/admin/admin-reports-content'

export const metadata = {
  title: 'Reports | Admin',
}

function sumPayments(rows: { amount: number | string }[]): number {
  return rows.reduce((s, p) => s + Number(p.amount), 0)
}

function sumWalletBalance(rows: { current_balance: number | string }[]): number {
  return rows.reduce((s, w) => s + Number(w.current_balance), 0)
}

function buildPeriodStats(
  cutoffMs: number | null,
  payments: { amount: number | string; created_at: string }[],
  orders: { created_at: string }[],
  customers: { created_at: string }[],
  wallets: { current_balance: number | string; created_at: string }[],
): ReportPeriodStats {
  const inPeriod = <T extends { created_at: string }>(rows: T[]) =>
    cutoffMs === null
      ? rows
      : rows.filter((r) => new Date(r.created_at).getTime() >= cutoffMs)

  const p = inPeriod(payments)
  const o = inPeriod(orders)
  const c = inPeriod(customers)
  const w = inPeriod(wallets)

  return {
    revenue: sumPayments(p),
    ordersCount: o.length,
    newCustomers: c.length,
    activeWallets: w.length,
    totalSavedLipaKidogo: sumWalletBalance(w),
  }
}

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)
  const cutoffMs = cutoff.getTime()

  const [paymentsRes, ordersRes, profilesRes, walletsRes] = await Promise.all([
    supabase.from('payments').select('amount, created_at').eq('status', 'completed'),
    supabase.from('orders').select('created_at'),
    supabase.from('profiles').select('created_at').eq('role', 'customer'),
    supabase.from('customer_wallets').select('current_balance, created_at').eq('status', 'active'),
  ])

  const payments = paymentsRes.data || []
  const orders = ordersRes.data || []
  const customers = profilesRes.data || []
  const wallets = walletsRes.data || []

  const last30 = buildPeriodStats(cutoffMs, payments, orders, customers, wallets)
  const allTime = buildPeriodStats(null, payments, orders, customers, wallets)

  return <AdminReportsContent last30={last30} allTime={allTime} />
}
