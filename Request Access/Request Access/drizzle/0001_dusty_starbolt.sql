CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firmName` varchar(255) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`workEmail` varchar(320) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`website` varchar(512) NOT NULL,
	`linkedIn` varchar(512),
	`leadScore` int NOT NULL DEFAULT 0,
	`leadTier` enum('platinum','gold','silver','disqualified') NOT NULL DEFAULT 'silver',
	`answers` json NOT NULL,
	`status` enum('pending','approved','rejected','waitlisted') NOT NULL DEFAULT 'pending',
	`utmSource` varchar(255),
	`utmMedium` varchar(255),
	`utmCampaign` varchar(255),
	`utmContent` varchar(255),
	`utmTerm` varchar(255),
	`referrer` varchar(1024),
	`ipAddress` varchar(64),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firmName` varchar(255),
	`hardStopReason` varchar(512),
	`referralEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `waitlist_id` PRIMARY KEY(`id`)
);
