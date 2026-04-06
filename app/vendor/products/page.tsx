import { createClient } from '@/lib/supabase/server'
import { VendorProductsContent } from '@/components/vendor/vendor-products-content'
import type { Product } from '@/lib/types'
import type { Category } from '@/lib/types'

export const metadata = {
  title: 'My listings | Vendor',
}

export default async function VendorProductsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data: rows } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('seller_id', user.id)
    .order('updated_at', { ascending: false })

  const products = (rows ?? []) as (Product & { category: Category | null })[]

  return <VendorProductsContent products={products} />
}
