"use server";

import { db } from "@/db/index";
import { images, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// Get public user profile with only published images
// export async function getPublicUserProfile(username) {
//   try {
//     const [user] = await db
//       .select()
//       .from(users)
//       .where(eq(users.username, username));

//     if (!user) {
//       return { error: "User not found" };
//     }

//     // Only get published images
//     const publishedImages = await db
//       .select()
//       .from(images)
//       .where(and(eq(images.ownerId, user.id), eq(images.isPublished, true)))
//       .orderBy(desc(images.updatedAt));

//     return {
//       user: {
//         username: user.username,
//         imageUrl: user.avatar,
//         createdAt: user.createdAt,
//       },
//       images: publishedImages,
//     };
//   } catch (error) {
//     return { error: "Failed to fetch user profile" };
//   }
// }

export async function getPublicUserProfile(userId) { // ✅ userId instead of username
  try {
    // Find user first
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return { error: "User not found" };
    }

    // Get only published images for this user
    const userImages = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.ownerId, userId),
          eq(images.isPublished, true)
        )
      )
      .orderBy(images.createdAt);

    return {
      user: {
        username: user.username || userId.slice(-8), // Fallback to truncated ID
        imageUrl: user.avatar,
      },
      images: userImages,
    };
  } catch (error) {
    console.error("Profile query error:", error);
    return { error: "Failed to fetch profile" };
  }
}