CREATE TABLE `Bookji_stores` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`logo` varchar(200),
	`thumbnail` varchar(200),
	`stripeAccountId` varchar(191),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Bookji_stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Bookji_payments` DROP COLUMN `userId`;