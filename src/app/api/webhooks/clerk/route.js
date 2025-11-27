import { Webhook } from "svix";
import { syncUserToDB } from "@/lib/syncUser";
import { deleteUserFromDB } from "@/lib/deleteUser";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing Clerk webhook secret", { status: 500 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  const wh = new Webhook(WEBHOOK_SECRET);

  let event;
  try {
    event = wh.verify(payload, headers);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Unauthorized", { status: 401 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    try {
      await syncUserToDB(event.data);
      return new Response("User synced successfully", { status: 200 });
    } catch (error) {
      console.error("Failed to sync user:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

   // USER DELETED
  if (event.type === "user.deleted") {
    const userId = event.data.id;

    const result = await deleteUserFromDB(userId);

    if (result.success) {
      return new Response("User deleted", { status: 200 });
    } else {
      return new Response("Failed to delete user", { status: 500 });
    }
  }


  // For unsupported events, reply OK for webhook stability
  return new Response("Event ignored", { status: 200 });
}
