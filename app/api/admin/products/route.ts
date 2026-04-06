import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'
import { syncProductTags, syncProductRelations, recordStockMovement } from '@/lib/admin/product-payload'

function parseBool(v: string | null): boolean | undefined {
  if (v === null || v === '') return undefined
  if (v === 'true' || v === '1') return true
  if (v === 'false' || v === '0') return false
  return undefined
}

// GET - List products (admin) with filters & pagination
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const sp = request.nextUrl.searchParams
  const page = Math.max(1, parseInt(sp.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(sp.get('limit') || '25', 10)))
  const offset = (page - 1) * limit
  const sort = sp.get('sort') || 'created_at'
  const order = sp.get('order') === 'asc' ? { ascending: true } : { ascending: false }
  const q = sp.get('q')?.trim()
  const categoryId = sp.get('category_id')
  const brand = sp.get('brand')?.trim()
  const featured = parseBool(sp.get('featured'))
  const active = parseBool(sp.get('active'))
  const stockMax = sp.get('stock_max') // e.g. low-stock filter: stock_max=5

  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })

  if (q) {
    query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,sku.ilike.%${q}%`)
  }
  if (categoryId) query = query.eq('category_id', categoryId)
  if (brand) query = query.eq('brand', brand)
  if (featured !== undefined) query = query.eq('featured', featured)
  if (active !== undefined) query = query.eq('active', active)
  if (stockMax) {
    const n = parseInt(stockMax, 10)
    if (!Number.isNaN(n)) query = query.lte('stock', n)
  }

  const sortCol = ['created_at', 'name', 'price', 'stock', 'sort_order'].includes(sort)
    ? sort
    : 'created_at'

  query = query
    .order(sortCol, order)
    .range(offset, offset + limit - 1)

  const { data: products, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    products,
    total: count ?? 0,
    page,
    limit,
    totalPages: count ? Math.ceil(count / limit) : 0,
  })
}

// POST - Create new product
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const {
    name,
    slug: slugIn,
    description,
    short_description,
    price,
    compare_price,
    cost_price,
    tax_class,
    minimum_price,
    category_id,
    brand,
    stock,
    low_stock_threshold,
    stock_status,
    sort_order,
    specs,
    images,
    featured,
    active,
    sku,
    barcode,
    meta_title,
    meta_description,
    og_image,
    canonical_url,
    featured_image_index,
    tag_names,
    related_product_ids,
    upsell_product_ids,
    variants: variantsBody,
    seller_id,
  } = body

  const slug = slugIn ? slugify(String(slugIn)) : slugify(name)

  const insertRow: Record<string, unknown> = {
    name,
    slug,
    description: description ?? null,
    short_description: short_description ?? null,
    price,
    compare_price: compare_price ?? null,
    cost_price: cost_price ?? null,
    tax_class: tax_class ?? 'standard',
    minimum_price: minimum_price ?? null,
    category_id: category_id || null,
    brand: brand ?? null,
    stock: stock ?? 0,
    low_stock_threshold: low_stock_threshold ?? 5,
    stock_status: stock_status ?? 'in_stock',
    sort_order: sort_order ?? 0,
    specs: specs || {},
    images: images || [],
    featured: featured || false,
    active: active !== false,
    sku: sku || null,
    barcode: barcode || null,
    meta_title: meta_title ?? null,
    meta_description: meta_description ?? null,
    og_image: og_image ?? null,
    canonical_url: canonical_url ?? null,
    featured_image_index: featured_image_index ?? 0,
    seller_id: seller_id ?? null,
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert(insertRow)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const pid = product.id as string

  if (Array.isArray(tag_names) && tag_names.length) {
    await syncProductTags(supabase, pid, tag_names)
  }
  if (Array.isArray(related_product_ids) || Array.isArray(upsell_product_ids)) {
    await syncProductRelations(
      supabase,
      pid,
      related_product_ids || [],
      upsell_product_ids || [],
    )
  }

  const initialStock = Number(stock) || 0
  if (initialStock !== 0) {
    await recordStockMovement(supabase, {
      productId: pid,
      qtyDelta: initialStock,
      reason: 'initial',
      userId: user.id,
    })
  }

  if (Array.isArray(variantsBody)) {
    for (const v of variantsBody as Record<string, unknown>[]) {
      const { data: vr } = await supabase
        .from('product_variants')
        .insert({
          product_id: pid,
          sku: v.sku || null,
          title: String(v.title || 'Variant'),
          attributes: (v.attributes as object) || {},
          price: Number(v.price) || 0,
          compare_price: v.compare_price != null ? Number(v.compare_price) : null,
          stock: Number(v.stock) || 0,
          images: Array.isArray(v.images) ? v.images : [],
          sort_order: Number(v.sort_order) || 0,
          active: v.active !== false,
        })
        .select('id')
        .single()
      const vst = Number(v.stock) || 0
      if (vr?.id && vst !== 0) {
        await recordStockMovement(supabase, {
          productId: pid,
          variantId: vr.id as string,
          qtyDelta: vst,
          reason: 'initial',
          userId: user.id,
        })
      }
    }
  }

  return NextResponse.json(product, { status: 201 })
}
