# Copilot Global Instructions for MatchUp

## Project Overview

MatchUp is a pick-up match organizer app built with Next.js 15 (App Router) + TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + RLS), AWS S3, and deployed on Vercel. Package manager: pnpm.

## Critical Knowledge Base

Always read `AGENTS.md` at the project root before making significant changes. It contains:

- Complete database schema and table relationships
- Critical React patterns (useCallback before useEffect, `user?.id` over `user`)
- Authentication flow with Supabase SSR
- Supabase patterns (`.maybeSingle()` over `.single()`)
- Service layer APIs and their contracts
- AWS S3 integration patterns
- Known bugs and their fixes
- Clean code guidelines (max 500 lines, strict ESLint, no `any`)

## Code Style & Conventions

- TypeScript strict mode — no `any`, explicit return types
- Functional React components with hooks (no class components)
- Server Components by default — only add `'use client'` when needed
- `@/` path alias for all imports — no deep relative imports
- `import type` for type-only imports
- Tailwind CSS for styling (no inline styles)
- English code, English UI
- pnpm as package manager

## Commands

```bash
pnpm dev          # Start dev server
pnpm lint         # ESLint check
pnpm build        # Production build
pnpm typecheck    # TypeScript strict check (tsc --noEmit)
pnpm test         # Jest unit tests
pnpm test:e2e     # Playwright E2E tests
pnpm validate     # All checks (lint + typecheck + test + build)
```

## Collaboration Between Agents

When working on a task that spans multiple domains, recommend which specialized agent mode should handle each part:

- **Frontend Specialist** — React components, routing, state management
- **Backend Specialist** — Supabase queries, API routes, service layer
- **DB Migrations Manager** — Schema changes, RLS policies, migrations
- **UI Design Expert** — Tailwind styling, responsive design, animations
- **Testing Agent** — Unit tests, integration tests, E2E tests
- **PR Review Agent** — Code review, best practices enforcement
- **Security & RLS Agent** — Auth flows, RLS policies, input sanitization
- **Performance Agent** — Re-render prevention, query optimization, bundle size
- **Documentation Agent** — AGENTS.md, READMEs, inline docs
- **Master Orchestrator** — Task decomposition, delegation, coordination
