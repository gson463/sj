import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { VendorSidebar } from '@/components/vendor/vendor-sidebar'
import { VendorHeader } from '@/components/vendor/vendor-header'

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  if (profile?.role !== 'vendor') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen min-w-0 bg-muted/30">
      <VendorSidebar user={user} profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
        <VendorHeader user={user} profile={profile} />
        <main className="min-w-0 flex-1 overflow-x-clip p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
