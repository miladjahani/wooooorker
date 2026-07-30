import { Context, Next } from 'hono';
import { validateSession } from '../auth/service';
import { getDb } from '../db';
import { roles, rolePermissions, permissions as permissionsTable } from '@cf-subscription/database';
import { eq } from 'drizzle-orm';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Check cookies
    const cookieHeader = c.req.header('Cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/session=([^;]+)/);
      if (match) token = match[1];
    }
  }

  if (!token) {
    return c.json({ success: false, error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Unauthorized' } }, 401);
  }

  const result = await validateSession(c.env, token);
  if (!result) {
    return c.json({ success: false, error: { code: 'AUTH_SESSION_EXPIRED', message: 'Session expired or invalid' } }, 401);
  }

  c.set('user', result.user);
  c.set('session', result.session);
  await next();
}

export function requirePermission(requiredPermission: string) {
  return async (c: Context, next: Next) => {
    const user = c.get<any>('user');
    if (!user) {
      return c.json({ success: false, error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Unauthorized' } }, 401);
    }

    const db = getDb(c.env);

    // Fetch role permissions
    // In a real app, this should be cached heavily
    const userRole = await db.select().from(roles).where(eq(roles.id, user.roleId)).limit(1);
    if (userRole.length === 0) {
       return c.json({ success: false, error: { code: 'AUTH_FORBIDDEN', message: 'Forbidden' } }, 403);
    }

    // Check if admin
    if (userRole[0].name === 'ADMIN') {
      await next();
      return;
    }

    // Load permissions for role
    const perms = await db.select({ name: permissionsTable.name })
      .from(rolePermissions)
      .innerJoin(permissionsTable, eq(rolePermissions.permissionId, permissionsTable.id))
      .where(eq(rolePermissions.roleId, user.roleId));

    const hasPerm = perms.some(p => p.name === requiredPermission);

    if (!hasPerm) {
      return c.json({ success: false, error: { code: 'AUTH_FORBIDDEN', message: 'Forbidden' } }, 403);
    }

    await next();
  };
}
