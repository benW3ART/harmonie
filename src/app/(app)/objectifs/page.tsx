import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Target, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import type { Goal, Family } from '@/types/helpers'

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  not_started: {
    label: 'Non commencé',
    color: 'bg-gray-100 text-gray-700',
    icon: Clock,
  },
  in_progress: {
    label: 'En cours',
    color: 'bg-blue-100 text-blue-700',
    icon: Target,
  },
  completed: {
    label: 'Terminé',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  paused: {
    label: 'En pause',
    color: 'bg-yellow-100 text-yellow-700',
    icon: AlertCircle,
  },
}

const categoryIcons: Record<string, string> = {
  sleep: '🌙',
  nutrition: '🍎',
  behavior: '🧠',
  other: '✨',
}

export default async function ObjectifsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get family
  const { data: familyData } = await supabase
    .from('families')
    .select('id')
    .eq('parent_id', user.id)
    .single()

  const family = familyData as Family | null

  // Get goals
  const { data: goalsData } = await supabase
    .from('goals')
    .select('*')
    .eq('family_id', family?.id ?? '')
    .order('created_at', { ascending: false })

  const goals = (goalsData ?? []) as Goal[]

  const inProgressGoals = goals.filter((g) => g.status === 'in_progress')
  const completedGoals = goals.filter((g) => g.status === 'completed')
  const otherGoals = goals.filter(
    (g) => g.status !== 'in_progress' && g.status !== 'completed'
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Objectifs</h1>
          <p className="text-muted-foreground">
            Suivez vos objectifs et célébrez vos progrès.
          </p>
        </div>
        <Link href="/objectifs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel objectif
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgressGoals.length}</p>
              <p className="text-sm text-muted-foreground">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedGoals.length}</p>
              <p className="text-sm text-muted-foreground">Terminés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{goals.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* In Progress */}
      {inProgressGoals.length > 0 && (
        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">En cours</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {inProgressGoals.map((goal) => {
              const status = statusConfig[goal.status] ?? statusConfig.not_started
              const StatusIcon = status.icon
              return (
                <Link key={goal.id} href={`/objectifs/${goal.id}`}>
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl">
                        {categoryIcons[goal.category ?? 'other'] ?? '✨'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{goal.title}</p>
                          <Badge className={status.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {goal.description}
                          </p>
                        )}
                        {goal.target_date && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Objectif: {new Date(goal.target_date).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Other goals */}
      {otherGoals.length > 0 && (
        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">Autres</h2>
          <div className="space-y-4">
            {otherGoals.map((goal) => {
              const status = statusConfig[goal.status] ?? statusConfig.not_started
              const StatusIcon = status.icon
              return (
                <Link key={goal.id} href={`/objectifs/${goal.id}`}>
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xl">
                        {categoryIcons[goal.category ?? 'other'] ?? '✨'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{goal.title}</p>
                      </div>
                      <Badge className={status.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">Terminés</h2>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
              <Link key={goal.id} href={`/objectifs/${goal.id}`}>
                <Card className="transition-shadow hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold line-through opacity-70">
                        {goal.title}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Terminé
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {goals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Target className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-heading text-lg font-semibold">
              Pas encore d'objectifs
            </h3>
            <p className="mt-2 text-muted-foreground">
              Définissez vos premiers objectifs pour commencer votre accompagnement.
            </p>
            <Link href="/objectifs/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer mon premier objectif
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
