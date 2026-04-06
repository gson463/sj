import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { CmsSiteSettings } from '@/lib/types'
import { resolveAuthModalCms } from '@/lib/cms-resolve'

/** Public read for storefront (auth modal, homepage banners, etc.). */
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase.from('cms_site_settings').select('*').eq('id', 1).maybeSingle()

  if (error) {
    return NextResponse.json({
      auth_modal_ad_image_url: null,
      auth_modal_ad_link_url: null,
      auth_modal_ad_alt: null,
      banner_slots: {},
      updated_at: null,
    })
  }

  const row = data as CmsSiteSettings | null
  const auth = resolveAuthModalCms(row)

  return NextResponse.json({
    ...auth,
    banner_slots: row?.banner_slots && typeof row.banner_slots === 'object' ? row.banner_slots : {},
    updated_at: row?.updated_at ?? null,
  })
}
