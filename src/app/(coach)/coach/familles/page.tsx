// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Users, Search, ArrowRight, Baby } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export default async function CoachFamillesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all families with children and profiles
  const { data: families } = await supabase
    .from('families')
    .select(`
      *,
      children(*),
      profiles!families_parent_id_fkey(first_name, email)
    `)
    .order('created_at', { ascending: false })

  const activeFamilies = families?.filter(
    (f) => f.subscription_status === 'active'
  ) || []
  const inactiveFamilies = families?.filter(
    (f) => f.subscription_status !== 'active'
  ) || []

  function calculateAge(birthDate: string): string {
    const birth = new Date(birthDate)
    const today = new Date()
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())

    if (months < 12) {
      return `${months} mois`
    } else {
      const years = Math.floor(months / 12)
      return `${years} an${years > 1 ? 's' : ''}`
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Familles</h1>
          <p className="text-muted-foreground">
            Gérez les familles que vous accompagnez.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une famille..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filtrer</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
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
              <Users className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeFamilies.length}</p>
              <p className="text-sm text-muted-foreground">Actives</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inactiveFamilies.length}</p>
              <p className="text-sm text-muted-foreground">Inactives</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active families */}
      {activeFamilies.length > 0 && (
        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Familles actives
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeFamilies.map((family) => (
              <Link key={family.id} href={`/coach/familles/${family.id}`}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {family.name || 'Famille'}
                          </p>
                          <Badge>Actif</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {family.profiles?.first_name || 'Parent'} •{' '}
                          {family.profiles?.email}
                        </p>
                        {family.children && family.children.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {family.children.map((child: { id: string; first_name: string; birth_date: string }) => (
                              <span
                                key={child.id}
                                className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs"
                              >
                                <Baby className="h-3 w-3" />
                                {child.first_name} ({calculateAge(child.birth_date)})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Inactive families */}
      {inactiveFamilies.length > 0 && (
        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Familles inactives
          </h2>
          <div className="space-y-4">
            {inactiveFamilies.map((family) => (
              <Link key={family.id} href={`/coach/familles/${family.id}`}>
                <Card className="transition-shadow hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {family.name || 'Famille'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {family.profiles?.email}
                      </p>
                    </div>
                    <Badge variant="secondary">Inactif</Badge>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!families || families.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-heading text-lg font-semibold">
              Aucune famille
            </h3>
            <p className="mt-2 text-muted-foreground">
              Les familles inscrites apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
