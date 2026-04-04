import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, slotsAvailable, slotAllocations, InsertSlotAllocation } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAvailableSlots(market: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get slots: database not available");
    return 3;
  }

  try {
    const result = await db
      .select()
      .from(slotsAvailable)
      .where(eq(slotsAvailable.market, market))
      .limit(1);

    if (result.length === 0) {
      const nextReset = new Date();
      nextReset.setDate(nextReset.getDate() + 7);
      await db.insert(slotsAvailable).values({
        market,
        availableSlots: 3,
        totalSlots: 3,
        nextResetAt: nextReset,
      });
      return 3;
    }

    return result[0].availableSlots;
  } catch (error) {
    console.error("[Database] Failed to get available slots:", error);
    return 3;
  }
}

export async function claimSlot(
  market: string,
  allocation: Omit<InsertSlotAllocation, "market">
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot claim slot: database not available");
    return false;
  }

  try {
    const result = await db
      .select()
      .from(slotsAvailable)
      .where(eq(slotsAvailable.market, market))
      .limit(1);

    if (result.length === 0 || result[0].availableSlots <= 0) {
      return false;
    }

    await db
      .update(slotsAvailable)
      .set({ availableSlots: result[0].availableSlots - 1 })
      .where(eq(slotsAvailable.market, market));

    await db.insert(slotAllocations).values({
      ...allocation,
      market,
    });

    return true;
  } catch (error) {
    console.error("[Database] Failed to claim slot:", error);
    return false;
  }
}

export async function resetMarketSlots(market: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot reset slots: database not available");
    return false;
  }

  try {
    const nextReset = new Date();
    nextReset.setDate(nextReset.getDate() + 7);

    await db
      .update(slotsAvailable)
      .set({
        availableSlots: 3,
        lastResetAt: new Date(),
        nextResetAt: nextReset,
      })
      .where(eq(slotsAvailable.market, market));

    return true;
  } catch (error) {
    console.error("[Database] Failed to reset slots:", error);
    return false;
  }
}

// TODO: add feature queries here as your schema grows.
