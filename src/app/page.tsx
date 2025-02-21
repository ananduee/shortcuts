import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Keyboard Shortcuts Master</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Master keyboard shortcuts for your favorite applications through practice and spaced repetition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/practice"
            className="block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Practice Mode</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Test your knowledge and improve your muscle memory through interactive exercises
            </p>
          </Link>

          <Link 
            href="/apps"
            className="block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Manage Apps</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Add and customize shortcuts for different applications
            </p>
          </Link>

          <Link 
            href="/progress"
            className="block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Progress Tracking</h2>
            <p className="text-gray-600 dark:text-gray-400">
              View your learning progress and identify areas for improvement
            </p>
          </Link>

          <Link 
            href="/settings"
            className="block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your learning experience and preferences
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
