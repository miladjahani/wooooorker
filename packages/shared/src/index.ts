import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
  roleId: z.string(),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createSubscriptionSchema = z.object({
  userId: z.string(),
  planId: z.string(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'REVOKED', 'SUSPENDED', 'PENDING']),
  expiresAt: z.number(), // timestamp ms
  maxDevices: z.number(),
  maxTokens: z.number(),
  notes: z.string().optional(),
});
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export const createTokenSchema = z.object({
  name: z.string(),
  subscriptionId: z.string().optional(),
  expiresAt: z.number(),
});
export type CreateTokenInput = z.infer<typeof createTokenSchema>;

export const linkTelegramSchema = z.object({
  code: z.string(),
});

export type ApiResponse<T = any> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    code: string;
    message: string;
  };
  requestId?: string;
};
