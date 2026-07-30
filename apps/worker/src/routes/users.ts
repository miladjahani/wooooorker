import { Hono } from 'hono';
type Variables = { user: any; session: any; requestId: string; };
import { getDb } from '../db';
import { users } from '@cf-subscription/database';
import { createUserSchema, updateUserSchema } from '@cf-subscription/shared';
import { eq, isNull } from 'drizzle-orm';
import { authMiddleware, requirePermission } from '../middleware/rbac';
import { ulid } from 'ulidx';
import { hashPassword } from '../auth/service';

const usersRouter = new Hono<{ Bindings: Env; Variables: Variables }>();
usersRouter.use('*', authMiddleware);

usersRouter.get('/', requirePermission('users.read'), async (c) => {
  const db = getDb(c.env);
  const allUsers = await db.select({
    id: users.id,
    email: users.email,
    fullName: users.fullName,
    roleId: users.roleId,
    isActive: users.isActive,
    createdAt: users.createdAt
  }).from(users).where(isNull(users.deletedAt));

  return c.json({ success: true, data: allUsers });
});

usersRouter.post('/', requirePermission('users.create'), async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parseResult = createUserSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } }, 400);
  }

  const db = getDb(c.env);
  const existingUser = await db.select().from(users).where(eq(users.email, parseResult.data.email)).limit(1);
  if (existingUser.length > 0) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email already in use' } }, 400);
  }

  const hashedPassword = await hashPassword(parseResult.data.password);
  const id = ulid();
  const now = Date.now();

  await db.insert(users).values({
id: ulid(),


    email: parseResult.data.email,
    passwordHash: hashedPassword,
    fullName: parseResult.data.fullName || null,
    roleId: parseResult.data.roleId,
    isActive: true,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  });

  return c.json({ success: true, data: { id } }, 201);
});

usersRouter.patch('/:id', requirePermission('users.update'), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const parseResult = updateUserSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } }, 400);
  }

  const db = getDb(c.env);
  const targetUser = await db.select().from(users).where(eq(users.id, id as string)).limit(1);

  if (targetUser.length === 0 || targetUser[0].deletedAt) {
    return c.json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } }, 404);
  }

  const updateData: any = { updatedAt: new Date(Date.now()) };
  if (parseResult.data.email !== undefined) updateData.email = parseResult.data.email;
  if (parseResult.data.fullName !== undefined) updateData.fullName = parseResult.data.fullName;
  if (parseResult.data.roleId !== undefined) updateData.roleId = parseResult.data.roleId;
  if (parseResult.data.isActive !== undefined) updateData.isActive = parseResult.data.isActive;

  await db.update(users).set(updateData).where(eq(users.id, id as string));

  return c.json({ success: true, data: { id } });
});

usersRouter.delete('/:id', requirePermission('users.delete'), async (c) => {
  const id = c.req.param('id');
  const db = getDb(c.env);

  // Soft delete
  await db.update(users).set({ deletedAt: new Date(Date.now()), isActive: false }).where(eq(users.id, id as string));

  return c.json({ success: true, data: { id } });
});

export { usersRouter };
