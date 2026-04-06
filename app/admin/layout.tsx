import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    redirect(profile?.role === 'vendor' ? '/vendor' : '/dashboard')
  }

  return (
    <div className="flex min-h-screen min-w-0 bg-muted/30">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
        <AdminHeader user={user} />
        <main className="min-w-0 flex-1 overflow-x-clip p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
