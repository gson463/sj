import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'vendor') {
    redirect('/vendor')
  }

  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen min-w-0 bg-muted/30">
      <DashboardSidebar user={user} profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
        <DashboardHeader user={user} profile={profile} />
        <main className="min-w-0 flex-1 overflow-x-clip p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
