"use client";

import { useState, useEffect } from "react";
import { App, Shortcut } from "@/db/schema";
import { getNextShortcut } from "./actions";

type Props = {
  app: App;
  shortcuts: Shortcut[];
  validateAttempt: (shortcutId: number, success: boolean) => Promise<void>;
};

export default function PracticePage({
  app,
  shortcuts,
  validateAttempt,
}: Props) {
  const [currentShortcut, setCurrentShortcut] = useState<Shortcut | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [capturedKeys, setCapturedKeys] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (shortcuts.length > 0) {
      getNextShortcut(app.id).then((shortcut) => {
        setCurrentShortcut(shortcut ?? null);
      });
    }
  }, [shortcuts, app.id]);

  useEffect(() => {
    if (!isCapturing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const key = e.key.toLowerCase();
      if (key === "meta") {
        if (!capturedKeys.includes("⌘")) {
          setCapturedKeys((prev) => [...prev, "⌘"]);
        }
      } else if (key === "control") {
        if (!capturedKeys.includes("Ctrl")) {
          setCapturedKeys((prev) => [...prev, "Ctrl"]);
        }
      } else if (key === "alt") {
        if (!capturedKeys.includes("Alt")) {
          setCapturedKeys((prev) => [...prev, "Alt"]);
        }
      } else if (key === "shift") {
        if (!capturedKeys.includes("Shift")) {
          setCapturedKeys((prev) => [...prev, "Shift"]);
        }
      } else if (!capturedKeys.includes(key.toUpperCase())) {
        setCapturedKeys((prev) => [...prev, key.toUpperCase()]);
      }
    };

    const handleKeyUp = async (e: KeyboardEvent) => {
      if (capturedKeys.length > 0 && currentShortcut) {
        const attemptedKeys = capturedKeys.join(" + ");
        const success = attemptedKeys === currentShortcut.keys;

        setMessageType(success ? "success" : "error");
        setMessage(success ? "Correct!" : "Try again!");

        await validateAttempt(currentShortcut.id, success);

        if (success) {
          setTimeout(() => {
            getNextShortcut(app.id).then((shortcut) => {
              setCurrentShortcut(shortcut ?? null);
            });
            setMessage("");
            setMessageType(null);
          }, 1000);
        }

        setIsCapturing(false);
        setCapturedKeys([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isCapturing, capturedKeys, currentShortcut, shortcuts, validateAttempt]);

  if (!currentShortcut) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No shortcuts available for practice.
      </p>
    );
  }

  return (
    <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-lg">
      <p className="text-xl mb-6">{currentShortcut.description}</p>

      <button
        onClick={() => setIsCapturing(true)}
        className={`px-6 py-3 text-lg rounded-lg transition-colors ${
          isCapturing
            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        {isCapturing ? "Type your shortcut..." : "Click to try"}
      </button>

      {message && (
        <div
          className={`mt-4 text-lg ${
            messageType === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      {capturedKeys.length > 0 && (
        <div className="mt-4 text-lg font-mono">{capturedKeys.join(" + ")}</div>
      )}
    </div>
  );
}
