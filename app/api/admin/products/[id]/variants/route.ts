import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { recordStockMovement } from '@/lib/admin/product-payload'

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

  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id)
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ variants: data || [] })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: productId } = await params
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
    sku,
    title,
    attributes,
    price,
    compare_price,
    stock,
    images,
    sort_order,
    active,
  } = body

  const { data: row, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: productId,
      sku: sku || null,
      title: title || 'Variant',
      attributes: attributes || {},
      price,
      compare_price: compare_price ?? null,
      stock: stock ?? 0,
      images: images || [],
      sort_order: sort_order ?? 0,
      active: active !== false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const st = Number(stock) || 0
  if (st !== 0) {
    await recordStockMovement(supabase, {
      productId: productId,
      variantId: row.id,
      qtyDelta: st,
      reason: 'initial',
      userId: user.id,
    })
  }

  return NextResponse.json(row, { status: 201 })
}
