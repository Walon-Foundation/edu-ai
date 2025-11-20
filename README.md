
# Edu-Ai

Edu-Ai is a Next.js-based web application that ingests PDF files and uses AI backends to generate educational content — specifically summaries, flash-cards, and question-and-answer (Q&A) materials. It includes PDF upload and generation endpoints, user authentication, database wiring with Drizzle ORM, and integrations with Supabase, Clerk (auth), and OpenRouter (or other LLM providers).

This repository contains the full-stack app (Next.js app router), API routes for PDF upload and content generation, a small suite of UI components, and database configuration using Drizzle.
Edu-Ai is a Next.js-based weEdu-Ai is a Next.js-based web application that ingests PDF files and uses AI backends to generate educational content — specifically summaries, flash-cards, and question-and-answer (Q&A) materials.b application that ingests PDF files and uses AI backends to generate educational content — specifically summaries, flash-cards, and question-and-answer (Q&A) materials.
## Highlights

- Next.js (App Router) front-end with React 19
- PDF ingestion and processing (upload PDFs → extract content → generate summaries / Q&A / flash-cards)
- Authentication via Clerk
- Database access with Drizzle ORM and migration tooling (drizzle-kit)
- File upload and AI generation endpoints (OpenRouter / OpenAI compatible)
- Supabase client utilities for storage or realtime features
- Tailwind + UI primitives for fast styling

## Repo structure (key folders)

- `app/` — Next.js app router pages, API routes and server/actions
	- `app/api/` — serverless API routes (file upload, generation, summaries, Q&A, flashcards)
	- `app/dashboard`, `app/generate`, `app/upload` — example pages and flows
- `components/` — shared React components (navbar, footer, UI primitives)
- `db/` — Drizzle ORM schema and database helpers
- `lib/` — helper utilities (env loading, http helpers, supabase, router helpers)
- `drizzle.config.ts` — drizzle-kit configuration and migrations

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Drizzle ORM + drizzle-kit (migrations)
- Supabase (client integrations)
- Clerk (authentication)
- OpenRouter SDK (AI / LLM provider)
- Tailwind CSS
- Biome (lint/format)

## Prerequisites

- Node.js (v18+ recommended)
- pnpm (recommended, repository includes `pnpm-lock.yaml`) — npm or yarn will also work
- A Postgres-compatible database (for production) or a development DB pointed by `DATABASE_URL`
- Accounts/keys for the third-party services you plan to use (Clerk, Supabase, OpenRouter)

## Environment variables

Copy the example env file and update values:

```bash
cp .env.example .env.local
# then edit .env.local and fill values
```

`.env.example` includes the following variables (fill them):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ROLE_KEY` — Supabase service/role key
- `NODE_ENV` — environment (development/production)
- `DATABASE_URL` — database connection string (Postgres)
- `OPENROUTER_API_KEY` — API key for OpenRouter or other LLM provider

Adjust or add any other env variables required by your deployment.

## Install and run (local)

Recommended (pnpm):

```bash
# install
pnpm install

# run dev server
pnpm dev
```

You can also use npm or yarn if you prefer:

```bash
npm install
npm run dev
```

The Next.js dev server runs on http://localhost:3000 by default.

## Useful npm scripts

- `pnpm dev` — run Next.js in development mode (alias for `next dev`)
- `pnpm build` — build for production (`next build`)
- `pnpm start` — run production server (`next start`)
- `pnpm db:migrate` — run Drizzle migrations (uses `drizzle-kit`)
- `pnpm db:push` — push schema (drizzle-kit)
- `pnpm db:generate` — generate migration files (drizzle-kit)
- `pnpm db:studio` — open drizzle studio
- `pnpm lint` — run Biome lint checks
- `pnpm format` — format code with Biome

Run migrations before starting if you connect to an empty DB:

```bash
pnpm db:generate # (optional) scaffold migration
pnpm db:migrate
```

## API & Endpoints

This project includes API routes under `app/api/` such as:

- `/api/files/[fileId]` — file storage handlers
- `/api/generate/...` — generation endpoints for flash-cards, summaries, question-and-answer flows
- `/api/upload/` — file upload route

Check the route files for implementation details and expected payload shapes.

## Development tips

- Use Clerk dev keys or local test accounts when developing auth flows.
- If using Supabase storage or realtime features, ensure `SUPABASE_URL` and `SUPABASE_ROLE_KEY` are correctly set.
- For fast iteration on AI provider keys, set `OPENROUTER_API_KEY` and verify requests in server logs.

## Tests

This repo currently does not include automated tests. Adding a small test suite (Jest/Playwright/Vitest) is a recommended next step.

## Contributing

Contributions are welcome. Recommended workflow:

1. Fork the repo
2. Create a feature branch
3. Run lint/format and tests (if added)
4. Open a PR with a clear description

## License

This project includes a `LICENSE` file in the repository root. Review it for licensing details.

---