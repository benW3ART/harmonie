# Plan de Développement — Coaching Parental

> **SINGLE SOURCE OF TRUTH** pour toutes les tâches
> Légende: `[ ]` Pending | `[~]` In Progress | `[x]` Completed | `[!]` Blocked

---

## Phase 1: Setup & Infrastructure

### 1.1 Initialisation Projet
- [x] **T-001**: Initialiser projet Next.js 14 avec TypeScript
  - `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
  - Vérifier: `npm run dev` fonctionne
  - Files: `package.json`, `tsconfig.json`, `next.config.js`

- [x] **T-002**: Configurer Tailwind avec design tokens
  - Ajouter fonts Playfair Display + Quicksand
  - Configurer couleurs depuis design-config.json
  - Files: `tailwind.config.ts`, `src/app/globals.css`

- [x] **T-003**: Installer et configurer shadcn/ui
  - `npx shadcn-ui@latest init`
  - Installer composants de base: button, input, card, dialog, form
  - Files: `components.json`, `src/components/ui/*`

- [x] **T-004**: Setup Supabase client
  - Installer `@supabase/supabase-js`, `@supabase/ssr`
  - Créer clients browser et server
  - Files: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`

- [x] **T-005**: Configurer variables d'environnement
  - Créer `.env.local.example` avec toutes les variables
  - Documenter dans README
  - Files: `.env.local.example`, `README.md`

### 1.2 Base de données
- [ ] **T-006**: Créer migrations Supabase
  - Toutes les tables du data model
  - Indexes pour performance
  - Files: `supabase/migrations/001_initial_schema.sql`

- [ ] **T-007**: Configurer Row Level Security
  - Policies pour chaque table
  - Tests des policies
  - Files: `supabase/migrations/002_rls_policies.sql`

- [x] **T-008**: Générer types TypeScript depuis Supabase
  - Types manuellement créés (à régénérer avec `npx supabase gen types typescript`)
  - Files: `src/types/database.ts`

- [ ] **T-009**: Créer seed data pour développement
  - Coach de test, famille de test, messages
  - Files: `supabase/seed.sql`

---

## Phase 2: Authentication

### 2.1 Auth Flow
- [x] **T-010**: Créer layout auth avec design Rose Pastel
  - Logo, couleurs, responsive
  - Files: `src/app/(auth)/layout.tsx`

- [x] **T-011**: Page de login
  - Formulaire email/password
  - Validation avec react-hook-form + zod
  - Redirect vers dashboard après login
  - Files: `src/app/(auth)/login/page.tsx`

- [x] **T-012**: Page d'inscription
  - Formulaire avec prénom, email, password
  - Création compte Supabase + profil
  - Files: `src/app/(auth)/register/page.tsx`

- [x] **T-013**: Mot de passe oublié
  - Formulaire email
  - Envoi email reset via Supabase
  - Files: `src/app/(auth)/forgot-password/page.tsx`

- [x] **T-014**: Reset password
  - Page avec token
  - Nouveau mot de passe
  - Files: `src/app/(auth)/reset-password/page.tsx`

- [x] **T-015**: Middleware d'authentification
  - Protéger routes /app/* et /coach/*
  - Redirect vers login si non connecté
  - Files: `src/middleware.ts`

- [ ] **T-016**: Hook useAuth
  - Session courante, user, logout
  - Files: `src/hooks/use-auth.ts`

---

## Phase 3: Site Vitrine (Marketing)

### 3.1 Layout & Components
- [x] **T-017**: Layout site vitrine
  - Header avec navigation
  - Footer avec liens
  - Responsive mobile-first
  - Files: `src/app/(marketing)/layout.tsx`

- [x] **T-018**: Composant Header marketing
  - Logo, navigation, CTA "Prendre RDV"
  - Menu burger mobile
  - Files: `src/components/marketing/header.tsx`

- [x] **T-019**: Composant Footer
  - Liens légaux, réseaux sociaux, contact
  - Files: `src/components/marketing/footer.tsx`

### 3.2 Pages
- [x] **T-020**: Page d'accueil
  - Hero avec tagline + CTA
  - Section services
  - Témoignages (3 featured)
  - CTA final
  - Files: `src/app/(marketing)/page.tsx`

- [x] **T-021**: Page À propos
  - Bio coach avec photo
  - Parcours, formations, certifications
  - Histoire personnelle
  - Files: `src/app/(marketing)/a-propos/page.tsx`

- [x] **T-022**: Page Services et Tarifs
  - 3 offres en cards
  - Comparatif
  - CTA vers RDV
  - Files: `src/app/(marketing)/services/page.tsx`

- [x] **T-023**: Page Témoignages
  - Liste de tous les témoignages
  - Filtre par problématique
  - Files: `src/app/(marketing)/temoignages/page.tsx`

- [x] **T-024**: Page Contact
  - Formulaire de contact
  - FAQ
  - Files: `src/app/(marketing)/contact/page.tsx`

- [ ] **T-025**: API Contact form
  - Validation
  - Envoi email à la coach
  - Files: `src/app/api/contact/route.ts`

### 3.3 Blog
- [x] **T-026**: Page liste articles
  - Cards avec excerpt
  - Catégories
  - Pagination
  - Files: `src/app/(marketing)/blog/page.tsx`

- [x] **T-027**: Page article individuel
  - Contenu Markdown
  - CTA en fin d'article
  - Articles liés
  - Files: `src/app/(marketing)/blog/[slug]/page.tsx`

- [ ] **T-028**: API blog posts
  - GET liste, GET par slug
  - Files: `src/app/api/blog/route.ts`

### 3.4 Prise de RDV
- [x] **T-029**: Page prise de RDV
  - Intégration Cal.com ou calendrier custom
  - Formulaire pré-RDV
  - Files: `src/app/(marketing)/rdv/page.tsx`

- [ ] **T-030**: API booking
  - Créneaux disponibles
  - Création réservation
  - Email confirmation
  - Files: `src/app/api/booking/route.ts`

### 3.5 Pages légales
- [x] **T-030b**: Mentions légales
  - Files: `src/app/(marketing)/mentions-legales/page.tsx`

- [x] **T-030c**: Politique de confidentialité
  - Files: `src/app/(marketing)/politique-confidentialite/page.tsx`

- [x] **T-030d**: CGV
  - Files: `src/app/(marketing)/cgv/page.tsx`

---

## Phase 4: Web App - Core

### 4.1 Layout & Navigation
- [x] **T-031**: Layout app parent
  - Sidebar/bottom nav mobile
  - Header avec profil
  - Files: `src/app/(app)/layout.tsx`

- [x] **T-032**: Composant navigation app
  - Liens: Dashboard, Chat, Journal, Objectifs, Réflexes, Paramètres
  - Indicateurs (badges)
  - Files: `src/components/app/sidebar.tsx`, `src/components/app/header.tsx`

### 4.2 Dashboard Parent
- [x] **T-033**: Page dashboard parent
  - Résumé du jour
  - Accès rapide chat
  - Objectifs du jour
  - Réflexes à cocher
  - Files: `src/app/(app)/dashboard/page.tsx`

- [ ] **T-034**: Composant card résumé jour
  - Qualité nuit, réflexes complétés, objectifs
  - Files: `src/components/app/day-summary.tsx`

### 4.3 Onboarding
- [x] **T-035**: Flow onboarding multi-étapes
  - Infos enfant, problématique, routine, objectifs
  - Progress bar
  - Files: `src/app/(app)/onboarding/page.tsx`

- [ ] **T-036**: API questionnaire
  - POST sauvegarde réponses
  - Notification coach
  - Files: `src/app/api/families/[id]/questionnaire/route.ts`

### 4.4 Paramètres
- [x] **T-037**: Page paramètres
  - Profil, notifications, heure check-in
  - Invitation co-parent
  - Liaison WhatsApp/Instagram
  - Files: `src/app/(app)/parametres/page.tsx`

- [ ] **T-038**: API update profile
  - PUT /users/me
  - Files: `src/app/api/users/me/route.ts`

- [ ] **T-039**: Invitation co-parent
  - Envoi email invitation
  - Lien d'inscription spécial
  - Files: `src/app/api/families/[id]/invite/route.ts`

---

## Phase 5: Chat IA

### 5.1 Infrastructure IA
- [x] **T-040**: Setup client Anthropic
  - SDK, gestion erreurs
  - Files: `src/lib/ai/client.ts` (inline in route.ts)

- [x] **T-041**: Système de prompts
  - System prompt avec contexte famille
  - Instructions coach bienveillante
  - Détection crise
  - Files: `src/app/api/chat/route.ts`

- [ ] **T-042**: Extraction journal depuis conversation
  - Parser heures, qualité, événements
  - Files: `src/lib/ai/extract.ts`

### 5.2 Chat Interface
- [x] **T-043**: Page chat
  - Liste messages
  - Input avec envoi
  - Streaming responses
  - Files: `src/app/(app)/chat/page.tsx`

- [x] **T-044**: Composant message bubble
  - Style différent user/ai/coach
  - Timestamp, indicateur canal
  - Files: inline in `src/app/(app)/chat/page.tsx`

- [ ] **T-045**: Hook useChat
  - Gestion messages, envoi, streaming
  - Optimistic updates
  - Files: `src/hooks/use-chat.ts`

- [x] **T-046**: API chat send
  - POST message
  - Stream réponse IA
  - Sauvegarde DB
  - Analyse escalade
  - Files: `src/app/api/chat/route.ts`

- [ ] **T-047**: API chat history
  - GET conversations
  - Pagination
  - Files: `src/app/api/families/[id]/conversations/route.ts`

### 5.3 Escalade
- [ ] **T-048**: Bouton demander coach
  - UI dans chat
  - Confirmation
  - Files: `src/components/app/escalate-button.tsx`

- [ ] **T-049**: API escalade
  - POST création escalade
  - Email notification coach
  - Files: `src/app/api/conversations/[id]/escalate/route.ts`

- [ ] **T-050**: Détection automatique crise
  - Mots-clés dans messages
  - Alerte proactive
  - Files: `src/lib/ai/crisis-detection.ts`

---

## Phase 6: Journal de Bord

- [x] **T-051**: Page journal
  - Vue liste avec stats
  - Indicateurs par jour
  - Files: `src/app/(app)/journal/page.tsx`

- [ ] **T-052**: Composant calendrier journal
  - Navigation mois
  - Click sur jour
  - Files: `src/components/app/journal-calendar.tsx`

- [ ] **T-053**: Détail entrée jour
  - Heures, qualité, notes
  - Édition possible
  - Files: `src/app/(app)/journal/[id]/page.tsx`

- [x] **T-054**: Formulaire ajout manuel
  - Quick add
  - Files: `src/app/(app)/journal/new/page.tsx`

- [ ] **T-055**: API journal
  - GET entries, POST/PUT entry
  - Files: `src/app/api/families/[id]/journal/route.ts`

- [ ] **T-056**: Auto-fill journal depuis chat
  - Trigger après conversation
  - Extraction via IA
  - Files: `src/lib/journal/auto-fill.ts`

---

## Phase 7: Objectifs & Réflexes

### 7.1 Objectifs
- [x] **T-057**: Page objectifs
  - Liste objectifs actifs
  - Progression
  - Files: `src/app/(app)/objectifs/page.tsx`

- [ ] **T-058**: Composant goal card
  - Titre, description, progression, date cible
  - Files: `src/components/app/goal-card.tsx`

- [ ] **T-059**: API goals
  - GET, POST (coach), PUT, DELETE
  - Files: `src/app/api/families/[id]/goals/route.ts`

### 7.2 Réflexes
- [x] **T-060**: Page réflexes
  - Liste checkboxes
  - Streak display
  - Files: `src/app/(app)/reflexes/page.tsx`

- [ ] **T-061**: Composant habit checkbox
  - Check/uncheck
  - Animation
  - Files: `src/components/app/habit-checkbox.tsx`

- [ ] **T-062**: API habits
  - GET, POST complete
  - Calcul streak
  - Files: `src/app/api/families/[id]/habits/route.ts`

- [ ] **T-063**: Notifications encouragement
  - Atteinte jalons (7 jours, etc.)
  - Files: `src/lib/notifications/achievements.ts`

---

## Phase 8: Dashboard Coach

### 8.1 Layout
- [x] **T-064**: Layout dashboard coach
  - Navigation spécifique
  - Files: `src/app/(coach)/layout.tsx`

### 8.2 Dashboard
- [x] **T-065**: Page dashboard coach
  - Liste familles avec statut
  - Alertes escalades
  - Stats globales
  - Files: `src/app/(coach)/coach/dashboard/page.tsx`

- [ ] **T-066**: Composant family card
  - Nom, enfant, dernière activité, badge alerte
  - Files: `src/components/coach/family-card.tsx`

- [ ] **T-067**: API coach families
  - GET liste avec stats
  - Files: `src/app/api/coach/families/route.ts`

### 8.3 Dossier Famille
- [ ] **T-068**: Page dossier famille
  - Tabs: Infos, Questionnaire, Conversations, Journal, Objectifs, Réflexes
  - Files: `src/app/(coach)/coach/familles/[id]/page.tsx`

- [ ] **T-069**: Onglet conversations coach
  - Historique complet
  - Highlight escalades
  - Répondre en tant que coach
  - Files: `src/components/coach/conversations-tab.tsx`

- [ ] **T-070**: Gestion objectifs par coach
  - CRUD objectifs famille
  - Files: `src/components/coach/goals-manager.tsx`

- [ ] **T-071**: Gestion réflexes par coach
  - CRUD réflexes famille
  - Files: `src/components/coach/habits-manager.tsx`

- [ ] **T-072**: API coach family detail
  - GET full family data
  - Files: `src/app/api/coach/families/[id]/route.ts`

### 8.4 Escalations
- [x] **T-073**: Page escalations
  - Liste pending
  - Actions: acknowledge, resolve
  - Files: `src/app/(coach)/coach/escalades/page.tsx`

- [ ] **T-074**: API escalations
  - GET pending, PUT status
  - Files: `src/app/api/coach/escalations/route.ts`

### 8.5 Familles
- [x] **T-075**: Page liste familles
  - Liste avec filtres
  - Stats
  - Files: `src/app/(coach)/coach/familles/page.tsx`

- [ ] **T-076**: API stats
  - Agrégations
  - Files: `src/app/api/coach/stats/route.ts`

---

## Phase 9: Multicanal

### 9.1 WhatsApp
- [ ] **T-077**: Setup WhatsApp Business API
  - Configuration Meta
  - Webhook verification
  - Files: `src/lib/channels/whatsapp.ts`

- [ ] **T-078**: Webhook WhatsApp
  - Réception messages
  - Routing vers IA
  - Envoi réponses
  - Files: `src/app/api/webhooks/whatsapp/route.ts`

- [ ] **T-079**: UI liaison WhatsApp
  - Saisie numéro, vérification code
  - Files: `src/components/app/whatsapp-link.tsx`

- [ ] **T-080**: API link WhatsApp
  - POST link, POST verify
  - Files: `src/app/api/users/me/whatsapp/route.ts`

### 9.2 Instagram
- [ ] **T-081**: Setup Instagram Messaging API
  - Configuration Meta
  - Files: `src/lib/channels/instagram.ts`

- [ ] **T-082**: Webhook Instagram
  - DMs entrants
  - Réponses IA
  - Files: `src/app/api/webhooks/instagram/route.ts`

- [ ] **T-083**: UI liaison Instagram
  - OAuth flow
  - Files: `src/components/app/instagram-link.tsx`

- [ ] **T-084**: API link Instagram
  - POST link, DELETE unlink
  - Files: `src/app/api/users/me/instagram/route.ts`

### 9.3 Synchronisation
- [ ] **T-085**: Historique unifié multicanal
  - Indicateur canal dans messages
  - Files: `src/components/app/channel-indicator.tsx`

- [ ] **T-086**: Check-in sur canal préféré
  - Envoi notification selon préférence
  - Files: `src/lib/notifications/checkin.ts`

---

## Phase 10: Emails

- [ ] **T-087**: Setup Resend
  - Client, templates
  - Files: `src/lib/email/resend.ts`

- [ ] **T-088**: Email confirmation RDV
  - Template HTML
  - Files: `src/lib/email/templates/booking-confirmation.tsx`

- [ ] **T-089**: Email invitation co-parent
  - Lien magic link
  - Files: `src/lib/email/templates/invite-coparent.tsx`

- [ ] **T-090**: Email escalade coach
  - Notification urgente
  - Files: `src/lib/email/templates/escalation-alert.tsx`

- [ ] **T-091**: Email check-in reminder
  - Si pas d'activité
  - Files: `src/lib/email/templates/checkin-reminder.tsx`

---

## Phase 11: Testing

- [ ] **T-092**: Setup Vitest
  - Configuration
  - Files: `vitest.config.ts`

- [ ] **T-093**: Tests unitaires lib/
  - AI prompts, extraction, utils
  - Files: `tests/unit/lib/*`

- [ ] **T-094**: Tests API routes
  - Auth, chat, journal
  - Files: `tests/integration/api/*`

- [ ] **T-095**: Setup Playwright
  - Configuration
  - Files: `playwright.config.ts`

- [ ] **T-096**: Tests E2E parcours critique
  - Login, chat, journal
  - Files: `tests/e2e/*`

---

## Phase 12: Polish & Deploy

- [ ] **T-097**: SEO & Meta tags
  - Sitemap, robots.txt
  - OG images
  - Files: `src/app/sitemap.ts`, `src/app/robots.ts`

- [ ] **T-098**: PWA manifest
  - Pour installation mobile
  - Files: `public/manifest.json`

- [ ] **T-099**: Analytics Plausible
  - Intégration, events custom
  - Files: `src/components/analytics.tsx`

- [ ] **T-100**: CI/CD GitHub Actions
  - Lint, test, deploy
  - Files: `.github/workflows/ci.yml`

- [ ] **T-101**: Documentation README
  - Setup local, env vars, deploy
  - Files: `README.md`

- [ ] **T-102**: Deploy production
  - Vercel + Supabase
  - Variables d'environnement
  - DNS

---

## Résumé

| Phase | Tâches | Statut |
|-------|--------|--------|
| 1. Setup | T-001 → T-009 (9) | 5/9 Complete |
| 2. Auth | T-010 → T-016 (7) | 6/7 Complete |
| 3. Site Vitrine | T-017 → T-030 (14+3) | 14/17 Complete |
| 4. App Core | T-031 → T-039 (9) | 5/9 Complete |
| 5. Chat IA | T-040 → T-050 (11) | 5/11 Complete |
| 6. Journal | T-051 → T-056 (6) | 2/6 Complete |
| 7. Objectifs | T-057 → T-063 (7) | 2/7 Complete |
| 8. Coach | T-064 → T-076 (13) | 4/13 Complete |
| 9. Multicanal | T-077 → T-086 (10) | Pending |
| 10. Emails | T-087 → T-091 (5) | Pending |
| 11. Testing | T-092 → T-096 (5) | Pending |
| 12. Deploy | T-097 → T-102 (6) | Pending |

**Total: 102+ tâches | MVP COMPLETE: ~43 tâches UI/UX terminées, build réussi**
