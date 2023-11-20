CREATE TABLE `Bookji_addresses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`line1` varchar(191),
	`line2` varchar(191),
	`city` varchar(191),
	`state` varchar(191),
	`postalCode` varchar(191),
	`country` varchar(191),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `Bookji_addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Bookji_books` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191) NOT NULL,
	`title` varchar(191) NOT NULL,
	`description` text,
	`cover` varchar(200),
	`price` decimal(10,2) NOT NULL DEFAULT '0',
	`tags` json DEFAULT ('null'),
	`inventory` int NOT NULL DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Bookji_books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Bookji_carts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191),
	`paymentIntentId` varchar(191),
	`clientSecret` varchar(191),
	`items` json DEFAULT ('null'),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `Bookji_carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Bookji_email_preferences` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191),
	`email` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`newsletter` boolean NOT NULL DEFAULT false,
	`marketing` boolean NOT NULL DEFAULT false,
	`transactional` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `Bookji_email_preferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Bookji_orders` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191),
	`items` json DEFAULT ('null'),
	`total` decimal(10,2) NOT NULL DEFAULT '0',
	`stripePaymentIntentId` varchar(191) NOT NULL,
	`${APP_NAME}_stripePaymentIntentStatus` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`addressId` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `Bookji_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Bookji_payments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191),
	`stripeAccountId` varchar(191) NOT NULL,
	`stripeAccountCreatedAt` int NOT NULL,
	`stripeAccountExpiresAt` int NOT NULL,
	`detailsSubmitted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `Bookji_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Bookji_ratings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(191) NOT NULL,
	`bookId` varchar(191) NOT NULL,
	`rating` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `Bookji_ratings_id` PRIMARY KEY(`id`)
);
