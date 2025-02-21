import { apps } from "@/db/schema";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function AppsPage() {
  const appsList = await db.select().from(apps).orderBy(desc(apps.updatedAt));

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold">Applications</h1>
          </div>
          <Link
            href="/apps/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Application
          </Link>
        </div>

        <div className="grid gap-6">
          {appsList.length === 0 ? (
            <div className="text-center p-8 border border-gray-200 dark:border-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                No applications added yet. Add your first application to get started!
              </p>
            </div>
          ) : (
            appsList.map((app) => (
              <div
                key={app.id}
                className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{app.name}</h2>
                    {app.description && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {app.description}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/apps/${app.id}`}
                    className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-800 rounded hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    Manage Shortcuts
                  </Link>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Added {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}