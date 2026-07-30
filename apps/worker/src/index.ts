import { Hono } from 'hono';
type Variables = { user: any; session: any; requestId: string; };
import { cors } from 'hono/cors';
import { getDb } from './db';
import * as schema from '@cf-subscription/database';

import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { subRouter } from './routes/subscriptions';
import { tokensRouter } from './routes/tokens';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use('*', cors());

app.use('*', async (c, next) => {
  const requestId = crypto.randomUUID();
  c.set('requestId', requestId);
  await next();
  c.res.headers.set('X-Request-ID', requestId);
});

app.get('/api/health', async (c) => {
  const db = getDb(c.env);
  let dbStatus = 'healthy';
  try {
    await db.select().from(schema.users).limit(1).execute();
  } catch (e) {
    dbStatus = 'unhealthy';
  }

  return c.json({
    success: true,
    data: {
      status: 'healthy',
      database: dbStatus,
    }
  });
});

app.route('/api/auth', authRouter);
app.route('/api/users', usersRouter);
app.route('/api/subscriptions', subRouter);
app.route('/api/tokens', tokensRouter);

app.onError((err, c) => {
  console.error(err);
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred',
    },
    requestId: c.get('requestId'),
  }, 500);
});

export default app;
