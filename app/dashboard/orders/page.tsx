import { createClient } from '@/lib/supabase/server'
import { type Order, type Product } from '@/lib/types'
import { OrdersContent } from '@/components/dashboard/orders-content'

export const metadata = {
  title: 'My Orders',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const typedOrders = (orders || []) as (Order & { product: Product })[]

  return <OrdersContent orders={typedOrders} />
}
