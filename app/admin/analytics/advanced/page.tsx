import { createClient } from '@/lib/supabase/server'
import {
  AdminAdvancedAnalyticsContent,
  type TopProductRow,
  type CategoryRow,
} from '@/components/admin/admin-advanced-analytics-content'

export const metadata = {
  title: 'Advanced analytics | Admin',
}

export default async function AdminAdvancedAnalyticsPage() {
  const supabase = await createClient()

  const { data: ordersRaw } = await supabase
    .from('orders')
    .select('amount_paid, user_id, product_id')

  const orders = (ordersRaw || []) as {
    amount_paid: number
    user_id: string
    product_id: string
  }[]

  const productIds = [...new Set(orders.map((o) => o.product_id))]
  const { data: productsRaw } =
    productIds.length > 0
      ? await supabase
          .from('products')
          .select('id, name, category_id, category:categories(name)')
          .in('id', productIds)
      : { data: [] }

  const products = (productsRaw || []) as unknown as {
    id: string
    name: string
    category_id: string | null
    category: { name: string } | null | { name: string }[]
  }[]

  const productMap = new Map(products.map((p) => [p.id, p]))

  const byProduct = new Map<string, { name: string; orders: number; revenue: number }>()
  const byCat = new Map<string, { revenue: number; orders: number }>()
  const ordersByUser = new Map<string, number>()

  for (const row of orders) {
    const product = productMap.get(row.product_id)
    const name = product?.name || 'Unknown'
    const cur = byProduct.get(name) || { name, orders: 0, revenue: 0 }
    cur.orders += 1
    cur.revenue += Number(row.amount_paid || 0)
    byProduct.set(name, cur)

    const cat =
      product?.category &&
      !Array.isArray(product.category) &&
      'name' in product.category
        ? product.category
        : null
    const catName = cat?.name || 'Uncategorized'
    const c = byCat.get(catName) || { revenue: 0, orders: 0 }
    c.revenue += Number(row.amount_paid || 0)
    c.orders += 1
    byCat.set(catName, c)

    ordersByUser.set(row.user_id, (ordersByUser.get(row.user_id) || 0) + 1)
  }

  const topProducts: TopProductRow[] = [...byProduct.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .map((p) => ({ name: p.name, orders: p.orders, revenue: p.revenue }))

  const categoryBreakdown: CategoryRow[] = [...byCat.entries()]
    .map(([name, v]) => ({ name, revenue: v.revenue, orders: v.orders }))
    .sort((a, b) => b.revenue - a.revenue)

  const totalRev = topProducts.reduce((s, p) => s + p.revenue, 0)
  const totalOrd = topProducts.reduce((s, p) => s + p.orders, 0)
  const aov = totalOrd > 0 ? totalRev / totalOrd : 0

  const usersWithOrders = [...ordersByUser.values()].filter((n) => n >= 1).length
  const repeatUsers = [...ordersByUser.values()].filter((n) => n >= 2).length
  const repeatCustomerRate = usersWithOrders > 0 ? repeatUsers / usersWithOrders : 0

  return (
    <AdminAdvancedAnalyticsContent
      topProducts={topProducts}
      categoryBreakdown={categoryBreakdown}
      aov={aov}
      repeatCustomerRate={repeatCustomerRate}
    />
  )
}
