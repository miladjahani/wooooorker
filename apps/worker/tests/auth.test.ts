import { describe, it, expect, beforeAll } from 'vitest';
import { hashPassword, verifyPassword } from '../src/auth/service';

describe('Auth Service', () => {
  it('should hash and verify password correctly', async () => {
    const password = 'mySecretPassword123';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).toContain(':');

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('wrongpassword', hash);
    expect(isInvalid).toBe(false);
  });
});
