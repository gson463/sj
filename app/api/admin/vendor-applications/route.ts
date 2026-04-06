import { requireAdmin } from '@/lib/supabase/admin-auth'
import { NextResponse } from 'next/server'

/** GET — list seller applications (newest first) */
export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const { data: rows, error: qErr } = await supabase
    .from('vendor_applications')
    .select(
      'id, user_id, business_name, contact_phone, message, status, reviewed_at, reviewed_by, created_at, updated_at, profiles(full_name, phone)',
    )
    .order('created_at', { ascending: false })

  if (qErr) {
    return NextResponse.json({ error: qErr.message }, { status: 500 })
  }

  const normalized = (rows || []).map((row: Record<string, unknown>) => {
    const prof = row.profiles as { full_name: string | null; phone: string | null } | null | undefined
    const { profiles: _p, ...rest } = row
    return {
      ...rest,
      applicant_name: prof?.full_name ?? null,
      applicant_phone: prof?.phone ?? null,
    }
  })

  return NextResponse.json(normalized)
}
