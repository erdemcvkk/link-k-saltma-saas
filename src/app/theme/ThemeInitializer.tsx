"use client";
import { useEffect } from 'react';

/**
 * ThemeInitializer synchronizes the website theme with the value stored in
 * `localStorage`. It runs once on the client side to avoid hydration mismatches.
 * The component renders nothing – it only performs a side‑effect.
 */
export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme') || 'dark';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Silently ignore errors (e.g., when localStorage is unavailable)
    }
  }, []);

  return null;
}
