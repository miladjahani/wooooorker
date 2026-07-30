import { Hono } from 'hono';
type Variables = { user: any; session: any; requestId: string; };
import { getDb } from '../db';
import { tokens } from '@cf-subscription/database';
import { createTokenSchema } from '@cf-subscription/shared';
import { authMiddleware, requirePermission } from '../middleware/rbac';
import { ulid } from 'ulidx';

const tokensRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
tokensRouter.use('*', authMiddleware);

tokensRouter.get('/', requirePermission('tokens.read'), async (c) => {
  const db = getDb(c.env);
  const allTokens = await db.select({
    id: tokens.id,
    name: tokens.name,
    userId: tokens.userId,
    subscriptionId: tokens.subscriptionId,
    expiresAt: tokens.expiresAt,
    revokedAt: tokens.revokedAt,
    lastUsedAt: tokens.lastUsedAt,
    createdAt: tokens.createdAt
  }).from(tokens);
  return c.json({ success: true, data: allTokens });
});

tokensRouter.post('/', requirePermission('tokens.create'), async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parseResult = createTokenSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } }, 400);
  }

  const db = getDb(c.env);
  const rawToken = crypto.randomUUID() + crypto.randomUUID(); // Simplistic API token

  const tokenHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawToken));
  const tokenHash = Array.from(new Uint8Array(tokenHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  const id = ulid();
  const now = Date.now();
  const user = c.get('user'); // Or from body if admin creating for someone else? Let's assume self for now

  await db.insert(tokens).values({
id: ulid(),


    tokenHash,
    userId: user.id, // Simplification: owner is the creator
    subscriptionId: parseResult.data.subscriptionId || null,
    name: parseResult.data.name,
    expiresAt: new Date(parseResult.data.expiresAt),
    createdAt: new Date(now),
  });

  return c.json({ success: true, data: {  token: rawToken } }, 201); // ONLY TIME WE RETURN RAW TOKEN
});

export { tokensRouter };
