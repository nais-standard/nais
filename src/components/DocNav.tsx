'use client';
import { useEffect, useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  indent?: boolean;
}

/**
 * Per-page table of contents with scroll-spy: highlights the section currently
 * in view as the reader scrolls. A left rail marks the active heading.
 */
export default function DocNav({ navItems }: { navItems: NavItem[] }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const els = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActive(topmost.target.id);
        }
      },
      // Activate a heading once it reaches the top ~third, below the sticky nav.
      { rootMargin: '-88px 0px -68% 0px', threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    setActive((prev) => prev || els[0].id);
    return () => obs.disconnect();
  }, [navItems]);

  return (
    <nav aria-label="On this page">
      <ul className="border-l border-slate-200 dark:border-white/10">
        {navItems.map(({ id, label, indent }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`-ml-px block border-l py-1.5 text-sm transition-colors ${
                  indent ? 'pl-6' : 'pl-4'
                } ${
                  isActive
                    ? 'border-blue-600 dark:border-blue-400 font-medium text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
