"use server";

import { db } from "@/db";
import { shortcuts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createShortcut(appId: number, formData: FormData) {
  const keys = formData.get("keys");
  const description = formData.get("description");

  if (!keys || typeof keys !== "string") {
    throw new Error("Keys are required");
  }

  if (!description || typeof description !== "string") {
    throw new Error("Description is required");
  }

  const now = new Date();

  await db.insert(shortcuts).values({
    appId,
    keys,
    description,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath(`/apps/${appId}`);
  redirect(`/apps/${appId}`);
}

export async function updateShortcut(
  appId: number,
  shortcutId: number,
  formData: FormData
) {
  const keys = formData.get("keys");
  const description = formData.get("description");

  if (!keys || typeof keys !== "string") {
    throw new Error("Keys are required");
  }

  if (!description || typeof description !== "string") {
    throw new Error("Description is required");
  }

  await db
    .update(shortcuts)
    .set({
      keys,
      description,
      updatedAt: new Date(),
    })
    .where(eq(shortcuts.id, shortcutId));

  revalidatePath(`/apps/${appId}`);
  redirect(`/apps/${appId}`);
}

export async function deleteShortcut(appId: number, shortcutId: number) {
  await db.delete(shortcuts).where(eq(shortcuts.id, shortcutId));

  revalidatePath(`/apps/${appId}`);
  redirect(`/apps/${appId}`);
}