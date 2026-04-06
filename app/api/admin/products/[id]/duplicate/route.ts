import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'
import { syncProductTags, syncProductRelations, recordStockMovement } from '@/lib/admin/product-payload'

export async function POST(
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

  const { data: source, error: srcErr } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (srcErr || !source) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const s = source as Record<string, unknown>
  const newName = `${String(s.name)} (Copy)`
  const baseSlug = String(s.slug || 'product')
  const newSlug = slugify(`${baseSlug}-copy-${Date.now().toString(36)}`)

  const { id: _omitId, created_at: _omitCreated, ...rest } = s
  const insert: Record<string, unknown> = {
    ...rest,
    name: newName,
    slug: newSlug,
    sku: null,
    barcode: null,
    updated_at: new Date().toISOString(),
  }

  const { data: product, error: insErr } = await supabase
    .from('products')
    .insert(insert)
    .select()
    .single()

  if (insErr || !product) {
    return NextResponse.json({ error: insErr?.message || 'Insert failed' }, { status: 500 })
  }

  const newId = product.id as string

  const { data: tagRows } = await supabase
    .from('product_tags')
    .select('tag_id')
    .eq('product_id', id)

  for (const row of tagRows || []) {
    await supabase.from('product_tags').insert({
      product_id: newId,
      tag_id: (row as { tag_id: string }).tag_id,
    })
  }

  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id)

  for (const v of variants || []) {
    const vr = v as Record<string, unknown>
    await supabase.from('product_variants').insert({
      product_id: newId,
      sku: null,
      title: vr.title,
      attributes: vr.attributes,
      price: vr.price,
      compare_price: vr.compare_price,
      stock: vr.stock,
      images: vr.images,
      sort_order: vr.sort_order,
      active: vr.active,
    })
  }

  const { data: rels } = await supabase
    .from('product_relations')
    .select('related_product_id, relation_type')
    .eq('product_id', id)

  for (const r of rels || []) {
    const row = r as { related_product_id: string; relation_type: string }
    await supabase.from('product_relations').insert({
      product_id: newId,
      related_product_id: row.related_product_id,
      relation_type: row.relation_type,
    })
  }

  const st = Number(s.stock) || 0
  if (st !== 0) {
    await recordStockMovement(supabase, {
      productId: newId,
      qtyDelta: st,
      reason: 'duplicate',
      userId: user.id,
    })
  }

  return NextResponse.json({ product })
}
