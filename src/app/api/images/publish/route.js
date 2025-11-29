import { publishImage } from "../imageActions";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { imageId } = await req.json();

  await publishImage(imageId);

  return Response.json({ success: true });
}
