# AGENTS.md — AI Agent Knowledge Base for MatchUp

> **Every agent MUST read this file before making any changes to the codebase.**

---

## Project Overview

**MatchUp** is a pick-up match organizer app that lets users create, discover, and join casual sports matches in their area. Built with:

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Backend / Auth / DB**: Supabase (PostgreSQL + Auth + RLS + Realtime)
- **File Storage**: AWS S3 (profile pictures, match media)
- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Deployment**: Vercel
- **Package Manager**: pnpm

---

## Project Structure

```
/
├── AGENTS.md                      # THIS FILE — read before every task
├── README.md                      # Project readme & setup guide
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI pipeline (lint, type-check, test, build)
├── scripts/
│   └── check-file-length.sh       # Enforces max 500 lines per file
├── frontend/                      # Next.js application
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages & API routes
│   │   │   ├── globals.css        # Tailwind imports + CSS custom properties
│   │   │   ├── layout.tsx         # Root layout (providers, fonts)
│   │   │   ├── page.tsx           # Landing / home page
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx     # Dashboard shell (sidebar, nav)
│   │   │   │   ├── page.tsx       # Dashboard home (upcoming matches)
│   │   │   │   ├── matches/
│   │   │   │   │   ├── page.tsx   # Browse / search matches
│   │   │   │   │   ├── create/page.tsx
│   │   │   │   │   └── [id]/page.tsx  # Match detail
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx   # User profile
│   │   │   └── api/
│   │   │       ├── matches/route.ts   # Match CRUD API
│   │   │       ├── upload/route.ts    # S3 presigned URL generation
│   │   │       └── webhooks/
│   │   │           └── supabase/route.ts  # Supabase webhook handler
│   │   ├── components/
│   │   │   ├── ui/                # Shared UI primitives (buttons, inputs, cards)
│   │   │   ├── matches/           # Match-specific components
│   │   │   ├── auth/              # Auth forms, guards
│   │   │   └── layout/            # Nav, sidebar, footer
│   │   ├── hooks/
│   │   │   ├── use-auth.ts        # Authentication hook
│   │   │   ├── use-matches.ts     # Match data hooks
│   │   │   └── use-upload.ts      # S3 upload hook
│   │   ├── services/
│   │   │   ├── matches.ts         # Match CRUD operations
│   │   │   ├── users.ts           # User profile operations
│   │   │   ├── upload.ts          # S3 file upload logic
│   │   │   └── notifications.ts   # Notification service
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts      # Browser Supabase client
│   │   │   │   ├── server.ts      # Server-side Supabase client
│   │   │   │   ├── middleware.ts   # Supabase auth middleware helpers
│   │   │   │   └── types.ts       # Generated DB types (from supabase gen types)
│   │   │   ├── s3/
│   │   │   │   └── client.ts      # AWS S3 client configuration
│   │   │   └── utils.ts           # General utility functions
│   │   ├── types/
│   │   │   ├── index.ts           # Barrel export for all types
│   │   │   ├── matches.ts         # Match domain types
│   │   │   └── database.ts        # Database row/insert/update types
│   │   └── middleware.ts           # Next.js middleware (auth redirect)
│   └── tests/
│       ├── unit/
│       │   └── services/          # Unit tests for service layer
│       │       └── matches.test.ts
│       └── e2e/
│           └── matches.spec.ts    # Playwright E2E tests
├── backend/                       # Database & server-side config
│   └── supabase/
│       ├── migrations/            # SQL migration files
│       │   └── 00001_initial_schema.sql
│       └── seed.sql               # Development seed data
├── public/                        # Static assets
├── next.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── jest.config.ts
├── playwright.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── .prettierrc
├── .env.example
└── .gitignore
```

---

## Clean Code Guidelines

### 1. File Length Limit — MAX 500 LINES

No source file may exceed **500 lines** (excluding blank lines and comments in the count is optional, but the raw file must stay ≤ 500 lines). If a file approaches this limit, **split it**:

