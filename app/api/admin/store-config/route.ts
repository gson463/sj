import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-auth'
import type { AdminStoreSettings } from '@/lib/types'

const DEFAULT_GATEWAYS: AdminStoreSettings['payment_gateways'] = {
  mpesa: { enabled: true, label: 'M-Pesa' },
  tigopesa: { enabled: true, label: 'Tigo Pesa' },
  airtelmoney: { enabled: true, label: 'Airtel Money' },
  halopesa: { enabled: false, label: 'HaloPesa' },
  bank: { enabled: false, label: 'Bank transfer' },
  card: { enabled: false, label: 'Card' },
}

const DEFAULT_EMAIL: AdminStoreSettings['email_templates'] = {
  order_confirmation: {
    subject: 'Order confirmed — {{order_id}}',
    body: 'Hi {{name}}, thank you for your order. Total: {{total}}.',
  },
  shipping_update: {
    subject: 'Your order is on the way',
    body: 'Hi {{name}}, order {{order_id}} has been shipped.',
  },
  refund_notice: {
    subject: 'Refund processed',
    body: 'Hi {{name}}, a refund of {{amount}} has been initiated.',
  },
}

export async function GET() {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const { data, error: qErr } = await supabase.from('admin_store_settings').select('*').eq('id', 1).maybeSingle()

  if (qErr) {
    return NextResponse.json({ error: qErr.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({
      id: 1,
      shipping_zones: [],
      shipping_methods: [],
      tax_rates: [],
      payment_gateways: DEFAULT_GATEWAYS,
      email_templates: DEFAULT_EMAIL,
      updated_at: new Date().toISOString(),
    } satisfies AdminStoreSettings)
  }

  const row = data as Record<string, unknown>
  return NextResponse.json({
    id: 1,
    shipping_zones: row.shipping_zones ?? [],
    shipping_methods: row.shipping_methods ?? [],
    tax_rates: row.tax_rates ?? [],
    payment_gateways: { ...DEFAULT_GATEWAYS, ...(row.payment_gateways as object) },
    email_templates: { ...DEFAULT_EMAIL, ...(row.email_templates as object) },
    updated_at: row.updated_at,
  } as AdminStoreSettings)
}

export async function PUT(request: NextRequest) {
  const { error, supabase } = await requireAdmin()
  if (error || !supabase) return error!

  const body = await request.json()

  const { data: existing } = await supabase.from('admin_store_settings').select('*').eq('id', 1).maybeSingle()

  const base = (existing || {}) as Record<string, unknown>
  const next = {
    id: 1,
    shipping_zones: body.shipping_zones !== undefined ? body.shipping_zones : base.shipping_zones ?? [],
    shipping_methods: body.shipping_methods !== undefined ? body.shipping_methods : base.shipping_methods ?? [],
    tax_rates: body.tax_rates !== undefined ? body.tax_rates : base.tax_rates ?? [],
    payment_gateways: body.payment_gateways !== undefined ? body.payment_gateways : base.payment_gateways ?? {},
    email_templates: body.email_templates !== undefined ? body.email_templates : base.email_templates ?? {},
    updated_at: new Date().toISOString(),
  }

  const { data, error: upErr } = await supabase
    .from('admin_store_settings')
    .upsert(next, { onConflict: 'id' })
    .select()
    .single()

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
