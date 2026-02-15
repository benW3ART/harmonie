'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Moon, Apple, Heart, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import type { Family, JournalEntryInsert } from '@/types/helpers'

const moodOptions = [
  { value: 'great', emoji: '😊', label: 'Super' },
  { value: 'good', emoji: '🙂', label: 'Bien' },
  { value: 'neutral', emoji: '😐', label: 'Neutre' },
  { value: 'bad', emoji: '😔', label: 'Difficile' },
  { value: 'terrible', emoji: '😢', label: 'Très difficile' },
]

const qualityOptions = [
  { value: 'great', label: 'Excellent' },
  { value: 'good', label: 'Bon' },
  { value: 'neutral', label: 'Moyen' },
  { value: 'bad', label: 'Mauvais' },
  { value: 'terrible', label: 'Très mauvais' },
]

export default function NewJournalEntryPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [mood, setMood] = useState('')
  const [sleepQuality, setSleepQuality] = useState('')
  const [mealsQuality, setMealsQuality] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      // Get family
      const { data: familyData } = await supabase
        .from('families')
        .select('id')
        .eq('parent_id', user.id)
        .single()

      const family = familyData as Family | null
      if (!family) throw new Error('No family')

      // Create journal entry
      const entry: JournalEntryInsert = {
        family_id: family.id,
        date,
        mood: mood || null,
        sleep_quality: sleepQuality || null,
        meals_quality: mealsQuality || null,
        notes: notes || null,
      }

      const { error } = await supabase
        .from('journal_entries')
        .insert(entry as never)

      if (error) throw error

      router.push('/journal')
      router.refresh()
    } catch (error) {
      console.error('Error creating journal entry:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/journal">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold">Nouvelle entrée</h1>
          <p className="text-muted-foreground">
            Comment s'est passée votre journée ?
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </CardContent>
        </Card>

        {/* Mood */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-pink-500" />
              Humeur générale
            </CardTitle>
            <CardDescription>
              Comment vous êtes-vous sentie aujourd'hui ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMood(option.value)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-4 transition-colors ${
                    mood === option.value
                      ? 'border-primary bg-primary/10'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Moon className="h-5 w-5 text-blue-500" />
              Qualité du sommeil
            </CardTitle>
            <CardDescription>
              Comment s'est passée la nuit ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {qualityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSleepQuality(option.value)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    sleepQuality === option.value
                      ? 'border-primary bg-primary text-white'
                      : 'hover:border-primary/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Apple className="h-5 w-5 text-green-500" />
              Qualité des repas
            </CardTitle>
            <CardDescription>
              Comment se sont passés les repas ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {qualityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMealsQuality(option.value)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    mealsQuality === option.value
                      ? 'border-primary bg-primary text-white'
                      : 'hover:border-primary/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
            <CardDescription>
              Ajoutez des détails ou observations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Qu'y a-t-il à noter pour cette journée ?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Link href="/journal" className="flex-1">
            <Button variant="outline" className="w-full">
              Annuler
            </Button>
          </Link>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
