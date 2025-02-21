"use server";

import { db } from "@/db";
import { apps } from "@/db/schema";

export async function createApp(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");
  const logo = formData.get("logo");

  if (!name || typeof name !== "string") {
    throw new Error("Application name is required");
  }

  const app = await db
    .insert(apps)
    .values({
      name,
      description: description ? String(description) : null,
      logo: logo ? String(logo) : null,
    })
    .returning();

  return app[0];
}