import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(time: string): string {
  return time.slice(0, 5) // HH:MM
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return "À l'instant"
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`
  return formatDate(d)
}

export function calculateStreak(completions: { date: string; completed: boolean }[]): number {
  if (!completions.length) return 0

  const sortedCompletions = [...completions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < sortedCompletions.length; i++) {
    const completionDate = new Date(sortedCompletions[i].date)
    completionDate.setHours(0, 0, 0, 0)

    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - i)

    if (completionDate.getTime() === expectedDate.getTime() && sortedCompletions[i].completed) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function getQualityColor(score: number): string {
  if (score >= 4) return 'bg-success'
  if (score >= 3) return 'bg-warning'
  return 'bg-destructive'
}

export function getQualityLabel(score: number): string {
  if (score >= 4) return 'Bonne nuit'
  if (score >= 3) return 'Nuit moyenne'
  return 'Nuit difficile'
}
