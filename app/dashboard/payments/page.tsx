import { createClient } from '@/lib/supabase/server'
import { type Payment, type Order, type Product } from '@/lib/types'
import { PaymentsContent } from '@/components/dashboard/payments-content'

export const metadata = {
  title: 'Payment History',
}

export default async function PaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: payments } = await supabase
    .from('payments')
    .select('*, order:orders(*, product:products(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const typedPayments = (payments || []) as (Payment & { order: Order & { product: Product } })[]

  return <PaymentsContent payments={typedPayments} />
}
