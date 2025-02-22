import { db } from "@/db";
import Link from "next/link";

import { apps, shortcuts, userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import PracticePage from "./page";


export default async function PracticeLayout({
  params,
}: {
  params: { id: string };
}) {
  const {id} = await params;
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, parseInt(id)),
  });

  if (!app) {
    notFound();
  }

  const shortcutsList = await db
    .select()
    .from(shortcuts)
    .where(eq(shortcuts.appId, app.id));

  if (shortcutsList.length === 0) {
    notFound();
  }

  const appId = app.id;

  async function validateAttempt(shortcutId: number, success: boolean) {
    'use server';

    const progress = await db.query.userProgress.findFirst({
      where: eq(userProgress.shortcutId, shortcutId),
    });

    const now = new Date();

    if (progress) {
      await db
        .update(userProgress)
        .set({
          lastPracticed: now,
          successCount: success ? progress.successCount + 1 : progress.successCount,
          failureCount: success ? progress.failureCount : progress.failureCount + 1,
        })
        .where(eq(userProgress.id, progress.id));
    } else {
      await db.insert(userProgress).values({
        shortcutId,
        lastPracticed: now,
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
      });
    }

    revalidatePath(`/practice/${appId}`);
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex gap-4 mb-2">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 inline-block"
            >
              ← Home
            </Link>
            <Link
              href="/practice"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 inline-block"
            >
              ← Back to Practice
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Practice {app.name} Shortcuts</h1>
        </div>
        <PracticePage app={app} shortcuts={shortcutsList} validateAttempt={validateAttempt} />
      </main>
    </div>
  )

}
