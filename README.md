# Peluquería Booking Platform

Modern multi-business booking stack tailored to salons/barberías. Public customers get a conversion-focused landing page plus a three-step booking wizard, while admins manage services, pros, availability, and policies from a realtime dashboard backed by Prisma + PostgreSQL.

## Product Highlights
- Multi-salon ready: business slug routing, per-brand themes, independent policies
- Full booking funnel: service cards → calendar/time grid → employee + contact capture
- Deep admin controls: drag-and-drop calendar, employee rosters, configurable booking windows, time-off blocks, analytics-ready summaries
- Automated ops: Supabase Auth sessions, Resend transactional emails, buffer-aware availability engine, MSW-backed contract tests

## Tech Stack
- **UI**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, FullCalendar
- **Server**: Next.js API routes, Prisma ORM, Supabase PostgreSQL, Supabase Auth, date-fns utilities
- **Messaging**: Resend + React Email templates
- **Tooling**: Jest 30, Testing Library, MSW, ESLint 9, Turbopack dev/build

## Key Modules
- **Client Experience**: `src/app/page.tsx` landing, `src/app/book/page.tsx` booking flow, UI atoms in `src/components/booking`
- **Admin Workspace**: `src/app/admin/page.tsx` plus feature modules in `src/components/admin` (services, employees, schedule, settings)
- **Booking Engine**: `src/lib/availability.ts`, Prisma schema in `prisma/schema.prisma`, API contracts under `src/app/api`
- **Data + Scripts**: `prisma/seed.ts` for demo data, helper scripts under `scripts/`

## Project Structure
```
src/
  app/            # App Router routes (marketing, booking, admin, API)
  components/     # Shared UI broken down by surface
  hooks/          # Client data hooks (ex: useAdminData)
  lib/            # Domain utilities (availability, prisma helpers)
  types/          # Shared TypeScript contracts
prisma/           # Schema, migrations, seeding
scripts/          # Operational helpers (db tests, booking updates)
```

## Getting Started
1. Install Node 20+ and pnpm/npm/bun; ensure PostgreSQL (Supabase) + Resend accounts are ready
2. Clone and install dependencies: `npm install`
3. Create `./.env.local` with the values below
4. Bootstrap the database: `npm run db:migrate && npm run db:seed`
5. Start dev mode: `npm run dev` (Turbopack) then hit `http://localhost:3000`

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://...supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
RESEND_API_KEY="re_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG="barberia-elite" # change per brand
```

## NPM Scripts
- `npm run dev` start Next.js with Turbopack
- `npm run build` production build
- `npm run start` serve the build
- `npm run lint` ESLint 9
- `npm run test` Jest + Testing Library + MSW
- `npm run db:migrate` / `npm run db:seed` schema + fixtures
- `npm run db:reset` reset and reseed

## Testing
- Unit/integration tests live under `src/app/api/__tests__`, `src/components/__tests__`, `src/lib/__tests__`
- `npm run test:coverage` for reports, `npm run test:watch` while iterating

## Additional Docs
- `BOOKING_SYSTEM_PLAN.md` roadmap + architecture
- `DATABASE_CONFIGURATION_GUIDE.md` Supabase + Prisma setup
- `TESTING.md` testing approach
- `DEVELOPMENT_GUIDELINES.md` code conventions and review standards

