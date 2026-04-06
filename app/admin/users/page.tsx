import { createClient } from '@/lib/supabase/server'
import { AdminUsersContent } from '@/components/admin/admin-users-content'
import type { Profile } from '@/lib/types'

export const metadata = {
  title: 'Staff & vendors | Admin',
}

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  const profiles = (data || []) as Profile[]
  return <AdminUsersContent profiles={profiles} />
}
