// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/app/sidebar'
import { AppHeader } from '@/components/app/header'

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
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Check if onboarding is completed
  const { data: family } = await supabase
    .from('families')
    .select('onboarding_completed')
    .eq('parent_id', user.id)
    .single()

  // Allow access to onboarding even if family doesn't exist
  const isOnboarding = typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/onboarding')

  if (!family?.onboarding_completed && !isOnboarding) {
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