- Extract sub-components into their own files.
- Move helper functions to `src/lib/utils.ts` or a dedicated utility module.
- Split large service files by domain responsibility.

**CI enforces this** — the `check-file-length.sh` script will fail the build if any `.ts` or `.tsx` file in `src/` exceeds 500 lines.

### 2. Linting — ESLint (Strict)

We use ESLint flat config (`eslint.config.mjs`) with the following rulesets:

| Ruleset                                             | Purpose                                           |
| --------------------------------------------------- | ------------------------------------------------- |
| `@typescript-eslint/recommended-type-checked`       | Type-aware TS rules                               |
| `@typescript-eslint/strict-type-checked`            | Strict TS rules (no `any`, no unsafe assignments) |
| `eslint-plugin-import`                              | Import ordering & restrictions                    |
| `eslint-plugin-react` + `eslint-plugin-react-hooks` | React best practices                              |
| `eslint-plugin-jsx-a11y`                            | Accessibility                                     |
| `@next/eslint-plugin-next`                          | Next.js specific rules                            |

**Key rules:**

- **`no-explicit-any`**: NEVER use `any`. Use `unknown` and narrow, or define proper types.
- **`no-unused-vars`**: No dead code. Prefix unused params with `_` if unavoidable.
- **`consistent-type-imports`**: Always use `import type` for type-only imports.
- **`no-console`**: Use a proper logger or remove before committing. `console.error` is allowed in catch blocks only.

### 3. TypeScript — Strict Mode

`tsconfig.json` enables:

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "forceConsistentCasingInFileNames": true,
  "exactOptionalPropertyTypes": true
}
```

**Rules:**

- All function parameters and return types MUST be explicitly typed (no inferred `any`).
- All API responses MUST be validated with a schema (Zod recommended).
- Never use `as` type assertions unless absolutely necessary — prefer type guards.
- Use `satisfies` operator for type checking object literals.

### 4. Import Rules — No Deep Internal Imports

Imports must follow these rules:

```tsx
// ❌ FORBIDDEN — deep internal import reaching into a module's internals
import { formatDate } from '../../lib/utils/date/formatters';

// ✅ CORRECT — import from the module's public barrel export
import { formatDate } from '@/lib/utils';

// ❌ FORBIDDEN — relative imports that go up more than one level
import { Button } from '../../../components/ui/Button';

// ✅ CORRECT — always use the path alias
import { Button } from '@/components/ui/Button';
```

**Rules:**

1. **Always use `@/` path alias** — no `../` beyond one level up.
2. **Barrel exports** — Each module directory should have an `index.ts` that re-exports its public API.
3. **No circular dependencies** — ESLint `import/no-cycle` is enabled.
4. **Import order** (enforced by ESLint):
   1. Node built-ins (`node:fs`, `node:path`)
   2. External packages (`react`, `next`, `@supabase/supabase-js`)
   3. Internal aliases (`@/lib/`, `@/services/`, `@/components/`)
   4. Relative imports (`./`, `../`)
   5. Type imports (always last, with `import type`)

### 5. Naming Conventions

| Entity                | Convention                          | Example                       |
| --------------------- | ----------------------------------- | ----------------------------- |
| Files (components)    | `kebab-case.tsx`                    | `match-card.tsx`              |
| Files (utilities)     | `kebab-case.ts`                     | `date-utils.ts`               |
| Files (types)         | `kebab-case.ts`                     | `matches.ts`                  |
| React components      | `PascalCase`                        | `MatchCard`                   |
| Functions / hooks     | `camelCase`                         | `useMatches`, `formatDate`    |
| Constants             | `UPPER_SNAKE_CASE`                  | `MAX_PLAYERS`, `API_BASE_URL` |
| Types / Interfaces    | `PascalCase`                        | `Match`, `CreateMatchInput`   |
| Enums                 | `PascalCase` (members `PascalCase`) | `MatchStatus.Completed`       |
| Database columns      | `snake_case`                        | `created_at`, `player_count`  |
| Environment variables | `UPPER_SNAKE_CASE`                  | `NEXT_PUBLIC_SUPABASE_URL`    |

### 6. Component Guidelines

- **Functional components only** — no class components.
- **One component per file** — exception: small tightly-coupled sub-components.
- **Props via interface** — always define a `Props` interface (or `ComponentNameProps`).
- **No inline styles** — use Tailwind classes or CSS modules.
- **Server Components by default** — only add `'use client'` when truly needed (state, effects, browser APIs).
- **Colocation** — keep component-specific utils and types close to the component.

### 7. Error Handling

- **Service layer**: Always return `{ data, error }` tuples — never throw from services.
- **API routes**: Use consistent error response format: `{ error: string, code: string }`.
- **Components**: Use React Error Boundaries for rendering errors.
- **Async operations**: Always handle both success and failure paths.

```tsx
// ✅ Service pattern
export async function getMatch(id: string): Promise<ServiceResult<Match>> {
  // TODO: implement
}

