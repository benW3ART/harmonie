import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/services',
    '/a-propos',
    '/temoignages',
    '/blog',
    '/contact',
    '/rdv',
    '/mentions-legales',
    '/politique-confidentialite',
    '/cgv',
  ]

  // Auth routes (login, register, etc.)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith('/blog/')
  )

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => path === route)

  // Check if path is for the app (dashboard, etc.)
  const isAppRoute = path.startsWith('/dashboard') ||
                     path.startsWith('/chat') ||
                     path.startsWith('/journal') ||
                     path.startsWith('/objectifs') ||
                     path.startsWith('/reflexes') ||
                     path.startsWith('/parametres') ||
                     path.startsWith('/onboarding')

  // Check if path is for coach
  const isCoachRoute = path.startsWith('/coach')

  // If user is not authenticated
  if (!user) {
    // Allow access to public and auth routes
    if (isPublicRoute || isAuthRoute) {
      return supabaseResponse
    }
    // Redirect to login for protected routes
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  // If user is authenticated
  if (user) {
    // Redirect away from auth routes if already logged in
    if (isAuthRoute) {
      // Get user profile to determine redirect
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const profile = profileData as { role: string } | null
      const url = request.nextUrl.clone()
      url.pathname = profile?.role === 'coach' ? '/coach/dashboard' : '/dashboard'
      return NextResponse.redirect(url)
    }

    // Check role-based access for coach routes
    if (isCoachRoute) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const profile = profileData as { role: string } | null
      if (profile?.role !== 'coach') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }

    // Check role-based access for app routes (parents only)
    if (isAppRoute) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const profile = profileData as { role: string } | null
      if (profile?.role === 'coach') {
        const url = request.nextUrl.clone()
        url.pathname = '/coach/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
