import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminProductsContent } from '@/components/admin/admin-products-content'
import {
  fetchAdminProducts,
  parseProductListSearchParams,
} from '@/lib/admin/build-products-query'
import type { Product, Category } from '@/lib/types'

export const metadata = {
  title: 'Products | Admin',
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const sp = await searchParams
  const filters = parseProductListSearchParams(sp)

  const { data: products, error, count } = await fetchAdminProducts(supabase, filters)

  if (error) {
    console.error(error)
  }

  const { data: categories } = await supabase.from('categories').select('*').order('name')

  const { data: brandRows } = await supabase
    .from('products')
    .select('brand')
    .not('brand', 'is', null)

  const brands = [
    ...new Set((brandRows || []).map((r: { brand: string | null }) => r.brand).filter(Boolean)),
  ] as string[]

  const total = count ?? 0
  const totalPages = total > 0 ? Math.ceil(total / filters.limit) : 0

  const { count: totalAll } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: activeCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)

  return (
    <div className="container py-6">
      <AdminProductsContent
        products={(products || []) as (Product & { category: Category | null })[]}
        categories={categories || []}
        brands={brands}
        total={total}
        page={filters.page}
        limit={filters.limit}
        totalPages={totalPages}
        filters={filters}
        stats={{
          totalProducts: totalAll ?? 0,
          activeProducts: activeCount ?? 0,
        }}
      />
    </div>
  )
}