// ✅ API route pattern
export async function GET(request: Request): Promise<Response> {
  // TODO: implement with proper try/catch and status codes
}
```

### 8. Git & Branch Conventions

| Branch           | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `master`         | Production — deployed to Vercel           |
| `develop`        | Integration branch — PRs merge here first |
| `feature/<name>` | New features                              |
| `fix/<name>`     | Bug fixes                                 |
| `chore/<name>`   | Config, deps, docs                        |

- All PRs require passing CI checks.
- All PRs require at least 1 review.
- Squash merge to keep history clean.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.

---

## Database Schema

### Tables

| Table                | Purpose                 | Key Columns                                                                                                                                                                            |
| -------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`              | User profiles           | `id`, `email`, `display_name`, `avatar_url`, `bio`, `location`, `created_at`                                                                                                           |
| `matches`            | Pick-up match events    | `id`, `organizer_id` (FK→users), `title`, `sport`, `location_name`, `latitude`, `longitude`, `starts_at`, `ends_at`, `max_players`, `status`, `description`, `image_url`, `created_at` |
| `match_participants` | Users joined to matches | `id`, `match_id` (FK→matches), `user_id` (FK→users), `status` (joined/waitlisted/cancelled), `joined_at`                                                                               |
| `match_messages`     | In-match chat           | `id`, `match_id` (FK→matches), `user_id` (FK→users), `content`, `created_at`                                                                                                           |
| `sports`             | Sport types             | `id`, `name`, `icon`, `default_player_count`                                                                                                                                           |
| `notifications`      | User notifications      | `id`, `user_id` (FK→users), `type`, `title`, `body`, `data` (jsonb), `read`, `created_at`                                                                                              |
| `media`              | Uploaded images/files   | `id`, `user_id` (FK→users), `match_id` (FK→matches, nullable), `s3_key`, `url`, `type` (avatar/match_photo), `created_at`                                                              |

### Enums

```sql
CREATE TYPE match_status AS ENUM ('draft', 'open', 'full', 'in_progress', 'completed', 'cancelled');
CREATE TYPE participant_status AS ENUM ('joined', 'waitlisted', 'cancelled');
CREATE TYPE notification_type AS ENUM ('match_joined', 'match_cancelled', 'match_starting', 'match_full', 'new_message');
```

### Key RLS Policies

- **users**: Users can read any profile; can only update their own.
- **matches**: Anyone authenticated can read; only organizer can update/delete.
- **match_participants**: Users can read participants of matches they belong to; can insert/delete their own participation.
- **match_messages**: Only participants of a match can read/write messages.
- **media**: Users can read all media; can only insert/delete their own.

### Supabase Client Pattern

```tsx
// ❌ WRONG — throws error when no row found
const { data } = await supabase.from('matches').select('*').eq('id', id).single();

// ✅ CORRECT — returns null gracefully
const { data } = await supabase.from('matches').select('*').eq('id', id).maybeSingle();
```

---

## Key Services

### `services/matches.ts`

