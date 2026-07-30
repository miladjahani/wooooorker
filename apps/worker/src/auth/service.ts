import { getDb } from '../db';
import { users, sessions } from '@cf-subscription/database';
import { eq, and, gt } from 'drizzle-orm';
import { ulid } from 'ulidx';

// Simple polyfill/mock for argon2id using WebCrypto pbkdf2 since native argon2 is tough on Workers
// In a real prod setup, one might use a WASM argon2 module if possible,
// but PBKDF2 with SHA-256 is native and secure enough for this demonstration
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  const [saltHex, originalHashHex] = hashStr.split(':');
  if (!saltHex || !originalHashHex) return false;

  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  // Timing safe compare could be added here
  return hashHex === originalHashHex;
}

export async function createSession(env: Env, userId: string, userAgent?: string, ipHash?: string) {
  const db = getDb(env);
  const token = crypto.randomUUID() + crypto.randomUUID(); // Simplistic token

  // Hash the session token before storing
  const tokenHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const tokenHash = Array.from(new Uint8Array(tokenHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  const now = Date.now();
  const expiresAt = now + 1000 * 60 * 60 * 24 * 7; // 7 days

  await db.insert(sessions).values({
id: ulid(),

    userId,
    tokenHash,
    userAgent,
    ipHash,
    createdAt: new Date(now),
    lastSeenAt: new Date(now),
    expiresAt: new Date(expiresAt),
  });

  return token; // Return raw token to user
}

export async function validateSession(env: Env, token: string) {
  const db = getDb(env);

  const tokenHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const tokenHash = Array.from(new Uint8Array(tokenHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  const now = Date.now();

  const sessionRecords = await db.select().from(sessions)
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, new Date(now))
      )
    ).limit(1);

  if (sessionRecords.length === 0) {
    return null;
  }

  const session = sessionRecords[0];
  if (session.revokedAt) {
    return null;
  }

  // Update last seen (could debounce this to reduce writes)
  // await db.update(sessions).set({ lastSeenAt: now }).where(eq(sessions.id, session.id));

  const userRecords = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (userRecords.length === 0 || !userRecords[0].isActive || userRecords[0].deletedAt) {
    return null;
  }

  return { session, user: userRecords[0] };
}

export async function revokeSession(env: Env, token: string) {
  const db = getDb(env);
  const tokenHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const tokenHash = Array.from(new Uint8Array(tokenHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  await db.update(sessions).set({ revokedAt: new Date(Date.now()) }).where(eq(sessions.tokenHash, tokenHash));
}
