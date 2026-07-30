import { Hono } from 'hono';
type Variables = { user: any; session: any; requestId: string; };
import { getDb } from '../db';
import { users } from '@cf-subscription/database';
import { loginSchema } from '@cf-subscription/shared';
import { verifyPassword, createSession, revokeSession } from '../auth/service';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/rbac';
import { setCookie } from 'hono/cookie';

const authRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

authRouter.post('/login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parseResult = loginSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } }, 400);
  }

  const { email, password } = parseResult.data;
  const db = getDb(c.env);

  const userRecords = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (userRecords.length === 0) {
    // Don't leak user existence
    return c.json({ success: false, error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid credentials' } }, 401);
  }

  const user = userRecords[0];
  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return c.json({ success: false, error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid credentials' } }, 401);
  }

  if (!user.isActive || user.deletedAt) {
    return c.json({ success: false, error: { code: 'AUTH_FORBIDDEN', message: 'Account disabled' } }, 403);
  }

  const userAgent = c.req.header('User-Agent');
  // simplistic IP hash
  const ip = c.req.header('CF-Connecting-IP') || 'unknown';
  const ipHashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
  const ipHash = Array.from(new Uint8Array(ipHashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

  const token = await createSession(c.env, user.id, userAgent, ipHash);

  setCookie(c, 'session', token, {
    httpOnly: true,
    secure: true, // Should ideally check if env is prod, but enforcing here
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return c.json({ success: true, data: { token } });
});

authRouter.post('/logout', authMiddleware, async (c) => {
  const session = c.get('session');
  // Actually we need the raw token to revoke, but the middleware gives us the hashed one usually.
  // Wait, let's fix middleware to pass raw token or let revokeSession handle raw token.
  // We can just extract it again:
  let token = '';
  const authHeader = c.req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    const cookieHeader = c.req.header('Cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/session=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (token) {
    await revokeSession(c.env, token);
  }

  setCookie(c, 'session', '', { maxAge: 0, path: '/' });
  return c.json({ success: true, data: {} });
});

authRouter.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  return c.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId
    }
  });
});

export { authRouter };
