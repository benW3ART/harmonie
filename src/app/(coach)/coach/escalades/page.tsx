// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  acknowledged: {
    label: 'Pris en charge',
    color: 'bg-blue-100 text-blue-700',
    icon: Clock,
  },
  resolved: {
    label: 'Résolu',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
}

const priorityConfig = {
  low: { label: 'Basse', color: 'bg-gray-100 text-gray-700' },
  medium: { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-700' },
  high: { label: 'Haute', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-700' },
}

export default async function CoachEscaladesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all escalations
  const { data: escalations } = await supabase
    .from('escalations')
    .select(`
      *,
      families(name, profiles!families_parent_id_fkey(first_name, email))
    `)
    .order('created_at', { ascending: false })

  const pendingEscalations = escalations?.filter((e) => e.status === 'pending') || []
  const acknowledgedEscalations = escalations?.filter((e) => e.status === 'acknowledged') || []
  const resolvedEscalations = escalations?.filter((e) => e.status === 'resolved') || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Escalades</h1>
        <p className="text-muted-foreground">
          Gérez les situations nécessitant votre intervention.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingEscalations.length}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{acknowledgedEscalations.length}</p>
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
              <p className="text-2xl font-bold">{resolvedEscalations.length}</p>
              <p className="text-sm text-muted-foreground">Résolues</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending escalations */}
      {pendingEscalations.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            En attente ({pendingEscalations.length})
          </h2>
          <div className="space-y-4">
            {pendingEscalations.map((escalation) => {
              const status = statusConfig[escalation.status as keyof typeof statusConfig]
              const priority = priorityConfig[escalation.priority as keyof typeof priorityConfig] || priorityConfig.medium
              return (
                <Card key={escalation.id} className="border-destructive">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {escalation.families?.name || 'Famille'}
                          </p>
                          <Badge className={status?.color}>
                            {status?.label}
                          </Badge>
                          <Badge className={priority.color}>
                            {priority.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {escalation.reason}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(escalation.created_at).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Prendre en charge</Button>
                        <Link href={`/coach/familles/${escalation.family_id}`}>
                          <Button size="sm" variant="outline">
                            Voir famille
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Acknowledged escalations */}
      {acknowledgedEscalations.length > 0 && (
        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            En cours ({acknowledgedEscalations.length})
          </h2>
          <div className="space-y-4">
            {acknowledgedEscalations.map((escalation) => {
              const status = statusConfig[escalation.status as keyof typeof statusConfig]
              return (
                <Card key={escalation.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {escalation.families?.name || 'Famille'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {escalation.reason}
                      </p>
                    </div>
                    <Badge className={status?.color}>
                      {status?.label}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Marquer résolu
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Resolved escalations */}
      {resolvedEscalations.length > 0 && (
        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Résolues ({resolvedEscalations.length})
          </h2>
          <div className="space-y-4">
            {resolvedEscalations.slice(0, 10).map((escalation) => (
              <Card key={escalation.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {escalation.families?.name || 'Famille'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {escalation.reason}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    Résolu
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!escalations || escalations.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <CheckCircle className="h-16 w-16 text-success" />
            <h3 className="mt-4 font-heading text-lg font-semibold">
              Aucune escalade
            </h3>
            <p className="mt-2 text-muted-foreground">
              Tout va bien ! Aucune situation ne nécessite votre attention.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
