import { createClient } from '@/lib/supabase/server'
import { AdminOrderRefundsContent } from '@/components/admin/admin-order-refunds-content'
import type { Order, Product, Profile } from '@/lib/types'

export const metadata = {
  title: 'Refunds & notes | Admin',
}

export default async function AdminOrderRefundsPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(*), profile:profiles(*)')
    .order('created_at', { ascending: false })

  const all = (orders || []) as (Order & { product: Product; profile: Profile })[]

  const flagged = all.filter((o) => {
    if (o.status === 'cancelled') return true
    const n = (o.notes || '').toLowerCase()
    return n.includes('refund') || n.includes('return') || n.includes('chargeback')
  })

  return <AdminOrderRefundsContent flagged={flagged} />
}
