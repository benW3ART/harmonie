// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CoachSidebar } from '@/components/coach/sidebar'
import { CoachHeader } from '@/components/coach/header'

export default async function CoachLayout({
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

  // Get user profile and verify coach role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'coach') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <CoachSidebar user={user} profile={profile} />
      <div className="flex flex-1 flex-col">
        <CoachHeader user={user} profile={profile} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
