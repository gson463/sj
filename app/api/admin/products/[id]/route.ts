import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'
import {
  syncProductTags,
  syncProductRelations,
  recordStockMovement,
} from '@/lib/admin/product-payload'
import { tagNamesFromJoinRows } from '@/lib/supabase/tag-rows'

// GET - Get single product (admin)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
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

  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: tagRows } = await supabase
    .from('product_tags')
    .select('tags(name, slug)')
    .eq('product_id', id)

  const { data: relRows } = await supabase
    .from('product_relations')
    .select('related_product_id, relation_type')
    .eq('product_id', id)

  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id)
    .order('sort_order', { ascending: true })

  const tags = tagNamesFromJoinRows(tagRows as { tags: unknown }[] | null)

  const related_product_ids =
    (relRows || [])
      .filter((r: { relation_type: string }) => r.relation_type === 'related')
      .map((r: { related_product_id: string }) => r.related_product_id) || []

  const upsell_product_ids =
    (relRows || [])
      .filter((r: { relation_type: string }) => r.relation_type === 'upsell')
      .map((r: { related_product_id: string }) => r.related_product_id) || []

  return NextResponse.json({
    ...product,
    tag_names: tags,
    related_product_ids,
    upsell_product_ids,
    variants: variants || [],
  })
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
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

  const { data: existing } = await supabase
    .from('products')
    .select('stock, slug, name')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()
  const oldStock = Number(existing.stock) || 0

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
    seller_id,
  } = body

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (name !== undefined) updateData.name = name
  if (slugIn !== undefined) updateData.slug = slugify(String(slugIn))
  if (description !== undefined) updateData.description = description
  if (short_description !== undefined) updateData.short_description = short_description
  if (price !== undefined) updateData.price = price
  if (compare_price !== undefined) updateData.compare_price = compare_price
  if (cost_price !== undefined) updateData.cost_price = cost_price
  if (tax_class !== undefined) updateData.tax_class = tax_class
  if (minimum_price !== undefined) updateData.minimum_price = minimum_price
  if (category_id !== undefined) updateData.category_id = category_id
  if (brand !== undefined) updateData.brand = brand
  if (stock !== undefined) updateData.stock = stock
  if (low_stock_threshold !== undefined) updateData.low_stock_threshold = low_stock_threshold
  if (stock_status !== undefined) updateData.stock_status = stock_status
  if (sort_order !== undefined) updateData.sort_order = sort_order
  if (specs !== undefined) updateData.specs = specs
  if (images !== undefined) updateData.images = images
  if (featured !== undefined) updateData.featured = featured
  if (active !== undefined) updateData.active = active
  if (sku !== undefined) updateData.sku = sku
  if (barcode !== undefined) updateData.barcode = barcode
  if (meta_title !== undefined) updateData.meta_title = meta_title
  if (meta_description !== undefined) updateData.meta_description = meta_description
  if (og_image !== undefined) updateData.og_image = og_image
  if (canonical_url !== undefined) updateData.canonical_url = canonical_url
  if (featured_image_index !== undefined) updateData.featured_image_index = featured_image_index
  if (seller_id !== undefined) updateData.seller_id = seller_id || null

  const { data: product, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (stock !== undefined) {
    const newStock = Number(stock) || 0
    const delta = newStock - oldStock
    if (delta !== 0) {
      await recordStockMovement(supabase, {
        productId: id,
        qtyDelta: delta,
        reason: 'adjustment',
        userId: user.id,
      })
    }
  }

  if (tag_names !== undefined) {
    await syncProductTags(supabase, id, Array.isArray(tag_names) ? tag_names : [])
  }
  if (related_product_ids !== undefined && upsell_product_ids !== undefined) {
    await syncProductRelations(
      supabase,
      id,
      Array.isArray(related_product_ids) ? related_product_ids : [],
      Array.isArray(upsell_product_ids) ? upsell_product_ids : [],
    )
  }

  return NextResponse.json(product)
}

// DELETE - Delete product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
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

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
