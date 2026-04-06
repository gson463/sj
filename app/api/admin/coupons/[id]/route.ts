import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-auth'
import type { Coupon } from '@/lib/types'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const { id } = await params
  const body = await request.json()

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.description !== undefined) patch.description = body.description
  if (body.discount_type !== undefined) patch.discount_type = body.discount_type === 'fixed' ? 'fixed' : 'percent'
  if (body.discount_value !== undefined) patch.discount_value = Number(body.discount_value)
  if (body.min_order_amount !== undefined) patch.min_order_amount = Number(body.min_order_amount)
  if (body.max_uses !== undefined) patch.max_uses = body.max_uses === null ? null : Number(body.max_uses)
  if (body.starts_at !== undefined) patch.starts_at = body.starts_at
  if (body.expires_at !== undefined) patch.expires_at = body.expires_at
  if (body.active !== undefined) patch.active = Boolean(body.active)

  const { data, error: upErr } = await supabase.from('coupons').update(patch).eq('id', id).select().single()

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 })
  }

  return NextResponse.json(data as Coupon)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const { id } = await params
  const { error: delErr } = await supabase.from('coupons').delete().eq('id', id)

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