- `getMatches(filters)` — Fetch matches with optional filters (sport, location, date)
- `getMatchById(id)` — Single match with participants
- `createMatch(input)` — Create new match
- `updateMatch(id, input)` — Update match details
- `cancelMatch(id)` — Soft cancel a match
- `joinMatch(matchId, userId)` — Join / waitlist for a match
- `leaveMatch(matchId, userId)` — Leave a match

### `services/users.ts`

- `getUserProfile(id)` — Fetch user profile
- `updateUserProfile(id, input)` — Update profile fields
- `getUserMatches(userId)` — Matches a user has joined/organized

### `services/upload.ts`

- `generatePresignedUrl(key, contentType)` — Get S3 presigned upload URL
- `deleteFile(key)` — Remove file from S3
- `getPublicUrl(key)` — Get CDN/public URL for a file

### `services/notifications.ts`

- `getNotifications(userId)` — Fetch user notifications
- `markAsRead(notificationIds)` — Mark notifications read
- `createNotification(input)` — Create notification (internal use)

---

## Authentication Flow

1. **Sign up / Sign in** via Supabase Auth (email + password, OAuth providers).
2. **Session management** handled by Supabase SSR helpers in `middleware.ts`.
3. **Middleware** (`src/middleware.ts`) checks session on every request:
   - No session + protected route → redirect to `/login`
   - Valid session + auth route → redirect to `/dashboard`
4. **Server Components** use `createServerClient()` from `@/lib/supabase/server`.
5. **Client Components** use `createBrowserClient()` from `@/lib/supabase/client`.

---

## AWS S3 Integration

- **Bucket**: One bucket with prefixes: `avatars/`, `matches/`
- **Upload flow**:
  1. Client requests presigned URL from `/api/upload`
  2. API validates auth, generates presigned PUT URL (5 min TTL)
  3. Client uploads directly to S3 via presigned URL
  4. Client confirms upload → save S3 key to database
- **Access**: Public read via CloudFront CDN (or S3 public access w/ bucket policy)
- **Allowed types**: `image/jpeg`, `image/png`, `image/webp` — max 5MB
- **Key format**: `{type}/{userId}/{uuid}.{ext}` (e.g., `avatars/abc123/def456.webp`)

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=          # Server-only: service role key

# AWS S3
AWS_S3_BUCKET_NAME=                 # S3 bucket name
AWS_S3_REGION=                      # e.g., us-east-1
AWS_ACCESS_KEY_ID=                  # IAM user access key
AWS_SECRET_ACCESS_KEY=              # IAM user secret key

# App
NEXT_PUBLIC_APP_URL=                # e.g., https://matchup.vercel.app
NEXT_PUBLIC_CDN_URL=                # CloudFront or S3 public URL
```

> **NEVER commit `.env.local`** — only `.env.example` is tracked.

---

## Commands

```bash
# Development
pnpm dev                             # Start dev server (http://localhost:3000)
pnpm build                           # Production build
pnpm start                           # Start production server

# Quality
pnpm lint                            # ESLint check
pnpm lint:fix                        # ESLint auto-fix
pnpm typecheck                       # TypeScript strict check (tsc --noEmit)
pnpm format                          # Prettier format
pnpm format:check                    # Prettier check (CI)

# Testing
pnpm test                            # Run Jest unit tests
pnpm test:watch                      # Jest in watch mode
pnpm test:coverage                   # Jest with coverage report
pnpm test:e2e                        # Run Playwright E2E tests
pnpm test:e2e:ui                     # Playwright with UI mode

# Database
pnpm db:generate-types               # Generate Supabase TypeScript types
pnpm db:migrate                      # Run Supabase migrations locally
pnpm db:seed                         # Seed local database
pnpm db:reset                        # Reset local database

