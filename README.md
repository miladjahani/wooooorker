# CF Subscription Platform

A production-ready Cloudflare-based Subscription & Worker Management Platform.

## Features
- **Cloudflare Workers** backend
- **D1 Database** for persistence
- **Session-Based Authentication** with Argon2id-compatible WebCrypto PBKDF2 hashing
- **RBAC** (Role-Based Access Control)
- **Telegram Bot** integration for notifications and linking
- **Modern Dashboard** (React, Tailwind CSS, RTL)
- **Monorepo** architecture (pnpm workspaces)

## Getting Started

1. \`pnpm install\`
2. \`pnpm run dev\`

## Deployment
\`\`\`bash
pnpm --filter @cf-subscription/worker deploy
\`\`\`
