import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/** POST — authenticated customers submit a seller application */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'customer') {
    return NextResponse.json({ error: 'only_customers' }, { status: 400 })
  }

  const body = await request.json().catch(() => ({}))
  const business_name = typeof body.business_name === 'string' ? body.business_name.trim() : ''
  const contact_phone = typeof body.contact_phone === 'string' ? body.contact_phone.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : null

  if (!business_name || !contact_phone) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  const { data: pending } = await supabase
    .from('vendor_applications')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .maybeSingle()

  if (pending) {
    return NextResponse.json({ error: 'pending_exists' }, { status: 409 })
  }

  const { error } = await supabase.from('vendor_applications').insert({
    user_id: user.id,
    business_name,
    contact_phone,
    message: message || null,
    status: 'pending',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
