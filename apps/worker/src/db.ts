import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@cf-subscription/database';

export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}
