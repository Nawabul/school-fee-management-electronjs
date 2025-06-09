CREATE TABLE `classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `classes_name_unique` ON `classes` (`name`);--> statement-breakpoint
CREATE TABLE `mis_charges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_id` integer NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`date` text NOT NULL,
	`item_id` integer NOT NULL,
	`remark` text,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`item_id`) REFERENCES `mis_items`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `mis_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mis_items_name_unique` ON `mis_items` (`name`);--> statement-breakpoint
CREATE TABLE `monthly_fee` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`student_id` integer NOT NULL,
	`class_id` integer NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`student_id` integer NOT NULL,
	`remark` text,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reg_number` text NOT NULL,
	`student_name` text NOT NULL,
	`father_name` text NOT NULL,
	`mobile` text NOT NULL,
	`is_whatsapp` integer DEFAULT 0 NOT NULL,
	`admission_date` text NOT NULL,
	`transfer_date` text,
	`address` text NOT NULL,
	`initial_balance` integer DEFAULT 0 NOT NULL,
	`current_balance` integer DEFAULT 0 NOT NULL,
	`class_id` integer NOT NULL,
	`last_fee_date` text NOT NULL,
	`last_notification_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_reg_number_unique` ON `students` (`reg_number`);--> statement-breakpoint
CREATE TABLE `versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `versions_name_unique` ON `versions` (`name`);