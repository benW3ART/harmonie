export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
        Relationships: []
      }
      families: {
        Row: {
          id: string
          parent_id: string | null
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
          parent_id?: string | null
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
          parent_id?: string | null
          name?: string | null
          coach_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'trial' | 'expired'
          onboarding_completed?: boolean
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "families_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "families_coach_id_fkey"
            columns: ["coach_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "children_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          }
        ]
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
          type?: string
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
        Relationships: [
          {
            foreignKeyName: "questionnaires_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "conversations_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "journal_entries_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_child_id_fkey"
            columns: ["child_id"]
            referencedRelation: "children"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "goals_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "daily_habits_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_habits_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            referencedRelation: "daily_habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_completions_completed_by_fkey"
            columns: ["completed_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "escalations_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_message_id_fkey"
            columns: ["message_id"]
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          family_id: string | null
          type: string
          date_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          client_name: string | null
          client_email: string | null
          client_phone: string | null
          child_age: string | null
          main_issue: string | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id?: string | null
          type?: string
          date_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          child_age?: string | null
          main_issue?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string | null
          type?: string
          date_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string | null
          client_name?: string | null
          client_email?: string | null
          client_phone?: string | null
          child_age?: string | null
          main_issue?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "families"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
