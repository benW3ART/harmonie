# Architecture Technique — Coaching Parental

> Version 1.0 | Date: 2025-02-15

## Stack Technique

### Framework & Language
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js 20 LTS

### Base de données & Auth
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email/password)
- **Storage**: Supabase Storage (photos profil)

### Styling
- **CSS**: Tailwind CSS 3.4
- **Components**: shadcn/ui (basé sur Radix)
- **Fonts**: Playfair Display + Quicksand (Google Fonts)
- **Icons**: Lucide React

### IA & Chat
- **LLM**: Anthropic Claude 3 Haiku (rapide, économique)
- **SDK**: Anthropic SDK + Vercel AI SDK
- **Streaming**: Server-Sent Events pour réponses IA en temps réel

### Intégrations Externes
- **WhatsApp**: WhatsApp Business Cloud API (Meta)
- **Instagram**: Instagram Messaging API (Meta)
- **Emails**: Resend (transactionnel)
- **Calendrier**: Cal.com (embed ou API)
- **Analytics**: Plausible (RGPD-friendly)

### Testing
- **Unit**: Vitest
- **E2E**: Playwright
- **API**: Supertest

### Deployment
- **Hosting**: Vercel
- **Database**: Supabase (managed)
- **CI/CD**: GitHub Actions

---

## Structure du Projet

```
harmonie/
├── .claude/                    # Configuration Genius Team
│   ├── plan.md                 # SINGLE SOURCE OF TRUTH - Task list
│   ├── discovery/              # Documents discovery
│   ├── design/                 # Design system & config
│   └── marketing/              # Marketing strategy
│
├── .genius/                    # State & memory Genius Team
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/        # Site vitrine (public)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── a-propos/
│   │   │   ├── services/
│   │   │   ├── temoignages/
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   └── rdv/
│   │   │
│   │   ├── (auth)/             # Auth pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   │
│   │   ├── (app)/              # Web App (authenticated)
│   │   │   ├── dashboard/      # Parent dashboard
│   │   │   ├── chat/           # Chat IA
│   │   │   ├── journal/        # Journal de bord
│   │   │   ├── objectifs/      # Goals
│   │   │   ├── reflexes/       # Daily habits
│   │   │   ├── parametres/     # Settings
│   │   │   └── onboarding/     # Questionnaire initial
│   │   │
│   │   ├── (coach)/            # Coach dashboard
│   │   │   ├── dashboard/
│   │   │   ├── familles/
│   │   │   │   └── [id]/
│   │   │   ├── escalations/
│   │   │   └── statistiques/
│   │   │
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── families/
│   │   │   ├── chat/
│   │   │   ├── journal/
│   │   │   ├── goals/
│   │   │   ├── habits/
│   │   │   ├── coach/
│   │   │   ├── booking/
│   │   │   └── webhooks/
│   │   │       ├── whatsapp/
│   │   │       └── instagram/
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── marketing/          # Site vitrine components
│   │   ├── app/                # Web app components
│   │   ├── coach/              # Coach dashboard components
│   │   └── shared/             # Shared components
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   └── middleware.ts   # Auth middleware
│   │   ├── ai/
│   │   │   ├── client.ts       # Anthropic client
│   │   │   ├── prompts.ts      # System prompts
│   │   │   └── extract.ts      # Journal extraction
│   │   ├── channels/
│   │   │   ├── whatsapp.ts     # WhatsApp API
│   │   │   └── instagram.ts    # Instagram API
│   │   ├── email/
│   │   │   └── resend.ts       # Email client
│   │   └── utils/
│   │       ├── dates.ts
│   │       └── validation.ts
│   │
│   ├── hooks/                  # React hooks
│   │   ├── use-chat.ts
│   │   ├── use-family.ts
│   │   └── use-auth.ts
│   │
│   ├── types/                  # TypeScript types
│   │   ├── database.ts         # Generated from Supabase
│   │   ├── api.ts
│   │   └── chat.ts
│   │
│   └── styles/
│       └── design-tokens.css   # CSS variables from design-config
│
├── supabase/
│   ├── migrations/             # Database migrations
│   ├── seed.sql               # Seed data
│   └── functions/             # Edge functions (if needed)
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── public/
│   ├── images/
│   └── fonts/
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Modèle de Données (Supabase)

### Tables

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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

-- Families
CREATE TABLE public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.profiles(id),
  status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family Members
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('primary', 'co_parent')) DEFAULT 'primary',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_id, user_id)
);

-- Children
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  sibling_position INTEGER DEFAULT 1
);

-- Questionnaires
CREATE TABLE public.questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('user', 'ai', 'coach')) NOT NULL,
  sender_id UUID,
  content TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('app', 'whatsapp', 'instagram')) DEFAULT 'app',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal Entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Goals
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
  target_date DATE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Habits
CREATE TABLE public.daily_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly')) DEFAULT 'daily',
  active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit Completions
CREATE TABLE public.habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES public.daily_habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_by UUID REFERENCES public.profiles(id),
  UNIQUE(habit_id, date)
);

-- Escalations
CREATE TABLE public.escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.messages(id),
  reason TEXT,
  status TEXT CHECK (status IN ('pending', 'acknowledged', 'resolved')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Bookings (site vitrine)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_datetime TIMESTAMPTZ NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  child_age TEXT,
  main_issue TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
-- ... (for all tables)

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Families: members can read their family
CREATE POLICY "Family members can view family" ON public.families
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_id = families.id AND user_id = auth.uid()
    )
    OR coach_id = auth.uid()
  );

-- Messages: family members can read/write their conversations
CREATE POLICY "Family members can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE c.id = messages.conversation_id AND fm.user_id = auth.uid()
    )
  );

-- Coach can see all their families' data
CREATE POLICY "Coach can view coached families" ON public.families
  FOR SELECT USING (coach_id = auth.uid());

-- ... (more policies)
```

