# MatchUp

**Find your next game.** Pick-up match organizer app — create, discover, and join casual sports matchups in your area. Built for the Capital One Sprint hackathon.

Live demo: [matchup deployment on Vercel]

---

> **⚠️ Note about commits and PRs**
>
> Due to Vercel's deployment policies, once we set up the deployment, **only one team member was able to create pull requests** to prevent Vercel from failing with permission errors when trying to deploy from accounts without access to the project. This means that even though the commits and PRs appear to be authored by a single person on GitHub, **the entire team contributed equally** to the code. Every feature, fix, and refactor was worked on collaboratively — the name on the commits show who wrote the code.

---

## Features

- **Auth flow** — Email/password signup with email confirmation, Google OAuth, password reset, hCaptcha bot protection
- **Create matchups** — Pick a sport, set date/time/location, max players, skill level, and visibility (public/private)
- **Location picker** — Autocomplete search powered by Amazon Location Service with interactive map (click to adjust)
- **Dashboard explore** — Browse open matchups filtered by sport, with skeleton loading states
- **Canchas map** — View all open matchups on an interactive map with sport-specific pins (Tabler Icons), filter by sport, tap a pin to see the matchup card
- **Matchup detail** — Hero image per sport, player list, organizer tools (cancel matchup), join/leave actions with full validation (capacity, status, already joined, organizer cannot leave)
- **Realtime chat** — Each matchup has its own live chat powered by Supabase Realtime (`postgres_changes` subscription)
- **Profile** — User stats (matchups played / organized / no-shows), sports practiced with counts and progress bars, match history with temporal status badges (`JUGADO`, `EN VIVO`, `PRÓXIMO`, `CANCELADO`)
- **My Matchups tab** — List of confirmed matchups sorted by date, player count, or skill level
- **Onboarding** — Post-registration skill level selection
- **Notifications** — Organizer gets notified when a player joins (Postgres trigger → `notifications` table)
- **Brutalist design system** — Epilogue + Inter fonts, high-contrast dark theme, custom color tokens

---

## Tech Stack

### Core

