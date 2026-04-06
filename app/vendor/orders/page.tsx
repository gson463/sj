import { createClient } from '@/lib/supabase/server'
import { VendorOrdersContent, type VendorOrderRow } from '@/components/vendor/vendor-orders-content'
import type { Order, Product } from '@/lib/types'

export const metadata = {
  title: 'Orders | Vendor',
}

export default async function VendorOrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data: productRows } = await supabase.from('products').select('id').eq('seller_id', user.id)

  const productIds = (productRows ?? []).map((r) => r.id)

  if (productIds.length === 0) {
    return <VendorOrdersContent orders={[]} />
  }

  const { data: orderRows } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .in('product_id', productIds)
    .order('created_at', { ascending: false })

  const raw = orderRows ?? []
  const orders: VendorOrderRow[] = raw.map((row) => {
    const r = row as Order & { product: Product | Product[] | null }
    const prod = r.product
    const product =
      Array.isArray(prod) ? prod[0] ?? null : prod && typeof prod === 'object' ? (prod as Product) : null
    return { ...r, product }
  })

  return <VendorOrdersContent orders={orders} />
}
