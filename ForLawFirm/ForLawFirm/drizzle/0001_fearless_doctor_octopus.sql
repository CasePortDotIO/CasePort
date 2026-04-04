CREATE TABLE `slotAllocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`market` varchar(64) NOT NULL,
	`firmName` varchar(255) NOT NULL,
	`practiceArea` varchar(255) NOT NULL,
	`state` varchar(64) NOT NULL,
	`budgetRange` varchar(64) NOT NULL,
	`claimedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slotAllocations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `slotsAvailable` (
	`id` int AUTO_INCREMENT NOT NULL,
	`market` varchar(64) NOT NULL,
	`availableSlots` int NOT NULL DEFAULT 3,
	`totalSlots` int NOT NULL DEFAULT 3,
	`lastResetAt` timestamp NOT NULL DEFAULT (now()),
	`nextResetAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `slotsAvailable_id` PRIMARY KEY(`id`),
	CONSTRAINT `slotsAvailable_market_unique` UNIQUE(`market`)
);
