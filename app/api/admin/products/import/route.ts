import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'
import { recordStockMovement } from '@/lib/admin/product-payload'

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQ = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQ = true
    } else if (c === ',') {
      out.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  out.push(cur)
  return out
}

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

  const ct = request.headers.get('content-type') || ''
  let text: string
  if (ct.includes('multipart/form-data')) {
    const form = await request.formData()
    const file = form.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'file required' }, { status: 400 })
    }
    text = await file.text()
  } else {
    text = await request.text()
  }
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) {
    return NextResponse.json({ error: 'CSV must have header + rows' }, { status: 400 })
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())
  const idx = (name: string) => header.indexOf(name)

  let created = 0
  const errors: string[] = []

  for (let li = 1; li < lines.length; li++) {
    const cols = parseCsvLine(lines[li])
    const get = (name: string) => {
      const i = idx(name)
      return i >= 0 ? cols[i]?.trim() ?? '' : ''
    }

    const name = get('name')
    if (!name) {
      errors.push(`Row ${li + 1}: missing name`)
      continue
    }

    const price = parseFloat(get('price')) || 0
    const slugIn = get('slug')
    const slug = slugIn ? slugify(slugIn) : slugify(name)

    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', get('category_slug'))
      .maybeSingle()

    const insert: Record<string, unknown> = {
      name,
      slug,
      description: get('description') || null,
      short_description: get('short_description') || null,
      price,
      compare_price: get('compare_price') ? parseFloat(get('compare_price')) : null,
      cost_price: get('cost_price') ? parseFloat(get('cost_price')) : null,
      brand: get('brand') || null,
      sku: get('sku') || null,
      stock: parseInt(get('stock'), 10) || 0,
      low_stock_threshold: get('low_stock_threshold') ? parseInt(get('low_stock_threshold'), 10) : 5,
      stock_status: get('stock_status') || 'in_stock',
      featured: get('featured') === 'true' || get('featured') === '1',
      active: get('active') !== 'false' && get('active') !== '0',
      sort_order: get('sort_order') ? parseInt(get('sort_order'), 10) : 0,
      specs: {},
      images: [],
      category_id: cat?.id ?? null,
    }

    const { data: row, error } = await supabase.from('products').insert(insert).select('id').single()
    if (error) {
      errors.push(`Row ${li + 1}: ${error.message}`)
      continue
    }
    created++
    const stock = Number(insert.stock) || 0
    if (stock !== 0 && row?.id) {
      await recordStockMovement(supabase, {
        productId: row.id as string,
        qtyDelta: stock,
        reason: 'import',
        userId: user.id,
      })
    }
  }

  return NextResponse.json({ created, errors: errors.slice(0, 20), errorCount: errors.length })
}
