'use client';
import { useEffect, useState } from 'react';

// Light/dark toggle. Persists to localStorage; the no-FOUC script in the layout
// sets the initial class before hydration so there's no flash.
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
    >
      {/* Sun (shown in dark mode) */}
      <svg viewBox="0 0 20 20" fill="currentColor" className="hidden h-4 w-4 dark:block" aria-hidden="true">
        <path d="M10 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-4a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 10a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm10.66-5.66a1 1 0 0 1 0 1.41l-.7.71a1 1 0 1 1-1.42-1.42l.71-.7a1 1 0 0 1 1.41 0ZM6.46 13.54a1 1 0 0 1 0 1.41l-.71.71a1 1 0 0 1-1.41-1.42l.7-.7a1 1 0 0 1 1.42 0Zm9.2.7a1 1 0 0 1-1.42 1.42l-.7-.71a1 1 0 0 1 1.41-1.41l.71.7ZM6.46 6.46a1 1 0 0 1-1.42 0l-.7-.71A1 1 0 0 1 5.75 4.34l.71.7a1 1 0 0 1 0 1.42ZM10 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z" />
      </svg>
      {/* Moon (shown in light mode) */}
      <svg viewBox="0 0 20 20" fill="currentColor" className="block h-4 w-4 dark:hidden" aria-hidden="true">
        <path d="M17 11.8A7 7 0 0 1 8.2 3a.5.5 0 0 0-.66-.62 8 8 0 1 0 10.08 10.08.5.5 0 0 0-.62-.66Z" />
      </svg>
    </button>
  );
}
