import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SellerApplyContent } from '@/components/sell/seller-apply-content'
import type { VendorApplication } from '@/lib/types'

export const metadata = {
  title: 'Sell on SIMU JIJI',
}

export default async function SellPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profileRole: string | null = null
  let latestApplication: VendorApplication | null = null

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    profileRole = profile?.role ?? null

    if (profileRole === 'vendor') {
      redirect('/vendor')
    }
    if (profileRole === 'admin') {
      redirect('/admin')
    }

    const { data: apps, error: appsErr } = await supabase
      .from('vendor_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (!appsErr && apps?.[0]) {
      latestApplication = apps[0] as VendorApplication
    }
  }

  return <SellerApplyContent user={user} profileRole={profileRole} latestApplication={latestApplication} />
}
