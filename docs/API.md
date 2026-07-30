# API Documentation

## Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Users
- `GET /api/users` (Permission: `users.read`)
- `POST /api/users` (Permission: `users.create`)
- `PATCH /api/users/:id` (Permission: `users.update`)
- `DELETE /api/users/:id` (Permission: `users.delete`)

## Subscriptions
- `GET /api/subscriptions` (Permission: `subscriptions.read`)
- `POST /api/subscriptions` (Permission: `subscriptions.create`)

## Tokens
- `GET /api/tokens` (Permission: `tokens.read`)
- `POST /api/tokens` (Permission: `tokens.create`)
