# AGENTS.md - Coding Guidelines for gekaixing

This repository is now a hybrid architecture:
- Frontend/BFF: Next.js 16 + TypeScript + Tailwind CSS v4
- Backend services: Go (Gin + Ent + gRPC)
- Database: local PostgreSQL
- Cache: Redis (go-redis)
- Auth: Auth.js (JWT, unique user identifier: user.id)
- Logging: Zap
- Config: Viper
- Infra: Docker + Kubernetes

## Core Principles

- Complete migrations in one pass on this branch; avoid compatibility half-states.
- Do not reintroduce Supabase dependencies (auth, storage, realtime, query APIs).
- Keep `user.id` as the canonical identity across Next.js, Go services, JWT claims, and DB relations.
- Prefer explicit types, predictable errors, and testable boundaries.

## Tech Stack (Current)

### Web / Frontend
- Next.js 16.1.6 (App Router)
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui (new-york)
- Zustand
- React Hook Form + Zod
- next-intl

### Auth
- Auth.js
- JWT session strategy
- HS256 signing/verification for internal JWT helpers

### Data
- PostgreSQL (local)
- Prisma used by Next.js side
- Ent used by Go backend side

### Backend (Go)
- Gin (HTTP)
- gRPC (RPC)
- go-redis (cache)
- Zap (logging)
- Viper (configuration)

### Infra
- Docker images + docker-compose for local orchestration
- Kubernetes manifests for deployment

## Commands

```bash
# Frontend/BFF
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
npm run test

# Prisma (Next.js side)
npx prisma generate
npx prisma migrate dev
npx prisma db push

# Go backend
cd backend-go && go test ./...
cd backend-go && go run ./cmd/api
cd backend-go && go run ./cmd/grpc
```

## Auth and Identity Rules

- Auth must go through Auth.js routes and session APIs.
- JWT payloads must use `user.id` as the stable subject identifier.
- Never use email as primary join key in business logic.
- Any auth/profile update endpoint must validate ownership from session user id.

## Storage Rules

- Use local/object storage API endpoints under `app/api/storage/*`.
- Public URL shape is `/uploads/<bucket>/<path>`.
- Do not use legacy Supabase storage helpers.

## API and Error Handling

- Route handlers must return structured JSON (`success`, `error`, `data` where applicable).
- Use `try/catch` for async boundaries.
- Never swallow errors; log with context.
- Prefer 400/401/403/404/409/500 with clear semantics.

## TypeScript Standards

- Strict mode assumptions always on.
- No `any`, no `@ts-ignore`, no `@ts-expect-error`.
- Explicit parameter and return types for exported functions.
- Keep imports grouped: external, internal aliases, local.

## Go Standards

- Use context-aware APIs (`context.Context`) for IO operations.
- Keep Gin handler layer thin; move business logic to internal services.
- Ent schema is source of truth on Go side.
- Add table-driven tests for service and transport logic.

## Database Conventions

- PostgreSQL naming: snake_case for tables/columns.
- Keep migration files deterministic and idempotent where possible.
- For cross-stack changes (Prisma + Ent), update both schemas in same PR.

## Testing Requirements

- Add or update tests for all behavior changes.
- Minimum checks before finishing work:
  - `npx tsc --noEmit`
  - `npm run test`
  - `cd backend-go && go test ./...`

## File Organization

```text
app/                    # Next.js routes and APIs
components/             # UI components
lib/                    # shared TS libs (auth, prisma, helpers)
utils/                  # compatibility and utility helpers
prisma/                 # Prisma schema and migrations
backend-go/             # Go services (Gin, Ent, gRPC)
deploy/                 # Docker/K8s manifests
```

## Security and Config

- Never commit real secrets.
- Use `.env.local` / environment variables for local runtime.
- Required variables must be documented in `.env.example`.
- If package download is blocked, prefer mainland mirrors (npm/go proxy) as fallback.

## Migration Guardrails

- Remove legacy naming when practical (`supabase`-prefixed helpers, old adapters).
- Keep compatibility shims minimal and clearly temporary.
- Any remaining shim should fail safely and guide callers to the new path.
