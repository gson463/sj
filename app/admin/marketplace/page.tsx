import { createClient } from '@/lib/supabase/server'
import {
  AdminMarketplaceContent,
  type VendorRow,
} from '@/components/admin/admin-marketplace-content'

export const metadata = {
  title: 'Marketplace | Admin',
}

export default async function AdminMarketplacePage() {
  const supabase = await createClient()

  const [{ count: customerCount }, { count: vendorCount }, { data: vendorProfiles }, { data: orders }] =
    await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'vendor'),
      supabase.from('profiles').select('id, full_name, phone').eq('role', 'vendor'),
      supabase.from('orders').select('user_id, amount_paid'),
    ])

  const vendorList = vendorProfiles || []
  const orderRows = orders || []

  const byUser = new Map<string, { orders: number; revenue: number }>()
  for (const o of orderRows as { user_id: string; amount_paid: number }[]) {
    const u = byUser.get(o.user_id) || { orders: 0, revenue: 0 }
    u.orders += 1
    u.revenue += Number(o.amount_paid || 0)
    byUser.set(o.user_id, u)
  }

  const vendors: VendorRow[] = vendorList.map((a) => {
    const s = byUser.get(a.id) || { orders: 0, revenue: 0 }
    return {
      id: a.id,
      full_name: a.full_name,
      phone: a.phone,
      orders: s.orders,
      revenue: s.revenue,
    }
  })

  return (
    <AdminMarketplaceContent
      vendorCount={vendorCount ?? 0}
      customerCount={customerCount ?? 0}
      orderCount={orderRows.length}
      vendors={vendors}
    />
  )
}
