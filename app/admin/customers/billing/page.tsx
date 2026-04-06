import { createClient } from '@/lib/supabase/server'
import {
  AdminCustomersBillingContent,
  type BillingRow,
} from '@/components/admin/admin-customers-billing-content'
import type { Profile } from '@/lib/types'

export const metadata = {
  title: 'Billing & shipping | Admin',
}

export default async function AdminCustomersBillingPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  const typed = (customers || []) as Profile[]

  const enriched: BillingRow[] = await Promise.all(
    typed.map(async (customer) => {
      const [ordersResult, paymentsResult] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', customer.id),
        supabase.from('payments').select('amount').eq('user_id', customer.id).eq('status', 'completed'),
      ])
      const totalSpent = (paymentsResult.data || []).reduce((s, p) => s + Number(p.amount), 0)
      return {
        ...customer,
        ordersCount: ordersResult.count || 0,
        totalSpent,
      }
    }),
  )

  return <AdminCustomersBillingContent customers={enriched} />
}
