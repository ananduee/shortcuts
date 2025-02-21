"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createApp } from "./actions";

export default function NewAppPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const handleLogoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const svg = event.target.value;
    setLogoPreview(svg);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      await createApp(formData);
      router.push("/apps");
      router.refresh();
    } catch (err) {
      setError("Failed to create application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add Application</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Application Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              placeholder="Enter application name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              placeholder="Enter application description"
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium mb-2">
              Logo SVG (Optional)
            </label>
            <textarea
              id="logo"
              name="logo"
              rows={5}
              onChange={handleLogoChange}
              className="font-mono w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              placeholder="Paste your SVG code here"
            />
            {logoPreview && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Preview</label>
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
                  <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: logoPreview }} />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Application"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}