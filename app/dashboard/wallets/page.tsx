import { createClient } from '@/lib/supabase/server'
import { type CustomerWallet, type Product } from '@/lib/types'
import { WalletsContent } from '@/components/dashboard/wallets-content'

export const metadata = {
  title: 'My Savings',
}

export default async function WalletsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: wallets } = await supabase
    .from('customer_wallets')
    .select('*, product:products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const typedWallets = (wallets || []) as (CustomerWallet & { product: Product })[]

  return <WalletsContent wallets={typedWallets} />
}
