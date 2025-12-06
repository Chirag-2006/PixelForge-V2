"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateUsername } from "./generateUsername";

export async function syncUserToDB(clerkUser) {
  if (!clerkUser) return { success: false, error: "No user data" };

  // console.log("clerkUser Syncing →", clerkUser);

  const email = clerkUser?.email_addresses?.[0]?.email_address ?? "";

  const fullName = `${clerkUser?.first_name || ""} ${
    clerkUser?.last_name || ""
  }`.trim();

  const username =
    clerkUser?.username || generateUsername(clerkUser?.first_name || "user");

  const avatar = clerkUser?.image_url || clerkUser?.avatar_url || "";

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, clerkUser.id));

    if (existing.length === 0) {
      // CREATE
      await db.insert(users).values({
        id: clerkUser.id,
        email,
        username,
        fullName,
        avatar,
        plan: "FREE",
        generationCount: 0,
      });
    } else {
      // UPDATE
      await db
        .update(users)
        .set({
          email,
          fullName,
          avatar,
          updatedAt: new Date(),
        })
        .where(eq(users.id, clerkUser.id));
    }

    return { success: true };
  } catch (error) {
    console.error("syncUserToDB error:", error);
    return { success: false, error };
  }
}
