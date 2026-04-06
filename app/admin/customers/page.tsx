import { createClient } from '@/lib/supabase/server'
import { AdminCustomersContent } from '@/components/admin/admin-customers-content'
import type { Profile } from '@/lib/types'

export const metadata = {
  title: 'Customers | Admin',
}

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  // Fetch customers with their orders count and total spent
  const { data: customers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  const typedCustomers = (customers || []) as Profile[]

  // Fetch orders and payments for each customer
  const customerStats = await Promise.all(
    typedCustomers.map(async (customer) => {
      const [ordersResult, paymentsResult] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', customer.id),
        supabase.from('payments').select('amount').eq('user_id', customer.id).eq('status', 'completed'),
      ])
      
      const totalSpent = (paymentsResult.data || []).reduce((sum, p) => sum + p.amount, 0)
      
      return {
        ...customer,
        ordersCount: ordersResult.count || 0,
        totalSpent,
      }
    })
  )

  return <AdminCustomersContent customers={customerStats} />
}
