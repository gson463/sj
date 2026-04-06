import { createClient } from '@/lib/supabase/server'
import type { VendorBusinessDetails } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

const BUSINESS_TYPES = new Set<VendorBusinessDetails['business_type']>([
  'individual',
  'registered_company',
  'partnership',
  'other',
])

function parseVendorBusinessDetails(raw: unknown): VendorBusinessDetails | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const business_type = o.business_type
  if (typeof business_type !== 'string' || !BUSINESS_TYPES.has(business_type as VendorBusinessDetails['business_type'])) {
    return null
  }
  const business_email = typeof o.business_email === 'string' ? o.business_email.trim() : ''
  const physical_address = typeof o.physical_address === 'string' ? o.physical_address.trim() : ''
  const city = typeof o.city === 'string' ? o.city.trim() : ''
  const region = typeof o.region === 'string' ? o.region.trim() : ''
  const brands_categories = typeof o.brands_categories === 'string' ? o.brands_categories.trim() : ''
  if (!business_email || !physical_address || !city || !region || !brands_categories) {
    return null
  }
  if (!business_email.includes('@')) {
    return null
  }
  const registration_or_tin =
    typeof o.registration_or_tin === 'string' && o.registration_or_tin.trim()
      ? o.registration_or_tin.trim()
      : null
  const years_in_business =
    typeof o.years_in_business === 'string' && o.years_in_business.trim()
      ? o.years_in_business.trim()
      : null
  const website_or_social =
    typeof o.website_or_social === 'string' && o.website_or_social.trim()
      ? o.website_or_social.trim()
      : null

  return {
    business_type: business_type as VendorBusinessDetails['business_type'],
    registration_or_tin,
    business_email,
    physical_address,
    city,
    region,
    brands_categories,
    years_in_business,
    website_or_social,
  }
}

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

  const business_details = parseVendorBusinessDetails(body.business_details)
  if (!business_name || !contact_phone || !business_details) {
    return NextResponse.json(
      { error: !business_details ? 'invalid_business_details' : 'missing_fields' },
      { status: 400 },
    )
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
    business_details,
    status: 'pending',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
