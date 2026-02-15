-- Coaching Parental - Row Level Security Policies
-- Version: 1.0
-- Date: 2025-02-15

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Check if user is a member of a family
CREATE OR REPLACE FUNCTION is_family_member(family_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.family_members
    WHERE family_id = family_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is the coach of a family
CREATE OR REPLACE FUNCTION is_family_coach(family_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.families
    WHERE id = family_uuid AND coach_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is a coach
CREATE OR REPLACE FUNCTION is_coach()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'coach'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Coach can view coached family members"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.user_id = profiles.id AND f.coach_id = auth.uid()
    )
  );

-- ============================================
-- FAMILIES POLICIES
-- ============================================
CREATE POLICY "Family members can view their family"
  ON public.families FOR SELECT
  USING (is_family_member(id) OR coach_id = auth.uid());

CREATE POLICY "Coach can update their families"
  ON public.families FOR UPDATE
  USING (coach_id = auth.uid());

CREATE POLICY "Coach can create families"
  ON public.families FOR INSERT
  WITH CHECK (coach_id = auth.uid() AND is_coach());

-- ============================================
-- FAMILY MEMBERS POLICIES
-- ============================================
CREATE POLICY "Family members can view membership"
  ON public.family_members FOR SELECT
  USING (is_family_member(family_id) OR is_family_coach(family_id));

CREATE POLICY "Coach can manage family members"
  ON public.family_members FOR ALL
  USING (is_family_coach(family_id));

-- ============================================
-- CHILDREN POLICIES
-- ============================================
CREATE POLICY "Family can view children"
  ON public.children FOR SELECT
  USING (is_family_member(family_id) OR is_family_coach(family_id));

CREATE POLICY "Family can manage children"
  ON public.children FOR ALL
  USING (is_family_member(family_id));

-- ============================================
-- QUESTIONNAIRES POLICIES
-- ============================================
CREATE POLICY "Family can view questionnaires"
  ON public.questionnaires FOR SELECT
  USING (is_family_member(family_id) OR is_family_coach(family_id));

CREATE POLICY "Family can submit questionnaires"
  ON public.questionnaires FOR INSERT
  WITH CHECK (is_family_member(family_id));

-- ============================================
-- CONVERSATIONS POLICIES
-- ============================================
CREATE POLICY "Family can view conversations"
  ON public.conversations FOR SELECT
  USING (is_family_member(family_id) OR is_family_coach(family_id));

CREATE POLICY "Family can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (is_family_member(family_id));

-- ============================================
-- MESSAGES POLICIES
-- ============================================
CREATE POLICY "Family can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
      AND (is_family_member(c.family_id) OR is_family_coach(c.family_id))
    )
  );

CREATE POLICY "Family can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (is_family_member(c.family_id) OR is_family_coach(c.family_id))
    )
  );

-- ============================================
-- JOURNAL ENTRIES POLICIES
-- ============================================
CREATE POLICY "Family can view journal"
  ON public.journal_entries FOR SELECT
  USING (is_family_member(family_id) OR is_family_coach(family_id));

CREATE POLICY "Family can manage journal"
  ON public.journal_entries FOR ALL
  USING (is_family_member(family_id));

-- ============================================
-- GOALS POLICIES
-- ============================================
CREATE POLICY "Family can view goals"
  ON public.goals FOR SELECT
  USING (is_family_member(family_id) OR is_family_coach(family_id));

CREATE POLICY "Coach can manage goals"
  ON public.goals FOR ALL
  USING (is_family_coach(family_id));

CREATE POLICY "Family can update goal status"
  ON public.goals FOR UPDATE
  USING (is_family_member(family_id));

-- ============================================
-- DAILY HABITS POLICIES
-- ============================================
CREATE POLICY "Family can view habits"
  ON public.daily_habits FOR SELECT
  USING (is_family_member(family_id) OR is_family_coach(family_id));

CREATE POLICY "Coach can manage habits"
  ON public.daily_habits FOR ALL
  USING (is_family_coach(family_id));

-- ============================================
-- HABIT COMPLETIONS POLICIES
-- ============================================
CREATE POLICY "Family can view completions"
  ON public.habit_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.daily_habits h
      WHERE h.id = habit_completions.habit_id
      AND (is_family_member(h.family_id) OR is_family_coach(h.family_id))
    )
  );

CREATE POLICY "Family can manage completions"
  ON public.habit_completions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.daily_habits h
      WHERE h.id = habit_id
      AND is_family_member(h.family_id)
    )
  );

-- ============================================
-- ESCALATIONS POLICIES
-- ============================================
CREATE POLICY "Family can view escalations"
  ON public.escalations FOR SELECT
  USING (is_family_member(family_id) OR is_family_coach(family_id));

CREATE POLICY "Family can create escalations"
  ON public.escalations FOR INSERT
  WITH CHECK (is_family_member(family_id));

CREATE POLICY "Coach can update escalations"
  ON public.escalations FOR UPDATE
  USING (is_family_coach(family_id));

-- ============================================
-- BOOKINGS POLICIES (PUBLIC)
-- ============================================
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Coach can view all bookings"
  ON public.bookings FOR SELECT
  USING (is_coach());

CREATE POLICY "Coach can manage bookings"
  ON public.bookings FOR UPDATE
  USING (is_coach());

-- ============================================
-- BLOG POSTS POLICIES
-- ============================================
CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Coach can view all posts"
  ON public.blog_posts FOR SELECT
  USING (is_coach());

CREATE POLICY "Coach can manage posts"
  ON public.blog_posts FOR ALL
  USING (is_coach());

-- ============================================
-- TESTIMONIALS POLICIES
-- ============================================
CREATE POLICY "Anyone can view approved testimonials"
  ON public.testimonials FOR SELECT
  USING (approved = true);

CREATE POLICY "Coach can view all testimonials"
  ON public.testimonials FOR SELECT
  USING (is_coach());

CREATE POLICY "Coach can manage testimonials"
  ON public.testimonials FOR ALL
  USING (is_coach());
