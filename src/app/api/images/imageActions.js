"use server";
import { db } from "@/db";
import { images } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
// import { nanoid } from "nanoid";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function saveImageToDB({ ownerId, prompt, imageUrl }) {
  try {
    if (!ownerId || !prompt || !imageUrl) {
      return { error: "Missing required data" };
    }
    return await db
      .insert(images)
      .values({
        ownerId,
        prompt,
        url: imageUrl,
      })
      .returning({ id: images.id });
  } catch (error) {
    console.error("Failed to save image:", error);
    return { error: "Failed to save image" };
  }
}

export async function publishImageById(imageId) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }
    if (!imageId) {
      return { error: "Invalid image ID" };
    }

    const data = await db
      .update(images)
      .set({ isPublished: true, updatedAt: new Date() })
      .where(eq(images.id, imageId), eq(images.ownerId, userId));

    // console.log("data in image action", data);

    return { message: "Image published", success: true };
  } catch (error) {
    console.error("Failed to publish image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to publish image" },
      { status: 500 }
    );
  }
}

export async function getUserImages(userId) {
  try {
    if (!userId) {
      return { error: "User ID is required" };
    }
    return await db
      .select()
      .from(images)
      .where(eq(images.ownerId, userId))
      .orderBy(desc(images.createdAt));
  } catch (error) {
    console.error("Failed to get user images:", error);
    return { error: "Failed to get user images" };
  }
}

export async function getPublicImages() {
  try {
    return await db
      .select()
      .from(images)
      .where(eq(images.isPublished, true))
      .orderBy(desc(images.createdAt));
  } catch (error) {
    console.error("Failed to get public images:", error);
    return { error: "Failed to get public images" };
  }
}

export async function getPrivateImages() {
  try {
    return await db.select().from(images).where(eq(images.isPublished, false));
  } catch (error) {
    console.error("Failed to get private images:", error);
    return { error: "Failed to get private images" };
  }
}

export async function getPublicImagesByUserId(userId) {
  try {
    if (!userId) {
      return { error: "User ID is required" };
    }
    return await db
      .select()
      .from(images)
      .where(eq(images.ownerId, userId), eq(images.isPublished, true));
  } catch (error) {
    console.error("Failed to get public images by user:", error);
    return { error: "Failed to get public images by user" };
  }
}

export async function getImageDatabyId(imageId) {
  // InsertId
  try {
    if (!imageId) {
      return { error: "Image ID is required" };
    }
    return await db.select().from(images).where(eq(images.id, imageId));
  } catch (error) {
    console.error("Failed to get image by ID:", error);
    return { error: "Failed to get image by ID" };
  }
}

export async function deleteImageById(imageId) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "Unauthorized" };
    }
    if (!imageId) {
      return { error: "Invalid image ID" };
    }

    await db
      .delete(images)
      .where(eq(images.id, imageId), eq(images.ownerId, userId));

    return { message: "Image Deleted Successfully", success: true };
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { error: "Failed to delete image", success: false };
  }
}
