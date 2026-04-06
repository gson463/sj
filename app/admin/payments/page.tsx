import { createClient } from '@/lib/supabase/server'
import {
  AdminPaymentsContent,
  type PaymentRow,
} from '@/components/admin/admin-payments-content'
import type { Payment, Profile } from '@/lib/types'

export const metadata = {
  title: 'Payments | Admin',
}

export default async function AdminPaymentsPage() {
  const supabase = await createClient()

  const { data: paymentsRaw } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })

  const paymentsList = (paymentsRaw || []) as Payment[]
  const orderIds = [...new Set(paymentsList.map((p) => p.order_id))]
  const userIds = [...new Set(paymentsList.map((p) => p.user_id))]

  const [ordersResult, profilesResult] = await Promise.all([
    orderIds.length
      ? supabase.from('orders').select('id, status, total_price').in('id', orderIds)
      : Promise.resolve({ data: [] as { id: string; status: string; total_price: number }[] }),
    userIds.length
      ? supabase.from('profiles').select('id, full_name, phone').in('id', userIds)
      : Promise.resolve({ data: [] as Profile[] }),
  ])

  const orderMap = new Map((ordersResult.data || []).map((o) => [o.id, o]))
  const profileMap = new Map((profilesResult.data || []).map((p) => [p.id, p]))

  const payments: PaymentRow[] = paymentsList.map((p) => ({
    ...p,
    order: orderMap.get(p.order_id) ?? null,
    profile: profileMap.get(p.user_id) ?? null,
  }))

  const completed = paymentsList.filter((p) => p.status === 'completed')
  const stats = {
    total: paymentsList.length,
    completed: completed.length,
    pending: paymentsList.filter((p) => p.status === 'pending').length,
    failed: paymentsList.filter((p) => p.status === 'failed').length,
    completedAmount: completed.reduce((s, p) => s + Number(p.amount), 0),
  }

  return <AdminPaymentsContent payments={payments} stats={stats} />
}
