// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Calendar, Moon, Apple, Heart, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

const moodEmojis = {
  great: '😊',
  good: '🙂',
  neutral: '😐',
  bad: '😔',
  terrible: '😢',
}

const moodLabels = {
  great: 'Super',
  good: 'Bien',
  neutral: 'Neutre',
  bad: 'Difficile',
  terrible: 'Très difficile',
}

export default async function JournalPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get family
  const { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('parent_id', user.id)
    .single()

  // Get journal entries
  const { data: entries } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('family_id', family?.id)
    .order('date', { ascending: false })
    .limit(30)

  // Group entries by month
  const entriesByMonth = entries?.reduce((acc, entry) => {
    const month = new Date(entry.date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
    })
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(entry)
    return acc
  }, {} as Record<string, typeof entries>)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Journal</h1>
          <p className="text-muted-foreground">
            Suivez l'évolution de votre famille au quotidien.
          </p>
        </div>
        <Link href="/journal/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle entrée
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{entries?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Entrées totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Moon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {entries?.filter((e) => e.sleep_quality === 'good' || e.sleep_quality === 'great').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Bonnes nuits</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Apple className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {entries?.filter((e) => e.meals_quality === 'good' || e.meals_quality === 'great').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Bons repas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {entries?.filter((e) => e.mood === 'good' || e.mood === 'great').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Bonnes journées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entries */}
      {entries && entries.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(entriesByMonth || {}).map(([month, monthEntries]) => (
            <div key={month}>
              <h2 className="mb-4 font-heading text-xl font-semibold capitalize">
                {month}
              </h2>
              <div className="space-y-4">
                {monthEntries?.map((entry) => (
                  <Link key={entry.id} href={`/journal/${entry.id}`}>
                    <Card className="transition-shadow hover:shadow-lg">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl">
                          {entry.mood ? moodEmojis[entry.mood as keyof typeof moodEmojis] : '📝'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {new Date(entry.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            {entry.mood && (
                              <Badge variant="secondary">
                                {moodLabels[entry.mood as keyof typeof moodLabels]}
                              </Badge>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                              {entry.notes}
                            </p>
                          )}
                          <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                            {entry.sleep_quality && (
                              <span className="flex items-center gap-1">
                                <Moon className="h-3 w-3" />
                                Nuit: {entry.sleep_quality}
                              </span>
                            )}
                            {entry.meals_quality && (
                              <span className="flex items-center gap-1">
                                <Apple className="h-3 w-3" />
                                Repas: {entry.meals_quality}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-heading text-lg font-semibold">
              Pas encore d'entrées
            </h3>
            <p className="mt-2 text-muted-foreground">
              Commencez à suivre le quotidien de votre famille.
            </p>
            <Link href="/journal/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première entrée
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
