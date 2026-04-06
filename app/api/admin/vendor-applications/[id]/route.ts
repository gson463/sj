import { requireAdmin } from '@/lib/supabase/admin-auth'
import { NextRequest, NextResponse } from 'next/server'

/** PATCH — approve or reject a pending seller application */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const action = body.action
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'bad_action' }, { status: 400 })
  }

  const { data: row } = await supabase
    .from('vendor_applications')
    .select('user_id, status')
    .eq('id', id)
    .single()

  if (!row) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  if (row.status !== 'pending') {
    return NextResponse.json({ error: 'not_pending' }, { status: 400 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const adminId = user?.id ?? null
  const now = new Date().toISOString()

  if (action === 'approve') {
    const { error: pErr } = await supabase
      .from('profiles')
      .update({ role: 'vendor', updated_at: now })
      .eq('id', row.user_id)
    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 })
    }
  }

  const { error: uErr } = await supabase
    .from('vendor_applications')
    .update({
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewed_at: now,
      reviewed_by: adminId,
    })
    .eq('id', id)

  if (uErr) {
    return NextResponse.json({ error: uErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
