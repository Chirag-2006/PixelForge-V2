import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.id, userId));

  return NextResponse.json({
    plan: user.plan,
    generationCount: user.generationCount,
    userdata: user,
  });
}
