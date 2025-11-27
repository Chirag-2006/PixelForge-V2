"use server";

import { db } from "@/db";
import { users, images } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteUserFromDB(userId) {
  if (!userId) return { success: false, error: "No userId provided" };

  try {
    // 1. Delete all user images
    await db.delete(images).where(eq(images.ownerId, userId));

    // 2. Delete user record
    await db.delete(users).where(eq(users.id, userId));

    console.log("User + images deleted from DB:", userId);

    return { success: true };
  } catch (error) {
    console.error("deleteUserFromDB error:", error);
    return { success: false, error };
  }
}
