# SCAVA — Brew & Play

A full-stack web app for SCAVA, a premium specialty café and pickleball court in Nellore, India. Acts as both a visual brand statement and an operational tool for court bookings, menu browsing, and community engagement.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/scava run dev` — run the SCAVA frontend (port 18705)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + framer-motion + wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- DB schema: `lib/db/src/schema/` — menu.ts, bookings.ts, contact.ts
- API spec: `lib/api-spec/openapi.yaml`
- Generated hooks: `lib/api-client-react/src/generated/api.ts`
- Generated Zod schemas: `lib/api-zod/src/generated/api.ts`
- API routes: `artifacts/api-server/src/routes/` — menu.ts, bookings.ts, contact.ts
- Frontend pages: `artifacts/scava/src/pages/`
- Brand assets: `attached_assets/` (aliased as `@assets` in Vite)

## Architecture decisions

- Contract-first OpenAPI: spec gates codegen which gates frontend — all types flow from `openapi.yaml`
- Court booking uses slot-based system: 15 time slots per day (07:00–22:00), one booking per slot
- Menu items are seeded at DB level (not hardcoded in frontend) so they can be managed later
- Brand images served via `@assets` Vite alias pointing to `attached_assets/` folder

## Product

- **Home** (`/`) — cinematic hero, about, dual entry (Court + Brew), community image grid
- **The Court** (`/court`) — pickleball info + 4-step booking flow (date → slot → players → confirm)
- **Brew & Bite** (`/menu`) — filterable menu grid (Coffee Rituals / Bites tabs)
- **Contact** (`/contact`) — inquiry form for private/corporate/tournament bookings
- **Admin** (`/admin`) — booking management dashboard (stats, list, cancel)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After changing `lib/db/src/schema/`, run `pnpm run typecheck:libs` before API server typecheck or you'll see stale export errors
- `@assets` alias maps to `attached_assets/` at repo root — use `import img from "@assets/filename.webp"` in frontend
- Google Fonts `@import url(...)` must be the very first line in `index.css`
- API base path is `/api` — all routes are mounted there

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
