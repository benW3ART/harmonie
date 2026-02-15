'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  BarChart3,
  Calendar,
  Settings,
  Heart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

const navigation = [
  { name: 'Tableau de bord', href: '/coach/dashboard', icon: LayoutDashboard },
  { name: 'Familles', href: '/coach/familles', icon: Users },
  { name: 'Escalades', href: '/coach/escalades', icon: AlertTriangle },
  { name: 'Statistiques', href: '/coach/stats', icon: BarChart3 },
  { name: 'Agenda', href: '/coach/agenda', icon: Calendar },
  { name: 'Paramètres', href: '/coach/parametres', icon: Settings },
]

interface CoachSidebarProps {
  user: User
  profile: Profile
}

export function CoachSidebar({ profile }: CoachSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-heading text-lg font-semibold">
              Coach
            </span>
            <span className="ml-1 text-xs text-muted-foreground">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-semibold text-primary">
                {profile.first_name?.[0]?.toUpperCase() || 'C'}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">
                {profile.first_name || 'Coach'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
