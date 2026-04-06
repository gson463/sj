import { createClient } from '@/lib/supabase/server'
import { VendorOverviewContent } from '@/components/vendor/vendor-overview-content'

export const metadata = {
  title: 'Vendor | SIMU JIJI',
}

export default async function VendorHomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data: productRows } = await supabase.from('products').select('id').eq('seller_id', user.id)

  const productIds = (productRows ?? []).map((r) => r.id)
  const productCount = productIds.length

  let orderCount = 0
  let revenue = 0

  if (productIds.length > 0) {
    const { data: orders } = await supabase
      .from('orders')
      .select('amount_paid')
      .in('product_id', productIds)

    for (const o of orders ?? []) {
      orderCount += 1
      revenue += Number(o.amount_paid ?? 0)
    }
  }

  return (
    <VendorOverviewContent productCount={productCount} orderCount={orderCount} revenue={revenue} />
  )
}
