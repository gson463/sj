import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type BulkAction = 'delete' | 'activate' | 'deactivate' | 'feature' | 'unfeature'

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
  const ids: string[] = body.ids
  const action: BulkAction = body.action

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids required' }, { status: 400 })
  }

  const valid: BulkAction[] = ['delete', 'activate', 'deactivate', 'feature', 'unfeature']
  if (!valid.includes(action)) {
    return NextResponse.json({ error: 'invalid action' }, { status: 400 })
  }

  if (action === 'delete') {
    const { error } = await supabase.from('products').delete().in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, deleted: ids.length })
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (action === 'activate') patch.active = true
  if (action === 'deactivate') patch.active = false
  if (action === 'feature') patch.featured = true
  if (action === 'unfeature') patch.featured = false

  const { error } = await supabase.from('products').update(patch).in('id', ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, updated: ids.length })
}
