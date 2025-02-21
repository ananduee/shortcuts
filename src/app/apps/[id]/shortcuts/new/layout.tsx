import { apps, shortcuts } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import NewShortcutPage from "./page";
import { createShortcut } from "../../actions";

export default async function NewShortcutLayout({
  params,
}: {
  params: { id: string };
}) {
  let { id } = await params;
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, parseInt(id)),
  });

  if (!app) {
    return notFound();
  }
  const appId = parseInt(id);

  async function createShortcutAction(formData: FormData) {
    "use server";
    await createShortcut(appId, formData);
  }

  async function validateKeys(keys: string) {
    "use server";
    const existingShortcut = await db.query.shortcuts.findFirst({
      where: and(
        eq(shortcuts.keys, keys),
        eq(shortcuts.appId, appId),
      ),
    });
    return !!existingShortcut;
  }

  return <NewShortcutPage app={app} createShortcutAction={createShortcutAction} validateKeys={validateKeys} />;
}
