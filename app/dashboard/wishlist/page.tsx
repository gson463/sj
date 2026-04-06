import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WishlistContent } from '@/components/dashboard/wishlist-content'

export default async function WishlistPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: raw } = await supabase
    .from('wishlist')
    .select(`
      id,
      created_at,
      products (
        id,
        name,
        slug,
        price,
        images,
        brand,
        stock
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  /** Supabase types nested FK as array; relation is one product per row. */
  const wishlistItems = (raw || []).map((row) => {
    const p = row.products
    const product = Array.isArray(p) ? p[0] ?? null : p
    return {
      id: row.id,
      created_at: row.created_at,
      products: product,
    }
  })

  return <WishlistContent wishlistItems={wishlistItems} />
}
