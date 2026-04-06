import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { type Product } from '@/lib/types'
import { CheckoutContent } from '@/components/checkout-content'

interface CheckoutPageProps {
  searchParams: Promise<{
    product?: string
    type?: 'cash' | 'lipa_kidogo'
  }>
}

export const metadata = {
  title: 'Checkout',
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect(`/auth/login?redirect=/checkout?product=${params.product}&type=${params.type}`)
  }

  if (!params.product) {
    redirect('/shop')
  }

  // Fetch product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.product)
    .eq('active', true)
    .single()

  if (!product) {
    notFound()
  }

  const typedProduct = product as Product
  const paymentType = params.type || 'lipa_kidogo'

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <CheckoutContent
      product={typedProduct}
      paymentType={paymentType}
      profile={profile}
      userId={user.id}
    />
  )
}
