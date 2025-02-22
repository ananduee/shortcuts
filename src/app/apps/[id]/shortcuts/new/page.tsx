"use client";

import Link from "next/link";
import { useState } from "react";
import KeyboardCapture from "./KeyboardCapture";
import { App } from "@/db/schema";

type Props = {
  app: App;
  createShortcutAction: (formData: FormData) => Promise<void>;
  validateKeys: (keys: string) => Promise<boolean>;
};

export default function NewShortcutPage({ app, createShortcutAction, validateKeys }: Props) {
  const [keys, setKeys] = useState("");
  const [warning, setWarning] = useState("");

  const handleKeysChange = async (newKeys: string) => {
    setKeys(newKeys);
    if (newKeys) {
      const isDuplicate = await validateKeys(newKeys);
      setWarning(isDuplicate ? "This key combination already exists" : "");
    } else {
      setWarning("");
    }
  };

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
          <h1 className="text-3xl font-bold">Add New Shortcut</h1>
        </div>

        <form
          action={createShortcutAction}
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
              placeholder="e.g. ⌘ + C or Ctrl + C"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              value={keys}
            />
            <KeyboardCapture onKeysChange={handleKeysChange} />
            {warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{warning}</p>
            )}
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
              placeholder="What does this shortcut do?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!!warning}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Shortcut
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
