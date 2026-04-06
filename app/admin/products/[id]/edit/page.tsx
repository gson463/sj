import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'
import type { ProductVariant } from '@/lib/types'
import { tagNamesFromJoinRows } from '@/lib/supabase/tag-rows'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const tagRes = await supabase
    .from('product_tags')
    .select('tags(name)')
    .eq('product_id', id)

  const tagNames = tagRes.error
    ? []
    : tagNamesFromJoinRows(tagRes.data as { tags: unknown }[] | null)

  const relRes = await supabase
    .from('product_relations')
    .select('related_product_id, relation_type')
    .eq('product_id', id)

  const relRows = relRes.error ? [] : relRes.data || []

  const relatedProductIds =
    relRows
      .filter((r: { relation_type: string }) => r.relation_type === 'related')
      .map((r: { related_product_id: string }) => r.related_product_id) || []

  const upsellProductIds =
    relRows
      .filter((r: { relation_type: string }) => r.relation_type === 'upsell')
      .map((r: { related_product_id: string }) => r.related_product_id) || []

  const varRes = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id)
    .order('sort_order', { ascending: true })

  const variantRows = varRes.error ? [] : varRes.data || []

  const { data: pickList } = await supabase
    .from('products')
    .select('id, name')
    .neq('id', id)
    .order('name')

  const { data: vendorProfiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'vendor')
    .order('full_name')

  const vendorList = [...(vendorProfiles || [])] as { id: string; full_name: string | null }[]
  const sellerId = (product as { seller_id?: string | null }).seller_id
  if (sellerId && !vendorList.some((a) => a.id === sellerId)) {
    const { data: orphan } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', sellerId)
      .single()
    if (orphan) vendorList.push(orphan)
  }

  return (
    <div className="container py-6">
      <ProductForm
        product={product}
        categories={categories || []}
        vendors={vendorList}
        tagNames={tagNames}
        relatedProductIds={relatedProductIds}
        upsellProductIds={upsellProductIds}
        variants={(variantRows || []) as ProductVariant[]}
        allProductsForPick={(pickList || []) as { id: string; name: string }[]}
      />
    </div>
  )
}
