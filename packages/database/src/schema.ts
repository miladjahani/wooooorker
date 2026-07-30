import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // ULID or UUID
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
  roleId: text('role_id').notNull().references(() => roles.id),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(), // e.g. ADMIN, OPERATOR, USER
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const permissions = sqliteTable('permissions', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g. users.create
  description: text('description'),
});

export const rolePermissions = sqliteTable('role_permissions', {
  roleId: text('role_id').notNull().references(() => roles.id),
  permissionId: text('permission_id').notNull().references(() => permissions.id),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  tokenHash: text('token_hash').notNull().unique(),
  userAgent: text('user_agent'),
  ipHash: text('ip_hash'),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  revokedAt: integer('revoked_at', { mode: 'timestamp_ms' }),
  lastSeenAt: integer('last_seen_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  durationDays: integer('duration_days').notNull(),
  maxDevices: integer('max_devices').notNull(),
  maxTokens: integer('max_tokens').notNull(),
  featuresJson: text('features_json'), // JSON string
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  planId: text('plan_id').notNull().references(() => plans.id),
  status: text('status').notNull(), // ACTIVE, EXPIRED, REVOKED, SUSPENDED, PENDING
  startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  maxDevices: integer('max_devices').notNull(),
  maxTokens: integer('max_tokens').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const tokens = sqliteTable('tokens', {
  id: text('id').primaryKey(),
  tokenHash: text('token_hash').notNull().unique(),
  userId: text('user_id').notNull().references(() => users.id),
  subscriptionId: text('subscription_id').references(() => subscriptions.id),
  name: text('name').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  revokedAt: integer('revoked_at', { mode: 'timestamp_ms' }),
  lastUsedAt: integer('last_used_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const workers = sqliteTable('workers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  environment: text('environment').notNull(), // e.g. dev, prod
  status: text('status').notNull(), // ONLINE, OFFLINE, DEGRADED, UNKNOWN
  version: text('version').notNull(),
  healthCheckUrl: text('health_check_url'),
  lastHealthCheck: integer('last_health_check', { mode: 'timestamp_ms' }),
  lastDeployment: integer('last_deployment', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const workerConfigs = sqliteTable('worker_configs', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull().references(() => workers.id).unique(),
  configJson: text('config_json').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id').references(() => users.id),
  action: text('action').notNull(), // USER_CREATED, LOGIN_SUCCESS, etc.
  targetType: text('target_type'),
  targetId: text('target_id'),
  timestamp: integer('timestamp', { mode: 'timestamp_ms' }).notNull(),
  requestId: text('request_id'),
  metadata: text('metadata'), // JSON string, NO SECRETS
});

export const telegramAccounts = sqliteTable('telegram_accounts', {
  telegramId: text('telegram_id').primaryKey(), // Intentionally string to avoid js big int issues
  userId: text('user_id').notNull().references(() => users.id).unique(),
  username: text('username'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  linkedAt: integer('linked_at', { mode: 'timestamp_ms' }).notNull(),
});

export const systemSettings = sqliteTable('system_settings', {
  key: text('key').primaryKey(),
  valueJson: text('value_json').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
