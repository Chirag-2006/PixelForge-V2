import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// -----------------------
// USERS TABLE
// -----------------------
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk userId

  email: varchar("email", { length: 255 }), // Do NOT make unique
  username: varchar("username", { length: 255 }),
  fullName: varchar("full_name", { length: 255 }),
  avatar: varchar("avatar", { length: 500 }),

  // Best practice: ENUM instead of boolean
  plan: mysqlEnum("plan", ["FREE", "PRO"]).default("FREE"),

  generationCount: int("generation_count").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// -----------------------
// IMAGES TABLE
// -----------------------
export const images = mysqlTable("images", {
  id: int("id", { length: 255 }).primaryKey().autoincrement(),
  ownerId: varchar("owner_id", { length: 255 }).notNull(),
  url: varchar("url", { length: 2000 }).notNull(),
  prompt: varchar("prompt", { length: 2000 }),
  isPublished: boolean("is_published").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
