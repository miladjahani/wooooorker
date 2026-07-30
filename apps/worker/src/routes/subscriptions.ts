import { Hono } from 'hono';
type Variables = { user: any; session: any; requestId: string; };
import { getDb } from '../db';
import { subscriptions } from '@cf-subscription/database';
import { createSubscriptionSchema } from '@cf-subscription/shared';
import { authMiddleware, requirePermission } from '../middleware/rbac';
import { ulid } from 'ulidx';

const subRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
subRouter.use('*', authMiddleware);

subRouter.get('/', requirePermission('subscriptions.read'), async (c) => {
  const db = getDb(c.env);
  const allSubs = await db.select().from(subscriptions);
  return c.json({ success: true, data: allSubs });
});

subRouter.post('/', requirePermission('subscriptions.create'), async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parseResult = createSubscriptionSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } }, 400);
  }

  const db = getDb(c.env);
  const id = ulid();
  const now = Date.now();

  await db.insert(subscriptions).values({
id: ulid(),


    userId: parseResult.data.userId,
    planId: parseResult.data.planId,
    status: parseResult.data.status,
    startedAt: new Date(now),
    expiresAt: new Date(parseResult.data.expiresAt),
    maxDevices: parseResult.data.maxDevices,
    maxTokens: parseResult.data.maxTokens,
    notes: parseResult.data.notes || null,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  });

  return c.json({ success: true, data: { id } }, 201);
});

export { subRouter };