# CI validation (run before pushing)
pnpm validate                        # lint + typecheck + test + build
```

---

## CI Pipeline

All checks must pass before a PR can be merged. The pipeline runs on every push and PR to `main` and `develop`:

1. **Lint** — `pnpm lint` (ESLint flat config, zero warnings policy)
2. **Type Check** — `pnpm typecheck` (strict TypeScript, no emit)
3. **File Length** — `scripts/check-file-length.sh` (no file > 500 lines)
4. **Unit Tests** — `pnpm test` (Jest, coverage thresholds)
5. **Build** — `pnpm build` (Next.js production build must succeed)
6. **E2E Tests** — `pnpm test:e2e` (Playwright against preview deploy)

---

## Common TypeScript Interfaces

```typescript
interface Match {
  id: string;
  organizer_id: string;
  title: string;
  sport: string;
  location_name: string;
  latitude: number;
  longitude: number;
  starts_at: string;
  ends_at: string;
  max_players: number;
  status: MatchStatus;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

type MatchStatus = 'draft' | 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';

interface MatchParticipant {
  id: string;
  match_id: string;
  user_id: string;
  status: ParticipantStatus;
  joined_at: string;
}

type ParticipantStatus = 'joined' | 'waitlisted' | 'cancelled';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  created_at: string;
}

interface CreateMatchInput {
  title: string;
  sport: string;
  location_name: string;
  latitude: number;
  longitude: number;
  starts_at: string;
  ends_at: string;
  max_players: number;
  description?: string;
}

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}
```

---

## Common Patterns

### React Hooks — Define `useCallback` BEFORE `useEffect`

```tsx
// ❌ WRONG — ReferenceError: can't access before initialization
useEffect(() => {
  loadData();
}, [loadData]);
const loadData = useCallback(async () => {
  /* ... */
}, []);

// ✅ CORRECT
const loadData = useCallback(async () => {
  /* ... */
}, []);
useEffect(() => {
  loadData();
}, [loadData]);
```

### Avoid Object Dependencies in Hooks

```tsx
// ❌ WRONG — user object reference changes every render → infinite loop
const loadData = useCallback(() => {
  /* ... */
}, [user]);

// ✅ CORRECT — use primitive value
const loadData = useCallback(() => {
  /* ... */
}, [user?.id]);
```

### Server vs Client Component Decision Tree

```
Does this component need:
  ├─ useState / useEffect / useReducer? → 'use client'
  ├─ Browser APIs (window, document)?   → 'use client'
  ├─ Event handlers (onClick, etc.)?    → 'use client'
  ├─ Third-party client-only library?   → 'use client'
  └─ None of the above?                 → Server Component (default)
```

---

## Security Requirements

- **All tables use RLS** — no exceptions.
- **Validate all inputs** server-side using Zod schemas.
- **Sanitize user-generated content** before rendering.
- **Presigned URLs** for S3 — never expose AWS credentials to the client.
- **Rate limiting** on API routes (consider `@upstash/ratelimit`).
- **CSRF protection** handled by Supabase Auth cookies + Next.js middleware.
- **Environment variables** — never prefix server-only secrets with `NEXT_PUBLIC_`.

---

## Deployment (Vercel)

1. Connect GitHub repo to Vercel project.
2. Set environment variables in Vercel dashboard.
3. Build command: `pnpm build`
4. Output directory: `.next` (auto-detected)
5. Framework preset: Next.js
6. Branch deploys:
   - `main` → Production
   - `develop` → Preview
   - Feature branches → Preview

---

## Common Bugs & Fixes

| Issue                                | Cause                                     | Fix                                                           |
| ------------------------------------ | ----------------------------------------- | ------------------------------------------------------------- |
| Infinite re-render                   | Object in useCallback deps                | Use `obj?.id` (primitive) instead                             |
| "can't access lexical declaration"   | useEffect before useCallback              | Move useCallback above useEffect                              |
| Supabase `.single()` throws PGRST116 | No row found                              | Use `.maybeSingle()` instead                                  |
| S3 upload 403                        | Wrong IAM policy or expired presigned URL | Check bucket policy + URL TTL                                 |
| Middleware redirect loop             | Missing matcher config                    | Add `matcher` array to `middleware.ts` config                 |
| Hydration mismatch                   | Server/client render different content    | Ensure consistent rendering or use `suppressHydrationWarning` |
