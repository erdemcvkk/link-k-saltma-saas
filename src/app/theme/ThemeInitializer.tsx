"use client";
import { useEffect } from 'react';

/**
 * ThemeInitializer synchronizes the website theme with the value stored in
 * `localStorage`. We are enforcing a light theme only.
 */
export default function ThemeInitializer() {
 useEffect(() => {
 try {
 document.documentElement.classList.remove('dark');
 localStorage.setItem('theme', 'light');
 } catch (e) {
 // Silently ignore errors (e.g., when localStorage is unavailable)
 }
 }, []);

 return null;
}
