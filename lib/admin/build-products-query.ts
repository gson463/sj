import type { SupabaseClient } from '@supabase/supabase-js'

/** Admin product list URL/query state */
export type ProductListFilters = {
  page: number
  limit: number
  sort: string
  orderAsc: boolean
  q?: string
  category_id?: string
  brand?: string
  featured?: boolean
  active?: boolean
  stock_max?: number
}

export async function fetchAdminProducts(
  supabase: SupabaseClient,
  filters: ProductListFilters,
) {
  const offset = (filters.page - 1) * filters.limit

  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })

  if (filters.q?.trim()) {
    const q = filters.q.trim()
    query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,sku.ilike.%${q}%`)
  }
  if (filters.category_id) query = query.eq('category_id', filters.category_id)
  if (filters.brand) query = query.eq('brand', filters.brand)
  if (filters.featured !== undefined) query = query.eq('featured', filters.featured)
  if (filters.active !== undefined) query = query.eq('active', filters.active)
  if (filters.stock_max !== undefined && !Number.isNaN(filters.stock_max)) {
    query = query.lte('stock', filters.stock_max)
  }

  const sortCol = ['created_at', 'name', 'price', 'stock', 'sort_order'].includes(filters.sort)
    ? filters.sort
    : 'created_at'

  query = query
    .order(sortCol, { ascending: filters.orderAsc })
    .range(offset, offset + filters.limit - 1)

  return await query
}

export function parseProductListSearchParams(
  sp: Record<string, string | string[] | undefined>,
): ProductListFilters {
  const g = (k: string) => {
    const v = sp[k]
    return Array.isArray(v) ? v[0] : v
  }
  const page = Math.max(1, parseInt(g('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(g('limit') || '25', 10)))
  const sort = g('sort') || 'created_at'
  const orderAsc = g('order') === 'asc'
  const qRaw = g('q')
  const q = qRaw && qRaw.trim() !== '' ? qRaw.trim() : undefined
  const category_id = g('category_id') || undefined
  const brand = g('brand') || undefined
  const featured = g('featured') === 'true' ? true : g('featured') === 'false' ? false : undefined
  const active = g('active') === 'true' ? true : g('active') === 'false' ? false : undefined
  const stockMaxStr = g('stock_max')
  const stock_max =
    stockMaxStr !== undefined && stockMaxStr !== ''
      ? parseInt(stockMaxStr, 10)
      : undefined

  return {
    page,
    limit,
    sort,
    orderAsc,
    q,
    category_id,
    brand,
    featured,
    active,
    stock_max: stock_max !== undefined && !Number.isNaN(stock_max) ? stock_max : undefined,
  }
}

/** Build `/admin/products?...` preserving filters */
export function adminProductsHref(
  filters: ProductListFilters,
  patch: Partial<ProductListFilters>,
): string {
  const next = { ...filters, ...patch }
  const p = new URLSearchParams()
  if (next.page > 1) p.set('page', String(next.page))
  if (next.limit !== 25) p.set('limit', String(next.limit))
  if (next.sort && next.sort !== 'created_at') p.set('sort', next.sort)
  if (next.orderAsc) p.set('order', 'asc')
  if (next.q !== undefined && next.q !== '') p.set('q', next.q)
  if (next.category_id) p.set('category_id', next.category_id)
  if (next.brand) p.set('brand', next.brand)
  if (next.featured !== undefined) p.set('featured', String(next.featured))
  if (next.active !== undefined) p.set('active', String(next.active))
  if (next.stock_max !== undefined) p.set('stock_max', String(next.stock_max))
  const qs = p.toString()
  return qs ? `/admin/products?${qs}` : '/admin/products'
}
