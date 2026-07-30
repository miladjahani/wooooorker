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

## Deployment (GitHub to Cloudflare)

### Backend (Worker & Bot)
Deploy using GitHub Actions or manually via:
\`\`\`bash
pnpm --filter @cf-subscription/worker run deploy
pnpm --filter @cf-subscription/bot run deploy
\`\`\`

### Frontend Dashboard (Cloudflare Pages)
The frontend is optimized for direct GitHub to Cloudflare Pages deployment.

1. Go to **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Select this repository.
3. **Build settings**:
   - **Framework preset**: `None` *(Do not select Vite, as it may populate incorrect deploy commands for this monorepo)*
   - **Build command**: \`pnpm --filter dashboard run build\`
   - **Deploy command**: *(Leave blank)*
   - **Version command**: *(Leave blank)*
   - **Build output directory**: \`apps/dashboard/dist\`
   - **Root directory**: \`/\` (Leave as root to allow pnpm workspace to install shared packages)
4. Add Environment Variable: `NODE_VERSION` = `20` (or rely on `.node-version` provided in repo).
5. Click **Save and Deploy**.
