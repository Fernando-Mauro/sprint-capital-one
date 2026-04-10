# MatchUp

Pick-up match organizer app — create, discover, and join casual sports matches in your area.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript (strict mode)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS + Realtime)
- **File Storage**: AWS S3 (profile pictures, match media)
- **Styling**: Tailwind CSS (UI library TBD)
- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase CLI (for local development)
- AWS account (for S3)

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd sprint-capital-one
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your `.env.local` with Supabase and AWS credentials.

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

### Database Setup

```bash
# Start local Supabase
supabase start

# Run migrations
pnpm db:migrate

# Seed development data
pnpm db:seed

# Generate TypeScript types
pnpm db:generate-types
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | TypeScript strict check |
| `pnpm format` | Prettier format |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm validate` | Run all checks (CI locally) |

## Project Structure

See [AGENTS.md](./AGENTS.md) for the full project structure, database schema, coding guidelines, and architecture decisions.

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production (deployed to Vercel) |
| `develop` | Integration branch |
| `feature/<name>` | New features |
| `fix/<name>` | Bug fixes |

All PRs require passing CI and at least 1 review.

## Contributing

1. Read [AGENTS.md](./AGENTS.md) before making changes.
2. Create a feature branch from `develop`.
3. Follow the coding guidelines (strict TypeScript, no `any`, max 500 lines per file).
4. Run `pnpm validate` before pushing.
5. Open a PR to `develop`.

## License

Private — Capital One Sprint Project
