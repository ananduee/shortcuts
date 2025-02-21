import { apps, shortcuts } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateShortcut } from "../../../actions";

export default async function EditShortcutPage({
  params,
}: {
  params: { id: string; shortcutId: string };
}) {
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, parseInt(params.id)),
  });

  if (!app) {
    notFound();
  }

  const shortcut = await db.query.shortcuts.findFirst({
    where: eq(shortcuts.id, parseInt(params.shortcutId)),
  });

  if (!shortcut) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/apps/${app.id}`}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 inline-block"
          >
            ← Back to {app.name}
          </Link>
          <h1 className="text-3xl font-bold">Edit Shortcut</h1>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            await updateShortcut(app.id, shortcut.id, formData);
          }}
          className="space-y-6 max-w-xl"
        >
          <div>
            <label
              htmlFor="keys"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Keys
            </label>
            <input
              type="text"
              id="keys"
              name="keys"
              required
              defaultValue={shortcut.keys}
              placeholder="e.g. ⌘ + C or Ctrl + C"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              defaultValue={shortcut.description}
              placeholder="What does this shortcut do?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Shortcut
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}