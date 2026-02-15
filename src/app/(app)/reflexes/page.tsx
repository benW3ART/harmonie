// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Repeat, CheckCircle, Clock, Sun, Sunset, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const timeOfDayConfig = {
  morning: { label: 'Matin', icon: Sun, color: 'text-yellow-500' },
  afternoon: { label: 'Après-midi', icon: Sunset, color: 'text-orange-500' },
  evening: { label: 'Soir', icon: Moon, color: 'text-blue-500' },
}

interface Habit {
  id: string
  title: string
  description: string | null
  time_of_day: string | null
  active: boolean
  habit_completions: { completed_at: string }[]
}

export default function ReflexesPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: family } = await supabase
        .from('families')
        .select('id')
        .eq('parent_id', user.id)
        .single()

      if (!family) return

      const { data } = await supabase
        .from('daily_habits')
        .select('*, habit_completions(*)')
        .eq('family_id', family.id)
        .eq('active', true)
        .order('time_of_day')

      setHabits(data || [])
    } catch (error) {
      console.error('Error loading habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCompletion = async (habitId: string, isCompleted: boolean) => {
    setCompleting(habitId)
    try {
      if (isCompleted) {
        // Remove completion
        await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .gte('completed_at', today)
          .lt('completed_at', today + 'T23:59:59')
      } else {
        // Add completion
        await supabase.from('habit_completions').insert({
          habit_id: habitId,
          completed_at: new Date().toISOString(),
        })
      }
      await loadHabits()
    } catch (error) {
      console.error('Error toggling completion:', error)
    } finally {
      setCompleting(null)
    }
  }

  const isCompletedToday = (habit: Habit) => {
    return habit.habit_completions?.some((c) =>
      c.completed_at.startsWith(today)
    )
  }

  const morningHabits = habits.filter((h) => h.time_of_day === 'morning')
  const afternoonHabits = habits.filter((h) => h.time_of_day === 'afternoon')
  const eveningHabits = habits.filter((h) => h.time_of_day === 'evening')
  const otherHabits = habits.filter((h) => !h.time_of_day)

  const completedCount = habits.filter(isCompletedToday).length
  const totalCount = habits.length

  const HabitSection = ({
    title,
    icon: Icon,
    iconColor,
    habitList,
  }: {
    title: string
    icon: typeof Sun
    iconColor: string
    habitList: Habit[]
  }) => {
    if (habitList.length === 0) return null

    return (
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </h2>
        <div className="space-y-3">
          {habitList.map((habit) => {
            const completed = isCompletedToday(habit)
            return (
              <Card
                key={habit.id}
                className={`cursor-pointer transition-all ${
                  completed ? 'bg-success/5 border-success/30' : ''
                }`}
                onClick={() => toggleCompletion(habit.id, completed)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <button
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                      completed
                        ? 'bg-success text-white'
                        : 'border-2 border-muted-foreground/30 hover:border-primary'
                    }`}
                    disabled={completing === habit.id}
                  >
                    {completing === habit.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : null}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        completed ? 'line-through opacity-60' : ''
                      }`}
                    >
                      {habit.title}
                    </p>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Réflexes</h1>
          <p className="text-muted-foreground">
            Vos habitudes quotidiennes à ancrer.
          </p>
        </div>
        <Link href="/reflexes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau réflexe
          </Button>
        </Link>
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Progression du jour
                </p>
                <p className="text-2xl font-bold">
                  {completedCount}/{totalCount} réflexes
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">
                  {Math.round((completedCount / totalCount) * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habits by time of day */}
      <div className="space-y-8">
        <HabitSection
          title="Matin"
          icon={Sun}
          iconColor="text-yellow-500"
          habitList={morningHabits}
        />
        <HabitSection
          title="Après-midi"
          icon={Sunset}
          iconColor="text-orange-500"
          habitList={afternoonHabits}
        />
        <HabitSection
          title="Soir"
          icon={Moon}
          iconColor="text-blue-500"
          habitList={eveningHabits}
        />
        {otherHabits.length > 0 && (
          <HabitSection
            title="Autres"
            icon={Repeat}
            iconColor="text-primary"
            habitList={otherHabits}
          />
        )}
      </div>

      {/* Empty state */}
      {habits.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Repeat className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 font-heading text-lg font-semibold">
              Pas encore de réflexes
            </h3>
            <p className="mt-2 text-muted-foreground">
              Créez des habitudes quotidiennes pour améliorer votre quotidien.
            </p>
            <Link href="/reflexes/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer mon premier réflexe
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
