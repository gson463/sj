import { createClient } from '@/lib/supabase/server'
import { AdminInventoryContent, type StockMovementRow } from '@/components/admin/admin-inventory-content'
import type { Category, Product } from '@/lib/types'

export const metadata = {
  title: 'Inventory | Admin',
}

export default async function AdminInventoryPage() {
  const supabase = await createClient()

  const { data: productsRaw } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('stock', { ascending: true })

  const products = (productsRaw || []) as (Product & { category: Category | null })[]

  const lowStockCount = products.filter((p) => {
    const t = p.low_stock_threshold ?? 5
    return p.stock <= t
  }).length

  let movements: StockMovementRow[] = []
  const movRes = await supabase
    .from('product_stock_movements')
    .select('id, qty_delta, reason, ref, created_at, product:products(name)')
    .order('created_at', { ascending: false })
    .limit(40)

  if (!movRes.error && movRes.data) {
    movements = movRes.data as unknown as StockMovementRow[]
  }

  return (
    <AdminInventoryContent products={products} movements={movements} lowStockCount={lowStockCount} />
  )
}
