-- Migration: Align SQL schema with TypeScript types
-- Version: 3.0
-- Date: 2025-02-15

-- ============================================
-- FAMILIES - Add missing columns and fix status
-- ============================================
ALTER TABLE public.families 
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Rename status to subscription_status and update values
ALTER TABLE public.families 
  DROP CONSTRAINT IF EXISTS families_status_check;

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'families' AND column_name = 'status') THEN
    ALTER TABLE public.families RENAME COLUMN status TO subscription_status;
  END IF;
END $$;

ALTER TABLE public.families 
  ADD CONSTRAINT families_subscription_status_check 
  CHECK (subscription_status IN ('active', 'inactive', 'trial', 'expired'));

-- Update existing values
UPDATE public.families SET subscription_status = 'active' WHERE subscription_status = 'completed';
UPDATE public.families SET subscription_status = 'inactive' WHERE subscription_status = 'paused';

-- ============================================
-- CONVERSATIONS - Fix channel values
-- ============================================
ALTER TABLE public.conversations 
  DROP CONSTRAINT IF EXISTS conversations_channel_check;

ALTER TABLE public.conversations 
  ADD CONSTRAINT conversations_channel_check 
  CHECK (channel IN ('web', 'whatsapp', 'instagram'));

UPDATE public.conversations SET channel = 'web' WHERE channel = 'app';

-- ============================================
-- MESSAGES - Rename sender_type to role, add metadata
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'sender_type') THEN
    ALTER TABLE public.messages RENAME COLUMN sender_type TO role;
  END IF;
END $$;

ALTER TABLE public.messages 
  DROP CONSTRAINT IF EXISTS messages_sender_type_check,
  DROP CONSTRAINT IF EXISTS messages_role_check;

ALTER TABLE public.messages 
  ADD CONSTRAINT messages_role_check 
  CHECK (role IN ('user', 'assistant', 'coach'));

UPDATE public.messages SET role = 'assistant' WHERE role = 'ai';

ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Drop channel from messages (it's on conversation)
ALTER TABLE public.messages DROP COLUMN IF EXISTS channel;
ALTER TABLE public.messages DROP COLUMN IF EXISTS sender_id;

-- ============================================
-- JOURNAL_ENTRIES - Update fields
-- ============================================
ALTER TABLE public.journal_entries
  ADD COLUMN IF NOT EXISTS mood TEXT,
  ADD COLUMN IF NOT EXISTS sleep_quality TEXT,
  ADD COLUMN IF NOT EXISTS meals_quality TEXT;

-- Migrate old data if exists
UPDATE public.journal_entries 
SET sleep_quality = CASE 
  WHEN quality_score = 5 THEN 'excellent'
  WHEN quality_score = 4 THEN 'good'
  WHEN quality_score = 3 THEN 'average'
  WHEN quality_score = 2 THEN 'poor'
  WHEN quality_score = 1 THEN 'terrible'
  ELSE NULL
END
WHERE sleep_quality IS NULL AND quality_score IS NOT NULL;

-- Drop old columns
ALTER TABLE public.journal_entries 
  DROP COLUMN IF EXISTS bedtime,
  DROP COLUMN IF EXISTS waketime,
  DROP COLUMN IF EXISTS night_wakings,
  DROP COLUMN IF EXISTS quality_score;

-- ============================================
-- GOALS - Update status values, add category
-- ============================================
ALTER TABLE public.goals 
  DROP CONSTRAINT IF EXISTS goals_status_check;

ALTER TABLE public.goals 
  ADD COLUMN IF NOT EXISTS category TEXT;

ALTER TABLE public.goals 
  ADD CONSTRAINT goals_status_check 
  CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused'));

UPDATE public.goals SET status = 'not_started' WHERE status = 'active';
UPDATE public.goals SET status = 'paused' WHERE status = 'abandoned';

-- ============================================
-- DAILY_HABITS - Add time_of_day
-- ============================================
ALTER TABLE public.daily_habits 
  ADD COLUMN IF NOT EXISTS time_of_day TEXT 
  CHECK (time_of_day IN ('morning', 'afternoon', 'evening'));

-- ============================================
-- HABIT_COMPLETIONS - Change date to completed_at
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'habit_completions' AND column_name = 'date') THEN
    ALTER TABLE public.habit_completions RENAME COLUMN date TO completed_at;
    ALTER TABLE public.habit_completions ALTER COLUMN completed_at TYPE TIMESTAMPTZ USING completed_at::TIMESTAMPTZ;
  END IF;
END $$;

ALTER TABLE public.habit_completions DROP COLUMN IF EXISTS completed;

-- Drop old unique constraint
ALTER TABLE public.habit_completions DROP CONSTRAINT IF EXISTS habit_completions_habit_id_date_key;

-- ============================================
-- BOOKINGS - Restructure for app use
-- ============================================
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id),
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'discovery',
  ADD COLUMN IF NOT EXISTS notes TEXT;

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'slot_datetime') THEN
    ALTER TABLE public.bookings RENAME COLUMN slot_datetime TO date_time;
  END IF;
END $$;

-- Keep client fields for now (legacy support), they can be dropped later
-- ALTER TABLE public.bookings DROP COLUMN IF EXISTS client_name, client_email, client_phone, child_age, main_issue;

-- ============================================
-- CHILDREN - Add gender and created_at
-- ============================================
ALTER TABLE public.children 
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('M', 'F')),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- QUESTIONNAIRES - Add type
-- ============================================
ALTER TABLE public.questionnaires 
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'onboarding';

-- ============================================
-- ESCALATIONS - Add priority
-- ============================================
ALTER TABLE public.escalations 
  ADD COLUMN IF NOT EXISTS priority TEXT 
  CHECK (priority IN ('low', 'medium', 'high', 'urgent')) 
  DEFAULT 'medium';

-- ============================================
-- BLOG_POSTS - Add extra fields, fix category
-- ============================================
ALTER TABLE public.blog_posts 
  DROP CONSTRAINT IF EXISTS blog_posts_category_check;

ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS read_time INTEGER,
  ADD COLUMN IF NOT EXISTS author TEXT;

-- ============================================
-- Update indexes
-- ============================================
DROP INDEX IF EXISTS idx_habit_completions_habit_date;
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_completed ON public.habit_completions(habit_id, completed_at DESC);
