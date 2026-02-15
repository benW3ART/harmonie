import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  MessageCircle,
  BookOpen,
  Target,
  Repeat,
  ArrowRight,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

type Profile = Tables<'profiles'>
type Family = Tables<'families'> & { children?: Tables<'children'>[] }
type Goal = Tables<'goals'>
type DailyHabit = Tables<'daily_habits'> & { habit_completions?: { completed_at: string }[] }
type JournalEntry = Tables<'journal_entries'>

const quickActions = [
  {
    name: 'Parler à l\'IA',
    description: 'Obtenez des conseils personnalisés',
    icon: MessageCircle,
    href: '/chat',
    color: 'bg-primary',
  },
  {
    name: 'Mon journal',
    description: 'Voir mes entrées récentes',
    icon: BookOpen,
    href: '/journal',
    color: 'bg-accent',
  },
  {
    name: 'Mes objectifs',
    description: 'Suivre mes progrès',
    icon: Target,
    href: '/objectifs',
    color: 'bg-success',
  },
  {
    name: 'Mes réflexes',
    description: 'Habitudes du jour',
    icon: Repeat,
    href: '/reflexes',
    color: 'bg-secondary',
  },
]

export default async function DashboardPage() {
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

  // Get family
  const { data: familyData } = await supabase
    .from('families')
    .select('*, children(*)')
    .eq('parent_id', user.id)
    .single()
  const family = familyData as Family | null

  // Get recent goals
  const { data: goalsData } = family?.id ? await supabase
    .from('goals')
    .select('*')
    .eq('family_id', family.id)
    .eq('status', 'in_progress')
    .limit(3) : { data: null }
  const goals = goalsData as Goal[] | null

  // Get today's habits
  const { data: habitsData } = family?.id ? await supabase
    .from('daily_habits')
    .select('*, habit_completions(*)')
    .eq('family_id', family.id)
    .eq('active', true) : { data: null }
  const habits = habitsData as DailyHabit[] | null

  const today = new Date().toISOString().split('T')[0]
  const completedToday = habits?.filter((habit) =>
    habit.habit_completions?.some(
      (c) => c.completed_at.startsWith(today)
    )
  ).length || 0
  const totalHabits = habits?.length || 0

  // Get recent journal entries
  const { data: entriesData } = family?.id ? await supabase
    .from('journal_entries')
    .select('*')
    .eq('family_id', family.id)
    .order('date', { ascending: false })
    .limit(3) : { data: null }
  const recentEntries = entriesData as JournalEntry[] | null

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-heading text-3xl font-bold">
          Bonjour {profile?.first_name || 'là'} !
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre accompagnement.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Repeat className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {completedToday}/{totalHabits}
              </p>
              <p className="text-sm text-muted-foreground">Réflexes du jour</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <Target className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{goals?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Objectifs en cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recentEntries?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Entrées journal</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-muted-foreground">Jours de série</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-heading text-xl font-semibold">Actions rapides</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${action.color} text-white`}
                  >
                    <action.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-semibold">{action.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Current goals & habits */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Target className="h-5 w-5 text-primary" />
              Objectifs en cours
            </CardTitle>
            <CardDescription>Vos objectifs actuels</CardDescription>
          </CardHeader>
          <CardContent>
            {goals && goals.length > 0 ? (
              <ul className="space-y-4">
                {goals.map((goal) => (
                  <li
                    key={goal.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{goal.title}</p>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Target className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Pas encore d'objectifs définis</p>
                <Link href="/objectifs">
                  <Button variant="link" className="mt-2">
                    Créer un objectif
                  </Button>
                </Link>
              </div>
            )}
            <Link href="/objectifs">
              <Button variant="outline" className="mt-4 w-full">
                Voir tous les objectifs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Today's habits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Repeat className="h-5 w-5 text-primary" />
              Réflexes du jour
            </CardTitle>
            <CardDescription>
              {completedToday}/{totalHabits} complétés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {habits && habits.length > 0 ? (
              <ul className="space-y-3">
                {habits.slice(0, 5).map((habit) => {
                  const isCompleted = habit.habit_completions?.some(
                    (c: { completed_at: string }) => c.completed_at.startsWith(today)
                  )
                  return (
                    <li
                      key={habit.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted ? 'bg-success/10' : 'bg-secondary'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            isCompleted ? 'line-through opacity-50' : ''
                          }`}
                        >
                          {habit.title}
                        </p>
                        {habit.time_of_day && (
                          <p className="text-xs text-muted-foreground">
                            {habit.time_of_day === 'morning'
                              ? 'Matin'
                              : habit.time_of_day === 'afternoon'
                              ? 'Après-midi'
                              : 'Soir'}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Repeat className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Pas encore de réflexes définis</p>
                <Link href="/reflexes">
                  <Button variant="link" className="mt-2">
                    Créer un réflexe
                  </Button>
                </Link>
              </div>
            )}
            <Link href="/reflexes">
              <Button variant="outline" className="mt-4 w-full">
                Voir tous les réflexes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="bg-primary text-white">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <h3 className="font-heading text-xl font-semibold">
              Besoin de parler ?
            </h3>
            <p className="mt-1 text-white/80">
              L'IA est disponible 24h/24 pour vous accompagner.
            </p>
          </div>
          <Link href="/chat">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Démarrer une conversation
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
