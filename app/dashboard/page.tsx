import { createClient } from '@/lib/supabase/server'
import { type Order, type CustomerWallet, type Payment } from '@/lib/types'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch customer data
  const [walletsResult, ordersResult, paymentsResult] = await Promise.all([
    supabase
      .from('customer_wallets')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
      .eq('status', 'active'),
    supabase
      .from('orders')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed'),
  ])

  const wallets = (walletsResult.data || []) as (CustomerWallet & { product: { name: string; price: number } })[]
  const orders = (ordersResult.data || []) as Order[]
  const payments = (paymentsResult.data || []) as Payment[]

  return <DashboardContent wallets={wallets} orders={orders} payments={payments} />
}
