import { apps } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { createShortcut } from "../../actions";
import NewShortcutPage from "./page";

export default async function NewShortcutLayout({
  params,
}: {
  params: { id: string };
}) {
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, parseInt(params.id)),
  });

  if (!app) {
    return notFound();
  }

  async function createShortcutAction(formData: FormData) {
    "use server";
    if (!app) {
      throw new Error("App not found");
    }
    await createShortcut(app.id, formData);
  }

  return <NewShortcutPage app={app} createShortcutAction={createShortcutAction} />;
}
