import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * CasePort Private Access Applications
 * Stores every qualification flow submission with full answers, lead score, and metadata.
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),

  // Contact info
  firmName: varchar("firmName", { length: 255 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  workEmail: varchar("workEmail", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  website: varchar("website", { length: 512 }).notNull(),
  linkedIn: varchar("linkedIn", { length: 512 }),

  // Lead scoring
  leadScore: int("leadScore").notNull().default(0),
  leadTier: mysqlEnum("leadTier", ["platinum", "gold", "silver", "disqualified"]).notNull().default("silver"),

  // Full answers as JSON
  answers: json("answers").notNull(),

  // Status
  status: mysqlEnum("status", ["pending", "approved", "rejected", "waitlisted"]).notNull().default("pending"),

  // UTM tracking
  utmSource: varchar("utmSource", { length: 255 }),
  utmMedium: varchar("utmMedium", { length: 255 }),
  utmCampaign: varchar("utmCampaign", { length: 255 }),
  utmContent: varchar("utmContent", { length: 255 }),
  utmTerm: varchar("utmTerm", { length: 255 }),
  referrer: varchar("referrer", { length: 1024 }),

  // Metadata
  ipAddress: varchar("ipAddress", { length: 64 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Waitlist — firms that hit hard-stop but want to be notified when eligibility opens
 */
export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  firmName: varchar("firmName", { length: 255 }),
  hardStopReason: varchar("hardStopReason", { length: 512 }),
  referralEmail: varchar("referralEmail", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = typeof waitlist.$inferInsert;