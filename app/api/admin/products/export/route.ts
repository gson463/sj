import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function escapeCsv(v: unknown): string {
  const s = v == null ? '' : String(v)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET() {
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

  const { data: products, error } = await supabase
    .from('products')
    .select('*, category:categories(name, slug)')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const headers = [
    'id',
    'sku',
    'name',
    'slug',
    'brand',
    'category_slug',
    'price',
    'compare_price',
    'cost_price',
    'stock',
    'low_stock_threshold',
    'stock_status',
    'featured',
    'active',
    'sort_order',
    'description',
    'short_description',
  ]

  const rows = (products || []).map((p: Record<string, unknown>) => {
    const cat = p.category as { slug?: string } | null
    return [
      p.id,
      p.sku,
      p.name,
      p.slug,
      p.brand,
      cat?.slug ?? '',
      p.price,
      p.compare_price,
      p.cost_price,
      p.stock,
      p.low_stock_threshold,
      p.stock_status,
      p.featured,
      p.active,
      p.sort_order,
      p.description,
      p.short_description,
    ]
  })

  const csv = [headers.join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="products-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
