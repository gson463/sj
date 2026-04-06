import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { type Product } from '@/lib/types'
import { ProductDetailContent } from '@/components/product-detail-content'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description, meta_title, meta_description, og_image, canonical_url')
    .eq('slug', slug)
    .single()

  if (!product) {
    return { title: 'Product not found' }
  }

  const p = product as {
    name: string
    description: string | null
    meta_title?: string | null
    meta_description?: string | null
    og_image?: string | null
    canonical_url?: string | null
  }

  return {
    title: p.meta_title || p.name,
    description: p.meta_description || p.description || undefined,
    openGraph: p.og_image ? { images: [{ url: p.og_image }] } : undefined,
    alternates: p.canonical_url ? { canonical: p.canonical_url } : undefined,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!product) {
    notFound()
  }

  const typedProduct = product as Product & { category: { name: string; slug: string } | null }

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', typedProduct.category_id)
    .neq('id', typedProduct.id)
    .eq('active', true)
    .limit(4)

  return (
    <ProductDetailContent 
      product={typedProduct} 
      relatedProducts={(relatedProducts || []) as Product[]} 
    />
  )
}
