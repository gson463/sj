import { createClient } from '@/lib/supabase/server'
import { AdminOrdersContent } from '@/components/admin/admin-orders-content'
import type { Order, Product, Profile } from '@/lib/types'

export const metadata = {
  title: 'Orders | Admin',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(*), profile:profiles(*)')
    .order('created_at', { ascending: false })

  const typedOrders = (orders || []) as (Order & { product: Product; profile: Profile })[]

  // Stats
  const stats = {
    total: typedOrders.length,
    pending: typedOrders.filter(o => o.status === 'pending' || o.status === 'partial').length,
    paid: typedOrders.filter(o => o.status === 'paid').length,
    delivered: typedOrders.filter(o => o.status === 'delivered').length,
    revenue: typedOrders.reduce((sum, o) => sum + o.amount_paid, 0),
  }

  return <AdminOrdersContent orders={typedOrders} stats={stats} />
}
