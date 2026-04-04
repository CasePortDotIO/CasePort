import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
 * Slots tracking table for real scarcity mechanism.
 * Tracks available slots per metro market and slot allocation history.
 */
export const slotsAvailable = mysqlTable("slotsAvailable", {
  id: int("id").autoincrement().primaryKey(),
  market: varchar("market", { length: 64 }).notNull().unique(),
  availableSlots: int("availableSlots").default(3).notNull(),
  totalSlots: int("totalSlots").default(3).notNull(),
  lastResetAt: timestamp("lastResetAt").defaultNow().notNull(),
  nextResetAt: timestamp("nextResetAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SlotsAvailable = typeof slotsAvailable.$inferSelect;
export type InsertSlotsAvailable = typeof slotsAvailable.$inferInsert;

/**
 * Slot allocation history for audit trail and analytics.
 */
export const slotAllocations = mysqlTable("slotAllocations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  market: varchar("market", { length: 64 }).notNull(),
  firmName: varchar("firmName", { length: 255 }).notNull(),
  practiceArea: varchar("practiceArea", { length: 255 }).notNull(),
  state: varchar("state", { length: 64 }).notNull(),
  budgetRange: varchar("budgetRange", { length: 64 }).notNull(),
  claimedAt: timestamp("claimedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SlotAllocation = typeof slotAllocations.$inferSelect;
export type InsertSlotAllocation = typeof slotAllocations.$inferInsert;

// TODO: Add your tables here