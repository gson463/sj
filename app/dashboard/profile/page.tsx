import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileContent } from '@/components/dashboard/profile-content'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  return <ProfileContent user={user} initialProfile={profile} />
}
