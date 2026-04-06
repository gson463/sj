import type { SupabaseClient } from '@supabase/supabase-js'
import { slugify } from '@/lib/slug'

/** Upsert tags by name and replace links for a product. */
export async function syncProductTags(
  supabase: SupabaseClient,
  productId: string,
  tagNames: string[],
) {
  const trimmed = [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))]
  await supabase.from('product_tags').delete().eq('product_id', productId)

  for (const name of trimmed) {
    const slug = slugify(name) || `tag-${name.slice(0, 8)}`
    const { data: existing } = await supabase.from('tags').select('id').eq('slug', slug).maybeSingle()
    let tagId = existing?.id as string | undefined
    if (!tagId) {
      const { data: inserted, error } = await supabase
        .from('tags')
        .insert({ name, slug })
        .select('id')
        .single()
      if (error) continue
      tagId = inserted.id
    }
    await supabase.from('product_tags').insert({ product_id: productId, tag_id: tagId })
  }
}

/** Replace related / upsell links for a product. */
export async function syncProductRelations(
  supabase: SupabaseClient,
  productId: string,
  relatedIds: string[],
  upsellIds: string[],
) {
  await supabase.from('product_relations').delete().eq('product_id', productId)

  const rel = (relatedIds || []).filter((id) => id && id !== productId)
  const up = (upsellIds || []).filter((id) => id && id !== productId)

  for (const rid of [...new Set(rel)]) {
    await supabase.from('product_relations').insert({
      product_id: productId,
      related_product_id: rid,
      relation_type: 'related',
    })
  }
  for (const uid of [...new Set(up)]) {
    await supabase.from('product_relations').insert({
      product_id: productId,
      related_product_id: uid,
      relation_type: 'upsell',
    })
  }
}

export async function recordStockMovement(
  supabase: SupabaseClient,
  params: {
    productId: string
    variantId?: string | null
    qtyDelta: number
    reason: 'adjustment' | 'sale' | 'return' | 'import' | 'duplicate' | 'initial'
    ref?: string | null
    userId?: string | null
  },
) {
  if (params.qtyDelta === 0) return
  await supabase.from('product_stock_movements').insert({
    product_id: params.productId,
    variant_id: params.variantId ?? null,
    qty_delta: params.qtyDelta,
    reason: params.reason,
    ref: params.ref ?? null,
    created_by: params.userId ?? null,
  } as Record<string, unknown>)
}
