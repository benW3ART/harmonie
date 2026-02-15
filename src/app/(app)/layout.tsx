import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/app/sidebar'
import { AppHeader } from '@/components/app/header'
import type { Profile, Family } from '@/types/helpers'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null

  if (!profile) {
    redirect('/onboarding')
  }

  // Check if onboarding is completed
  const { data: familyData } = await supabase
    .from('families')
    .select('onboarding_completed')
    .eq('parent_id', user.id)
    .single()

  const family = familyData as Pick<Family, 'onboarding_completed'> | null

  if (!family?.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar user={user} profile={profile} />
      <div className="flex flex-1 flex-col">
        <AppHeader user={user} profile={profile} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
