export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          role: 'parent' | 'co_parent' | 'coach'
          photo_url: string | null
          checkin_time: string
          preferred_channel: 'app' | 'whatsapp' | 'instagram'
          whatsapp_number: string | null
          whatsapp_verified: boolean
          instagram_username: string | null
          instagram_linked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          role?: 'parent' | 'co_parent' | 'coach'
          photo_url?: string | null
          checkin_time?: string
          preferred_channel?: 'app' | 'whatsapp' | 'instagram'
          whatsapp_number?: string | null
          whatsapp_verified?: boolean
          instagram_username?: string | null
          instagram_linked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          role?: 'parent' | 'co_parent' | 'coach'
          photo_url?: string | null
          checkin_time?: string
          preferred_channel?: 'app' | 'whatsapp' | 'instagram'
          whatsapp_number?: string | null
          whatsapp_verified?: boolean
          instagram_username?: string | null
          instagram_linked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      families: {
        Row: {
          id: string
          parent_id: string
          name: string | null
          coach_id: string | null
          subscription_status: 'active' | 'inactive' | 'trial' | 'expired'
          onboarding_completed: boolean
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          name?: string | null
          coach_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'trial' | 'expired'
          onboarding_completed?: boolean
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          name?: string | null
          coach_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'trial' | 'expired'
          onboarding_completed?: boolean
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string
          role: 'primary' | 'co_parent'
          joined_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          role?: 'primary' | 'co_parent'
          joined_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          role?: 'primary' | 'co_parent'
          joined_at?: string
        }
      }
      children: {
        Row: {
          id: string
          family_id: string
          first_name: string
          birth_date: string
          gender: 'M' | 'F' | null
          sibling_position: number
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          first_name: string
          birth_date: string
          gender?: 'M' | 'F' | null
          sibling_position?: number
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          first_name?: string
          birth_date?: string
          gender?: 'M' | 'F' | null
          sibling_position?: number
          created_at?: string
        }
      }
      questionnaires: {
        Row: {
          id: string
          family_id: string
          type: string
          responses: Json
          submitted_at: string
        }
        Insert: {
          id?: string
          family_id: string
          type: string
          responses: Json
          submitted_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          type?: string
          responses?: Json
          submitted_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          family_id: string
          channel: 'web' | 'whatsapp' | 'instagram'
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          channel?: 'web' | 'whatsapp' | 'instagram'
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          channel?: 'web' | 'whatsapp' | 'instagram'
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'coach'
          content: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'coach'
          content: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'coach'
          content?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          family_id: string
          child_id: string | null
          date: string
          mood: string | null
          sleep_quality: string | null
          meals_quality: string | null
          notes: string | null
          auto_filled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          child_id?: string | null
          date: string
          mood?: string | null
          sleep_quality?: string | null
          meals_quality?: string | null
          notes?: string | null
          auto_filled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          child_id?: string | null
          date?: string
          mood?: string | null
          sleep_quality?: string | null
          meals_quality?: string | null
          notes?: string | null
          auto_filled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          family_id: string
          title: string
          description: string | null
          category: string | null
          status: 'not_started' | 'in_progress' | 'completed' | 'paused'
          target_date: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          title: string
          description?: string | null
          category?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'paused'
          target_date?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          title?: string
          description?: string | null
          category?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'paused'
          target_date?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      daily_habits: {
        Row: {
          id: string
          family_id: string
          title: string
          description: string | null
          time_of_day: 'morning' | 'afternoon' | 'evening' | null
          frequency: 'daily' | 'weekly'
          active: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          title: string
          description?: string | null
          time_of_day?: 'morning' | 'afternoon' | 'evening' | null
          frequency?: 'daily' | 'weekly'
          active?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          title?: string
          description?: string | null
          time_of_day?: 'morning' | 'afternoon' | 'evening' | null
          frequency?: 'daily' | 'weekly'
          active?: boolean
          created_by?: string | null
          created_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          completed_at: string
          completed_by: string | null
        }
        Insert: {
          id?: string
          habit_id: string
          completed_at?: string
          completed_by?: string | null
        }
        Update: {
          id?: string
          habit_id?: string
          completed_at?: string
          completed_by?: string | null
        }
      }
      escalations: {
        Row: {
          id: string
          family_id: string
          message_id: string | null
          reason: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'pending' | 'acknowledged' | 'resolved'
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          family_id: string
          message_id?: string | null
          reason?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'acknowledged' | 'resolved'
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          family_id?: string
          message_id?: string | null
          reason?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'acknowledged' | 'resolved'
          created_at?: string
          resolved_at?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          family_id: string | null
          type: string
          date_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id?: string | null
          type: string
          date_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string | null
          type?: string
          date_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string
          category: string | null
          image_url: string | null
          read_time: number | null
          author: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string | null
          content: string
          category?: string | null
          image_url?: string | null
          read_time?: number | null
          author?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string | null
          content?: string
          category?: string | null
          image_url?: string | null
          read_time?: number | null
          author?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          child_age: string | null
          initial_problem: string | null
          result: string
          quote: string
          photo_url: string | null
          featured: boolean
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          child_age?: string | null
          initial_problem?: string | null
          result: string
          quote: string
          photo_url?: string | null
          featured?: boolean
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          child_age?: string | null
          initial_problem?: string | null
          result?: string
          quote?: string
          photo_url?: string | null
          featured?: boolean
          approved?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
