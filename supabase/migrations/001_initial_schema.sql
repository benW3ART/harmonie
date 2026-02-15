-- Coaching Parental - Initial Schema
-- Version: 1.0
-- Date: 2025-02-15

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  role TEXT CHECK (role IN ('parent', 'co_parent', 'coach')) DEFAULT 'parent',
  photo_url TEXT,
  checkin_time TIME DEFAULT '08:00',
  preferred_channel TEXT CHECK (preferred_channel IN ('app', 'whatsapp', 'instagram')) DEFAULT 'app',
  whatsapp_number TEXT,
  whatsapp_verified BOOLEAN DEFAULT FALSE,
  instagram_username TEXT,
  instagram_linked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FAMILIES
-- ============================================
CREATE TABLE public.families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES public.profiles(id),
  status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FAMILY MEMBERS
-- ============================================
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('primary', 'co_parent')) DEFAULT 'primary',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_id, user_id)
);

-- ============================================
-- CHILDREN
-- ============================================
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  sibling_position INTEGER DEFAULT 1
);

-- ============================================
-- QUESTIONNAIRES
-- ============================================
CREATE TABLE public.questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONVERSATIONS
-- ============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('user', 'ai', 'coach')) NOT NULL,
  sender_id UUID,
  content TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('app', 'whatsapp', 'instagram')) DEFAULT 'app',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOURNAL ENTRIES
-- ============================================
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id),
  date DATE NOT NULL,
  bedtime TIME,
  waketime TIME,
  night_wakings INTEGER,
  quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),
  notes TEXT,
  auto_filled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_id, child_id, date)
);

-- ============================================
-- GOALS
-- ============================================
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
  target_date DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DAILY HABITS
-- ============================================
CREATE TABLE public.daily_habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly')) DEFAULT 'daily',
  active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HABIT COMPLETIONS
-- ============================================
CREATE TABLE public.habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES public.daily_habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES public.profiles(id),
  UNIQUE(habit_id, date)
);

-- ============================================
-- ESCALATIONS
-- ============================================
CREATE TABLE public.escalations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.messages(id),
  reason TEXT,
  status TEXT CHECK (status IN ('pending', 'acknowledged', 'resolved')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ============================================
-- BOOKINGS (Site vitrine)
-- ============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_datetime TIMESTAMPTZ NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  child_age TEXT,
  main_issue TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('sommeil', 'nutrition', 'comportement')),
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TESTIMONIALS
-- ============================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  child_age TEXT,
  initial_problem TEXT,
  result TEXT NOT NULL,
  quote TEXT NOT NULL,
  photo_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_family_members_family ON public.family_members(family_id);
CREATE INDEX idx_family_members_user ON public.family_members(user_id);
CREATE INDEX idx_children_family ON public.children(family_id);
CREATE INDEX idx_conversations_family ON public.conversations(family_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_journal_entries_family_date ON public.journal_entries(family_id, date DESC);
CREATE INDEX idx_goals_family ON public.goals(family_id);
CREATE INDEX idx_habits_family ON public.daily_habits(family_id);
CREATE INDEX idx_habit_completions_habit_date ON public.habit_completions(habit_id, date DESC);
CREATE INDEX idx_escalations_family_status ON public.escalations(family_id, status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