| Layer               | Technology                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------- |
| **Framework**       | [Next.js 15](https://nextjs.org/) (App Router, Server Components, Middleware)            |
| **Language**        | TypeScript (strict mode, `noUncheckedIndexedAccess`)                                     |
| **Styling**         | [Tailwind CSS 4](https://tailwindcss.com/) (via `@theme`) + custom brutalist tokens      |
| **Icons**           | [Lucide React](https://lucide.dev/) (UI) + [Tabler Icons](https://tabler.io/icons) (map) |
| **Animations**      | [Motion (formerly Framer Motion)](https://motion.dev/)                                   |
| **Form validation** | [Zod](https://zod.dev/)                                                                  |

### Backend & Data

| Feature           | Technology                                                                              |
| ----------------- | --------------------------------------------------------------------------------------- |
| **Database**      | [Supabase](https://supabase.com/) (PostgreSQL)                                          |
| **Auth**          | Supabase Auth (email/password, Google OAuth, email confirmation, password reset)        |
| **Realtime chat** | Supabase Realtime (`postgres_changes` channel on `reta_chat` table)                     |
| **Notifications** | Postgres trigger → `notifications` table                                                |
| **SSR auth**      | `@supabase/ssr` with cookie-based session (middleware uses `getSession()` for fast SSR) |
| **File Storage**  | AWS S3 (profile pictures — scaffolded)                                                  |

### Maps & Location

| Feature           | Technology                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Map rendering** | [MapLibre GL JS](https://maplibre.org/) with [Amazon Location Service](https://aws.amazon.com/location/) Standard style (Dark color scheme) |
| **Place search**  | Amazon Location **Places API v2** (`/suggest` + `/geocode` endpoints) — no SDK required, direct HTTPS calls with API Key                    |
| **User location** | Browser `navigator.geolocation` with Mexico City fallback                                                                                   |
| **Pin markers**   | Custom DOM markers with diamond shape, color-coded + Tabler sport icons per sport                                                           |

### Security

| Feature              | Technology                                                                        |
| -------------------- | --------------------------------------------------------------------------------- |
| **Bot protection**   | [hCaptcha](https://www.hcaptcha.com/) on all auth forms (integrated via Supabase) |
| **Input validation** | Zod schemas on both client and API routes                                         |
| **Middleware auth**  | Route protection for `/dashboard/**` via Next.js middleware                       |
| **CSRF**             | Supabase cookies are `httpOnly` + `sameSite`                                      |

### Testing & Tooling

| Tool                | Purpose                      |
| ------------------- | ---------------------------- |
| **Jest**            | Unit tests                   |
| **Testing Library** | Component tests              |
| **Playwright**      | E2E tests                    |
| **ESLint**          | Lint with `--max-warnings 0` |
| **Prettier**        | Code formatting              |
| **TypeScript**      | Strict type checking         |
| **pnpm**            | Package manager              |

### Deployment & CI/CD

| Service            | Usage                                                 |
| ------------------ | ----------------------------------------------------- |
| **Vercel**         | Production deployment (root: `frontend/`)             |
| **GitHub Actions** | CI: lint, typecheck, format, tests, build on every PR |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth pages: login, register, check-email, forgot/update password
│   │   ├── auth/callback/        # OAuth callback handler
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Home — explore matchups with sport filter
│   │   │   ├── map/              # Canchas tab — matchups on interactive map
│   │   │   ├── matches/
│   │   │   │   ├── [id]/         # Matchup detail (players, chat, join/leave)
│   │   │   │   └── create/       # Create matchup with location picker
│   │   │   ├── matchups/         # "My Matchups" — confirmed matchups with sorting
│   │   │   └── profile/          # User profile with stats, sports, history
│   │   ├── api/matches/          # REST API route (Zod-validated)
│   │   ├── onboarding/           # Post-signup skill level selection
│   │   └── layout.tsx            # Root layout with force-dynamic rendering
│   ├── components/
│   │   ├── auth/                 # AuthBackground, CaptchaWidget
│   │   ├── chat/                 # ChatWindow with Realtime subscription
│   │   ├── layout/               # TopNav, BottomNav
│   │   ├── map/                  # LocationPicker (AWS Location + MapLibre)
│   │   ├── matches/              # MatchCard, MatchHero, PlayersList, MatchActionBar, etc.
│   │   └── ui/                   # EmptyState, LoadingSkeleton, Spinner, FormField, ErrorAlert
│   ├── hooks/                    # use-auth, use-matches
│   ├── lib/
│   │   ├── aws-location.ts       # Places API v2 wrapper (searchPlaces, geocodeText)
│   │   ├── supabase/             # client, server, middleware (SSR auth)
│   │   ├── email-templates/      # Brutalist HTML templates for Supabase auth emails
│   │   ├── sport-images.ts       # Sport → Unsplash image map
│   │   └── validations/          # Zod schemas
│   ├── services/                 # matches, users, chat, notifications
│   └── types/                    # TypeScript types + DB types
├── tests/                        # Unit + E2E tests
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase project ([supabase.com](https://supabase.com))
- AWS account with **Amazon Location Service** API key
- hCaptcha account ([hcaptcha.com](https://www.hcaptcha.com))

### Setup

1. **Clone** the repository:

   ```bash
   git clone git@github.com:Fernando-Mauro/sprint-capital-one.git
   cd sprint-capital-one/frontend
   ```

2. **Install** dependencies:

   ```bash
   pnpm install
   ```

3. **Environment variables** — create `frontend/.env`:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...

   # hCaptcha (bot protection on auth forms)
   NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-site-key

   # Amazon Location Service
   NEXT_PUBLIC_AWS_REGION=us-east-1
   NEXT_PUBLIC_AWS_MAP_STYLE=Standard
   NEXT_PUBLIC_AWS_MAP_COLOR_SCHEME=Dark
   NEXT_PUBLIC_AWS_MAP_API_KEY=v1.public.xxx

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database schema** — apply `db/schema.sql` to your Supabase project via SQL Editor.

5. **Configure Supabase Dashboard**:
   - **Authentication → Providers → Google**: enable and configure OAuth credentials
   - **Authentication → Email Templates**: paste the HTML templates from `frontend/src/lib/email-templates/`
   - **Authentication → Bot and Abuse Protection**: enable hCaptcha and paste your Secret Key

6. **Configure AWS Amazon Location Service**:
   - Create a Map (style `Standard`, color scheme `Dark`)
   - Create an API Key scoped to maps + places
   - No Place Index needed — Places API v2 uses the API key directly

7. **Start** the dev server:

   ```bash
   pnpm dev
   ```

8. Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Start Next.js dev server            |
| `pnpm build`        | Production build                    |
| `pnpm start`        | Run production build                |
| `pnpm lint`         | ESLint with zero warnings           |
| `pnpm typecheck`    | Strict TypeScript check             |
| `pnpm format`       | Prettier format                     |
| `pnpm format:check` | Prettier verification (used in CI)  |
| `pnpm test`         | Run Jest unit tests                 |
| `pnpm test:e2e`     | Run Playwright E2E tests            |
| `pnpm validate`     | Run lint + typecheck + test + build |

---

## Database Schema

See [`db/schema.sql`](./db/schema.sql) for the full schema. Key tables:

- **`users`** — Profiles (extends `auth.users`)
- **`sports`** — Sport catalog (Fútbol, Basquetbol, etc.)
- **`retas`** — Matchups with location (lat/lng), date, max players, status
- **`reta_players`** — Join table with role (organizer/player) and status (confirmed/kicked/etc.)
- **`reta_chat`** — Realtime messages per matchup
- **`notifications`** — Player-join notifications for organizers

> Note: The DB tables are named `retas` (Spanish for "challenges") for historical reasons. All user-facing strings use "matchup" instead.

---

## Architecture Decisions

- **Force-dynamic rendering** at the root layout — every page uses Supabase at runtime, so static generation is disabled to avoid env var issues during build.
- **`getSession()` in middleware** instead of `getUser()` — reads cookies locally (~0ms) instead of calling Supabase (~300ms), eliminating SSR latency.
- **Fresh Supabase clients per service call** (`getSupabase()` factory) instead of module-level singleton — avoids stale auth tokens that caused "second request fails" bugs.
- **Places API v2 direct HTTPS** instead of AWS SDK — smaller bundle, no auth helper needed, just POST with API key in query string.
- **Renaming strategy**: Database schema keeps Spanish names (`retas`, `reta_players`) because the data is already there. All UI text, component names, and route paths use English/anglicized "matchup".

---

## Contributing

1. Create a branch from `master`: `git checkout -b feature/my-feature`
2. Follow the brutalist design system (uppercase headlines, high contrast, Epilogue font, etc.)
3. Use strict TypeScript — no `any` except when interop with third-party libs (React 19 type mismatches)
4. Run `pnpm validate` locally before pushing
5. Open a PR to `master` — CI runs lint, typecheck, format, and build checks

---

## Team

Built by **Muchachos, idk** — Capital One Sprint 2026.

## License

Private — Capital One Sprint Project
