import { db } from "@/db";
import { images } from "@/db/schema";
import { nanoid } from "nanoid";

export async function saveImageToDB({ ownerId, prompt, imageUrl }) {
  return db.insert(images).values({
    id: nanoid(),
    ownerId,
    prompt,
    url:imageUrl,
  });
}
