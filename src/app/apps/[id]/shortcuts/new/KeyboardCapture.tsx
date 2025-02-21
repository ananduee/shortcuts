"use client";

import { useState, useEffect } from "react";

interface KeyboardCaptureProps {
  onKeysChange: (keys: string) => void;
}

export default function KeyboardCapture({ onKeysChange }: KeyboardCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedKeys, setCapturedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!isCapturing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const key = e.key.toLowerCase();
      if (key === 'meta') {
        if (!capturedKeys.includes('⌘')) {
          setCapturedKeys(prev => [...prev, '⌘']);
        }
      } else if (key === 'control') {
        if (!capturedKeys.includes('Ctrl')) {
          setCapturedKeys(prev => [...prev, 'Ctrl']);
        }
      } else if (key === 'alt') {
        if (!capturedKeys.includes('Alt')) {
          setCapturedKeys(prev => [...prev, 'Alt']);
        }
      } else if (key === 'shift') {
        if (!capturedKeys.includes('Shift')) {
          setCapturedKeys(prev => [...prev, 'Shift']);
        }
      } else if (!capturedKeys.includes(key.toUpperCase())) {
        setCapturedKeys(prev => [...prev, key.toUpperCase()]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (capturedKeys.length > 0) {
        const keyString = capturedKeys.join(' + ');
        onKeysChange(keyString);
        setIsCapturing(false);
        setCapturedKeys([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCapturing, capturedKeys, onKeysChange]);

  return (
    <button
      type="button"
      onClick={() => setIsCapturing(true)}
      className={`px-3 py-1 text-sm border rounded transition-colors ${isCapturing
        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
        : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
        }`}
    >
      {isCapturing ? 'Press your shortcut...' : 'Capture Shortcut'}
    </button>
  );
}