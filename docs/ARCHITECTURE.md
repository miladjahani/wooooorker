# Architecture

The platform uses a monorepo setup:
- `apps/worker`: Hono app running on Cloudflare Workers (Backend)
- `apps/dashboard`: Vite + React SPA (Frontend)
- `apps/bot`: Cloudflare worker for Telegram Bot webhooks
- `packages/database`: Drizzle ORM schemas and D1 migrations
- `packages/shared`: Zod schemas and shared Typescript interfaces
