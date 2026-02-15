import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('first_name, email')
      .eq('id', user.id)
      .single()

    interface ProfileData {
      first_name: string | null
      email: string
    }
    const profile = profileData as ProfileData | null

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Send welcome email
    const result = await sendWelcomeEmail(
      profile.email,
      profile.first_name || 'cher parent'
    )

    if (!result.success) {
      console.error('Failed to send welcome email:', result.error)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
