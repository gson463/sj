import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_BYTES = 5 * 1024 * 1024

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

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

/** POST multipart: file + categoryId → public URL (cms bucket, categories/...) */
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
  const categoryIdRaw = form.get('categoryId')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }
  const categoryId = typeof categoryIdRaw === 'string' ? categoryIdRaw.trim() : ''
  if (!categoryId || !UUID_RE.test(categoryId)) {
    return NextResponse.json({ error: 'Invalid categoryId' }, { status: 400 })
  }

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

  const path = `categories/${categoryId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

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
