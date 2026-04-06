import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get categories for the form
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const { data: pickList } = await supabase
    .from('products')
    .select('id, name')
    .order('name')

  const { data: vendorProfiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'vendor')
    .order('full_name')

  return (
    <div className="container py-6">
      <ProductForm
        categories={categories || []}
        vendors={(vendorProfiles || []) as { id: string; full_name: string | null }[]}
        allProductsForPick={(pickList || []) as { id: string; name: string }[]}
      />
    </div>
  )
}
