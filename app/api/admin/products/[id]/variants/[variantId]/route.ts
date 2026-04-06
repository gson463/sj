import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { recordStockMovement } from '@/lib/admin/product-payload'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> },
) {
  const { id: productId, variantId } = await params
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
    .from('product_variants')
    .select('stock')
    .eq('id', variantId)
    .eq('product_id', productId)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()
  const oldStock = Number(existing.stock) || 0

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (body.sku !== undefined) update.sku = body.sku
  if (body.title !== undefined) update.title = body.title
  if (body.attributes !== undefined) update.attributes = body.attributes
  if (body.price !== undefined) update.price = body.price
  if (body.compare_price !== undefined) update.compare_price = body.compare_price
  if (body.stock !== undefined) update.stock = body.stock
  if (body.images !== undefined) update.images = body.images
  if (body.sort_order !== undefined) update.sort_order = body.sort_order
  if (body.active !== undefined) update.active = body.active

  const { data: row, error } = await supabase
    .from('product_variants')
    .update(update)
    .eq('id', variantId)
    .eq('product_id', productId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (body.stock !== undefined) {
    const newStock = Number(body.stock) || 0
    const delta = newStock - oldStock
    if (delta !== 0) {
      await recordStockMovement(supabase, {
        productId: productId,
        variantId,
        qtyDelta: delta,
        reason: 'adjustment',
        userId: user.id,
      })
    }
  }

  return NextResponse.json(row)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> },
) {
  const { id: productId, variantId } = await params
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

  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', variantId)
    .eq('product_id', productId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
