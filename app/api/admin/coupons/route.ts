import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-auth'
import type { Coupon } from '@/lib/types'

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const { data, error: qErr } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })

  if (qErr) {
    return NextResponse.json({ error: qErr.message }, { status: 500 })
  }

  return NextResponse.json((data || []) as Coupon[])
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const body = await request.json()
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 })
  }

  const discount_type = body.discount_type === 'fixed' ? 'fixed' : 'percent'
  const discount_value = Number(body.discount_value)
  if (Number.isNaN(discount_value) || discount_value < 0) {
    return NextResponse.json({ error: 'Invalid discount value' }, { status: 400 })
  }
  if (discount_type === 'percent' && discount_value > 100) {
    return NextResponse.json({ error: 'Percent cannot exceed 100' }, { status: 400 })
  }

  const row = {
    code,
    description: typeof body.description === 'string' ? body.description.trim() || null : null,
    discount_type,
    discount_value,
    min_order_amount: Number(body.min_order_amount) || 0,
    max_uses: body.max_uses == null || body.max_uses === '' ? null : Number(body.max_uses),
    starts_at: body.starts_at || null,
    expires_at: body.expires_at || null,
    active: body.active !== false,
    updated_at: new Date().toISOString(),
  }

  const { data, error: insErr } = await supabase.from('coupons').insert(row).select().single()

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 400 })
  }

  return NextResponse.json(data as Coupon, { status: 201 })
}
