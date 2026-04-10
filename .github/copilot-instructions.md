# Copilot Global Instructions for Altheia

## Project Overview

Altheia is an educational platform for students and teachers built with React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui, Supabase (PostgreSQL + Auth + RLS), and React Router with HashRouter.

## Critical Knowledge Base

Always read `AGENTS.md` at the project root before making significant changes. It contains:
- Complete database schema and table relationships
- Critical React patterns (useCallback before useEffect, `user?.id` over `user`)
- Authentication multi-layer defense (GlobalAuthBlocker → ProtectedRoute → force reload)
- Supabase patterns (`.maybeSingle()` over `.single()`)
- Service layer APIs and their contracts
- Known bugs and their fixes
- LaTeX rendering patterns with KaTeX
- Content migration workflows (DEV → PROD)

## Environments

- **DEV Supabase**: `jkbuowdbmvhrqmynturh.supabase.co`
- **PROD Supabase**: `htikohojkylebqwtvxhx.supabase.co`
- Environment controlled via `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Code Style & Conventions

- TypeScript strict mode
- Functional React components with hooks (no class components)
- shadcn/ui components from `src/components/ui/`
- CSS custom properties for theming (defined in `index.css`)
- Dark/light mode via ThemeProvider
- Spanish-language UI (content in Spanish, code in English)
- HashRouter for static hosting compatibility
- All Supabase tables use Row-Level Security (RLS)

## Commands

```bash
npm run dev          # Start dev server
npm run lint         # ESLint check
npm run build        # Production build
npx tsc --noEmit --project tsconfig.app.json  # Type check
```

## Collaboration Between Agents

When working on a task that spans multiple domains, recommend which specialized agent mode should handle each part. Reference agent modes by name:
- **Frontend Specialist** — React components, routing, state management
- **Backend Specialist** — Supabase queries, Edge Functions, API services
- **DB Migrations Manager** — Schema changes, RLS policies, migrations
- **UI Design Expert** — Tailwind styling, shadcn/ui, responsive design, animations
- **Testing Agent** — Unit tests, integration tests, test utilities
- **PR Review Agent** — Code review, best practices enforcement
- **Security & RLS Agent** — Auth flows, RLS policies, input sanitization
- **Performance Agent** — Re-render prevention, query optimization, bundle size
- **Documentation Agent** — AGENTS.md, READMEs, inline docs, migration guides
- **Master Orchestrator** — Task decomposition, delegation, coordination
