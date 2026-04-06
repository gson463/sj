import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { CmsBannerSlotContent, CmsSiteSettings } from '@/lib/types'
import { CMS_BANNER_SLOTS, normalizeSlot } from '@/lib/cms-banner-slots'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), supabase: null }
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), supabase: null }
  }
  return { error: null, supabase }
}

function isSafeHttpUrl(s: string | null | undefined): boolean {
  if (s == null || s.trim() === '') return true
  try {
    const u = new URL(s.trim())
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

const ALLOWED_SLOT_IDS = new Set(CMS_BANNER_SLOTS.map((s) => s.id))

function sanitizeBannerSlots(raw: unknown): Record<string, CmsBannerSlotContent> {
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, CmsBannerSlotContent> = {}
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!ALLOWED_SLOT_IDS.has(key)) continue
    const slot = normalizeSlot(val)
    if (slot.image_url && !isSafeHttpUrl(slot.image_url)) continue
    if (slot.link_url && !isSafeHttpUrl(slot.link_url)) continue
    out[key] = {
      image_url: slot.image_url?.trim() || null,
      link_url: slot.link_url?.trim() || null,
      alt: slot.alt?.trim() || null,
      enabled: slot.enabled !== false,
    }
  }
  return out
}

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const { data, error: qErr } = await supabase
    .from('cms_site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (qErr) {
    return NextResponse.json({ error: qErr.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({
      id: 1,
      auth_modal_ad_image_url: null,
      auth_modal_ad_link_url: null,
      auth_modal_ad_alt: null,
      banner_slots: {},
    })
  }

  return NextResponse.json(data as CmsSiteSettings)
}

export async function PUT(request: NextRequest) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const body = await request.json()

  const banner_slots = 'banner_slots' in body ? sanitizeBannerSlots(body.banner_slots) : null
  const auth = banner_slots?.auth_modal

  const auth_modal_ad_image_url =
    auth?.image_url?.trim() ||
    (typeof body.auth_modal_ad_image_url === 'string' ? body.auth_modal_ad_image_url.trim() || null : null)
  const auth_modal_ad_link_url =
    auth?.link_url?.trim() ||
    (typeof body.auth_modal_ad_link_url === 'string' ? body.auth_modal_ad_link_url.trim() || null : null)
  const auth_modal_ad_alt =
    auth?.alt?.trim() ||
    (typeof body.auth_modal_ad_alt === 'string' ? body.auth_modal_ad_alt.trim() || null : null)

  if (!isSafeHttpUrl(auth_modal_ad_image_url) || !isSafeHttpUrl(auth_modal_ad_link_url)) {
    return NextResponse.json({ error: 'Invalid URL (use http or https)' }, { status: 400 })
  }

  const row: Record<string, unknown> = {
    id: 1,
    auth_modal_ad_image_url,
    auth_modal_ad_link_url,
    auth_modal_ad_alt,
    updated_at: new Date().toISOString(),
  }

  if (banner_slots !== null) {
    row.banner_slots = banner_slots
  }

  const { data, error: upErr } = await supabase
    .from('cms_site_settings')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single()

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 })
  }

  return NextResponse.json(data as CmsSiteSettings)
}
