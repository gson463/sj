import { createClient } from '@/lib/supabase/server'
import { AdminDashboardContent } from '@/components/admin/admin-dashboard-content'

export const metadata = {
  title: 'Admin Dashboard | SIMU JIJI',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch stats
  const [
    customersResult,
    ordersResult,
    paymentsResult,
    productsResult,
    walletsResult,
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('id, total_price, amount_paid, status, created_at'),
    supabase.from('payments').select('amount, status').eq('status', 'completed'),
    supabase.from('products').select('id, stock', { count: 'exact' }).eq('active', true),
    supabase.from('customer_wallets').select('current_balance, target_amount, status').eq('status', 'active'),
  ])

  const totalCustomers = customersResult.count || 0
  const orders = ordersResult.data || []
  const payments = paymentsResult.data || []
  const totalProducts = productsResult.count || 0
  const wallets = walletsResult.data || []

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'partial').length
  const activeWallets = wallets.length
  const totalSavings = wallets.reduce((sum, w) => sum + w.current_balance, 0)

  // Recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <AdminDashboardContent
      totalCustomers={totalCustomers}
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      pendingOrders={pendingOrders}
      totalProducts={totalProducts}
      activeWallets={activeWallets}
      totalSavings={totalSavings}
      recentOrders={recentOrders}
    />
  )
}
