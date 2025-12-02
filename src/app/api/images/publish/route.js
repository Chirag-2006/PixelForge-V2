import { NextResponse } from "next/server";
import { publishImageById } from "@/app/api/images/imageActions";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { imageId } = await req.json();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!imageId) {
    return NextResponse.json(
      { message: "Missing image ID", success: false },
      { status: 400 }
    );
  }
  // Call your server function
  const data = await publishImageById(imageId);

  return NextResponse.json({ data, success: true }, { status: 200 });
}
