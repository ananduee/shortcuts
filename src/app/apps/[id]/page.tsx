import { apps, shortcuts } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteShortcut } from "./actions";

export default async function AppDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, parseInt(params.id)),
  });

  if (!app) {
    notFound();
  }

  const shortcutsList = await db
    .select()
    .from(shortcuts)
    .where(eq(shortcuts.appId, app.id));

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/apps"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 inline-block"
            >
              ← Back to Applications
            </Link>
            <h1 className="text-3xl font-bold">{app.name}</h1>
            {app.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {app.description}
              </p>
            )}
          </div>
          <Link
            href={`/apps/${app.id}/shortcuts/new`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Shortcut
          </Link>
        </div>

        <div className="grid gap-6">
          {shortcutsList.length === 0 ? (
            <div className="text-center p-8 border border-gray-200 dark:border-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                No shortcuts added yet. Add your first shortcut to get started!
              </p>
            </div>
          ) : (
            shortcutsList.map((shortcut) => (
              <div
                key={shortcut.id}
                className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono mb-2">
                      {shortcut.keys}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/apps/${app.id}/shortcuts/${shortcut.id}/edit`}
                      className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-800 rounded hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteShortcut(app.id, shortcut.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="px-3 py-1 text-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-500 rounded hover:border-red-300 dark:hover:border-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
