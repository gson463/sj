import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let dashboardHref = '/dashboard'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role === 'vendor') dashboardHref = '/vendor'
    if (profile?.role === 'admin') dashboardHref = '/admin'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} dashboardHref={dashboardHref} />
      <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </div>
  )
}
