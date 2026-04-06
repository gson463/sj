import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_BYTES = 5 * 1024 * 1024

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), supabase: null as null }
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), supabase: null as null }
  }
  return { error: null as null, supabase }
}

function safeSegment(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64) || 'banner'
}

/** POST multipart: file + slotId → public URL for cms bucket */
export async function POST(request: NextRequest) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = form.get('file')
  const slotIdRaw = form.get('slotId')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }
  const slotId = typeof slotIdRaw === 'string' ? safeSegment(slotIdRaw) : 'general'

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, or GIF images are allowed' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
  }

  const ext =
    file.type === 'image/jpeg'
      ? 'jpg'
      : file.type === 'image/png'
        ? 'png'
        : file.type === 'image/webp'
          ? 'webp'
          : 'gif'

  const path = `banners/${slotId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  const buf = Buffer.from(await file.arrayBuffer())
  const { error: upErr } = await supabase.storage.from('cms').upload(path, buf, {
    contentType: file.type,
    upsert: false,
  })

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('cms').getPublicUrl(path)

  return NextResponse.json({ url: publicUrl, path })
}
