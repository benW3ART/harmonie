import type { Database } from './database'

// Table row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Family = Database['public']['Tables']['families']['Row']
export type Child = Database['public']['Tables']['children']['Row']
export type JournalEntry = Database['public']['Tables']['journal_entries']['Row']
export type Goal = Database['public']['Tables']['goals']['Row']
export type DailyHabit = Database['public']['Tables']['daily_habits']['Row']
export type HabitCompletion = Database['public']['Tables']['habit_completions']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Escalation = Database['public']['Tables']['escalations']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Questionnaire = Database['public']['Tables']['questionnaires']['Row']

// Insert types
export type FamilyInsert = Database['public']['Tables']['families']['Insert']
export type ChildInsert = Database['public']['Tables']['children']['Insert']
export type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert']
export type GoalInsert = Database['public']['Tables']['goals']['Insert']
export type DailyHabitInsert = Database['public']['Tables']['daily_habits']['Insert']
export type HabitCompletionInsert = Database['public']['Tables']['habit_completions']['Insert']
export type QuestionnaireInsert = Database['public']['Tables']['questionnaires']['Insert']

// Extended types with relations
export type FamilyWithChildren = Family & {
  children?: Child[]
}

export type FamilyWithProfile = Family & {
  profiles?: Profile | null
}

export type FamilyWithAll = Family & {
  children?: Child[]
  profiles?: Profile | null
}

export type HabitWithCompletions = DailyHabit & {
  habit_completions?: HabitCompletion[]
}

export type EscalationWithFamily = Escalation & {
  families?: FamilyWithProfile | null
}

export type BookingWithFamily = Booking & {
  families?: Family | null
}
