import { describe, it, expect } from 'vitest';
import app from '../src/index';

// Simple check for health route
describe('API Routes', () => {
  it('GET /api/health should return healthy structure (mock env)', async () => {
    // We would mock env.DB in a real test, but we can just check if it handles it gracefully
    const req = new Request('http://localhost/api/health');
    const res = await app.fetch(req, { DB: {} as any });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('healthy');
  });
});
