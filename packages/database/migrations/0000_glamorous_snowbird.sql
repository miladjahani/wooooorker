CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`target_type` text,
	`target_id` text,
	`timestamp` integer NOT NULL,
	`request_id` text,
	`metadata` text,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`duration_days` integer NOT NULL,
	`max_devices` integer NOT NULL,
	`max_tokens` integer NOT NULL,
	`features_json` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`user_agent` text,
	`ip_hash` text,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	`last_seen_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan_id` text NOT NULL,
	`status` text NOT NULL,
	`started_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`max_devices` integer NOT NULL,
	`max_tokens` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `system_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value_json` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `telegram_accounts` (
	`telegram_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`username` text,
	`first_name` text,
	`last_name` text,
	`linked_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`user_id` text NOT NULL,
	`subscription_id` text,
	`name` text NOT NULL,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	`last_used_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`full_name` text,
	`role_id` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`deleted_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `worker_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`worker_id` text NOT NULL,
	`config_json` text NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`worker_id`) REFERENCES `workers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`environment` text NOT NULL,
	`status` text NOT NULL,
	`version` text NOT NULL,
	`health_check_url` text,
	`last_health_check` integer,
	`last_deployment` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permissions_name_unique` ON `permissions` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `plans_slug_unique` ON `plans` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `telegram_accounts_user_id_unique` ON `telegram_accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tokens_token_hash_unique` ON `tokens` (`token_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `worker_configs_worker_id_unique` ON `worker_configs` (`worker_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `workers_slug_unique` ON `workers` (`slug`);