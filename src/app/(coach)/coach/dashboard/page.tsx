// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Users,
  AlertTriangle,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  Calendar,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export default async function CoachDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get all families
  const { data: families } = await supabase
    .from('families')
    .select('*, children(*), profiles!families_parent_id_fkey(*)')
    .order('created_at', { ascending: false })

  // Get pending escalations
  const { data: escalations } = await supabase
    .from('escalations')
    .select('*, families(*)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get upcoming bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, families(*)')
    .gte('date_time', new Date().toISOString())
    .order('date_time', { ascending: true })
    .limit(5)

  // Get recent conversations with high activity
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('*, conversations(*, families(*))')
    .order('created_at', { ascending: false })
    .limit(10)

  const activeFamilies = families?.filter(
    (f) => f.subscription_status === 'active'
  ).length || 0

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-heading text-3xl font-bold">
          Bonjour {profile?.first_name || 'Coach'} !
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de vos familles accompagnées.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{families?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Familles totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeFamilies}</p>
              <p className="text-sm text-muted-foreground">Actives</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{escalations?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Escalades</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{bookings?.length || 0}</p>
              <p className="text-sm text-muted-foreground">RDV à venir</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Pending escalations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Escalades en attente
            </CardTitle>
            <CardDescription>
              Familles nécessitant votre attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {escalations && escalations.length > 0 ? (
              <ul className="space-y-4">
                {escalations.map((escalation) => (
                  <li
                    key={escalation.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {escalation.families?.name || 'Famille'}
                      </p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {escalation.reason}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(escalation.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant="destructive">Urgent</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Aucune escalade en attente</p>
              </div>
            )}
            <Link href="/coach/escalades">
              <Button variant="outline" className="mt-4 w-full">
                Voir toutes les escalades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Calendar className="h-5 w-5 text-primary" />
              Prochains rendez-vous
            </CardTitle>
            <CardDescription>
              Vos prochaines consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings && bookings.length > 0 ? (
              <ul className="space-y-4">
                {bookings.map((booking) => (
                  <li
                    key={booking.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {booking.families?.name || 'Famille'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date_time).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <Badge>{booking.type}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Aucun rendez-vous à venir</p>
              </div>
            )}
            <Link href="/coach/agenda">
              <Button variant="outline" className="mt-4 w-full">
                Voir l'agenda
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent families */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading">
            <Users className="h-5 w-5 text-primary" />
            Familles récentes
          </CardTitle>
          <CardDescription>
            Les dernières familles inscrites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {families && families.length > 0 ? (
            <div className="space-y-4">
              {families.slice(0, 5).map((family) => (
                <Link
                  key={family.id}
                  href={`/coach/familles/${family.id}`}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{family.name || 'Famille'}</p>
                    <p className="text-sm text-muted-foreground">
                      {family.children?.length || 0} enfant(s) •{' '}
                      Inscrit le {new Date(family.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      family.subscription_status === 'active'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {family.subscription_status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Users className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">Aucune famille inscrite</p>
            </div>
          )}
          <Link href="/coach/familles">
            <Button variant="outline" className="mt-4 w-full">
              Voir toutes les familles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
