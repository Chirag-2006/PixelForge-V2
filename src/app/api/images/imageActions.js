"use server";
import { db } from "@/db";
import { images } from "@/db/schema";
import { eq } from "drizzle-orm";
// import { nanoid } from "nanoid";

export async function saveImageToDB({ ownerId, prompt, imageUrl }) {
  return db.insert(images).values({
    ownerId,
    prompt,
    url: imageUrl,
  });
}

export async function publishImage(imageId) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  return await db
    .update(images)
    .set({ published: true })
    .where(eq(images.id, imageId), eq(images.ownerId, userId));
}

export async function getUserImages(userId) {
  return await db.select().from(images).where(eq(images.ownerId, userId));
}

export async function getPublicImages() {
  return await db.select().from(images).where(eq(images.isPublished, true));
}
export async function getPrivateImages() {
  return await db.select().from(images).where(eq(images.isPublished, false));
}

export async function getPublicImagesByUserId(userId) {
  return await db
    .select()
    .from(images)
    .where(eq(images.ownerId, userId), eq(images.isPublished, true));
}