---

## API Design

### Authentication Flow

```typescript
// POST /api/auth/register
// Creates user in Supabase Auth + profile

// POST /api/auth/login
// Returns session with JWT

// Middleware checks JWT on all /api/app/* and /api/coach/* routes
```

### Chat with AI

```typescript
// POST /api/chat/send
// 1. Get family context (children, questionnaire, recent journal)
// 2. Build prompt with context
// 3. Stream response from Claude
// 4. Save message to DB
// 5. Analyze for journal extraction
// 6. Check for escalation triggers
```

### Webhook Processing

```typescript
// POST /api/webhooks/whatsapp
// 1. Verify webhook signature
// 2. Extract sender phone number
// 3. Lookup user by whatsapp_number
// 4. If found, route to AI chat
// 5. Save message with channel='whatsapp'
// 6. Send AI response back via WhatsApp API
```

---

## Sécurité

### Authentication
- Supabase Auth avec JWT
- Sessions de 7 jours, refresh automatique
- Passwords hashés avec bcrypt (géré par Supabase)

### Authorization
- Row Level Security (RLS) sur toutes les tables
- Middleware Next.js vérifiant le JWT
- Rôles: parent, co_parent, coach

### Data Protection
- HTTPS obligatoire (Vercel)
- Variables d'environnement pour secrets
- Données sensibles jamais exposées côté client

### RGPD
- Consentement explicite à l'inscription
- Export des données sur demande
- Suppression de compte possible
- Rétention 2 ans après fin accompagnement

---

## Performance

### Targets
- LCP < 2s
- FID < 100ms
- CLS < 0.1
- P95 AI response < 5s

### Optimisations
- Static generation pour site vitrine
- ISR pour blog posts
- Streaming pour réponses IA
- Image optimization (next/image)
- Edge functions pour webhooks

---

## Deployment

### Environnements
- **Development**: Local (next dev + Supabase local)
- **Staging**: Vercel Preview (branch-based)
- **Production**: Vercel Production

### CI/CD
```yaml
# .github/workflows/ci.yml
- Run lint & type-check
- Run unit tests
- Run E2E tests
- Deploy to Vercel
```

### Environment Variables
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
ANTHROPIC_API_KEY=

# WhatsApp
WHATSAPP_PHONE_ID=
WHATSAPP_TOKEN=
WHATSAPP_VERIFY_TOKEN=

# Instagram
INSTAGRAM_PAGE_ID=
INSTAGRAM_ACCESS_TOKEN=

# Email
RESEND_API_KEY=

# Analytics
PLAUSIBLE_DOMAIN=
```

---

## Monitoring

### Logs
- Vercel Functions logs
- Supabase logs

### Metrics
- Vercel Analytics (Web Vitals)
- Plausible (custom events)
- Supabase Dashboard (DB metrics)

### Alerts
- Vercel Checks (build failures)
- Supabase alerts (DB issues)
- Custom: Escalations non traitées > 2h

---

## Summary

| Aspect | Choice |
|--------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Styling | Tailwind + shadcn/ui |
| AI | Claude 3 Haiku |
| Hosting | Vercel |
| Analytics | Plausible |
