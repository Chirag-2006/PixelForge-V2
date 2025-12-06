import { 
  pgTable, 
  varchar, 
  integer, 
  boolean, 
  timestamp, 
  pgEnum 
} from "drizzle-orm/pg-core";

// -----------------------
// ENUM: plan (FREE / PRO)
// -----------------------
export const planEnum = pgEnum("plan", ["FREE", "PRO"]);

// -----------------------
// USERS TABLE
// -----------------------
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),            // Clerk userId

  email: varchar("email"),                   // keep simple
  username: varchar("username"),
  fullName: varchar("full_name"),
  avatar: varchar("avatar"),

  plan: planEnum("plan").default("FREE"),

  generationCount: integer("generation_count").default(0),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// -----------------------
// IMAGES TABLE
// -----------------------
export const images = pgTable("images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  ownerId: varchar("owner_id").notNull(),
  url: varchar("url").notNull(),
  prompt: varchar("prompt"),

  isPublished: boolean("is_published").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
