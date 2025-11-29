// COMMENTS ADDED FOR EVERY IMPROVEMENT

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateImage } from "@/lib/aiImageGenerator";
import { NextResponse } from "next/server";
import { fetchAsBuffer } from "@/lib/utils/fetchAsBuffer";
import { uploadImageToCloudinary } from "@/lib/upload/cloudinary";
import { saveImageToDB } from "../images/imageSaveToDB";

export async function POST(req) {
  try {
    // 1. AUTH CHECK
    const { userId, isAuthenticated } = await auth();

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Not authenticated", redirect: true },
        { status: 401 }
      );
    }

    // 2. SAFELY READ JSON BODY
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { prompt } = body;

    // 3. VALIDATION
    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Prompt must be at least 3 characters" },
        { status: 400 }
      );
    }

    // 4. FETCH USER FROM DB
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 5. FREE PLAN LIMIT PROTECTION
    if (user.plan === "FREE" && user.generationCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Free plan limit reached (5/5). Upgrade to Pro.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    // 6. GENERATE IMAGE
    const result = await generateImage(prompt);

    // If AI service failed
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          fallback: true,
          imageUrl: result.imageUrl,
          error: result.error,
        },
        { status: 502 }
      );
    }

    //7. convert into buffer
    const buffer = await fetchAsBuffer(result.imageUrl);

    // 3) Upload buffer → Cloudinary
    const cloudUpload = await uploadImageToCloudinary(buffer);

    if (!cloudUpload.success)
      return Response.json({ error: "Cloudinary upload failed" });

    const cloudUrl = cloudUpload.url;

    //9. save image to db
    await saveImageToDB({ ownerId: userId, prompt, imageUrl: cloudUrl });

    // 7. UPDATE GENERATION COUNT
    await db
      .update(users)
      .set({ generationCount: user.generationCount + 1 })
      .where(eq(users.id, userId));

    // 8. SEND SUCCESS RESPONSE
    return NextResponse.json(
      {
        success: true,
        imageUrl: cloudUrl,
        message: "Image generated successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    // 9. INTERNAL SERVER ERRORS
    console.error("❌ API ERROR:", err);

    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
