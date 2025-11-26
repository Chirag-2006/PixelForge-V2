import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

// USERS TABLE
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Clerk userId
  email: varchar("email", { length: 255 }),
  username: varchar("username", { length: 255 }),
  avatar: varchar("avatar", { length: 500 }),
  plan: varchar("plan", { length: 50 }).default("FREE"),
  generationCount: int("generationCount").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// IMAGES TABLE
export const images = mysqlTable("images", {
  id: varchar("id", { length: 255 }).primaryKey(),
  ownerId: varchar("ownerId", { length: 255 }),
  url: varchar("url", { length: 1000 }),
  prompt: varchar("prompt", { length: 1000 }),
  isPublished: boolean("isPublished").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
