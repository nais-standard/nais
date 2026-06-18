import DocNav from './DocNav';

interface NavItem {
  id: string;
  label: string;
  indent?: boolean;
}

interface DocLayoutProps {
  title: string;
  description?: string;
  navItems: NavItem[];
  children: React.ReactNode;
  badge?: string;
}

export default function DocLayout({
  title,
  description,
  navItems,
  children,
  badge,
}: DocLayoutProps) {
  return (
    <div className="min-h-screen doc-shell">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex gap-10 lg:gap-16">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-20">
              <div className="mb-4 pl-4">
                <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {badge ?? 'Documentation'}
                </div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
              </div>
              <DocNav navItems={navItems} />
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 pl-4">
                <a
                  href="https://github.com/nais-standard/nais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
                >
                  Edit this page on GitHub
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M3 2h5v5M8 2 2 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 min-w-0">
            {/* Page header */}
            <div className="mb-8 pb-8 border-b border-slate-200 dark:border-white/10">
              {badge && (
                <div className="mb-3">
                  <span className="badge badge-blue">{badge}</span>
                </div>
              )}
              <h1 className="text-3xl sm:text-[2.5rem] font-semibold tracking-tight text-slate-900 dark:text-white leading-tight mb-3">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
              )}
            </div>

            {/* Mobile table of contents */}
            <details className="group lg:hidden mb-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                On this page
                <svg
                  width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className="transition-transform group-open:rotate-180" aria-hidden="true"
                >
                  <polyline points="3,6 8,11 13,6" />
                </svg>
              </summary>
              <ul className="px-4 pb-3 pt-1 space-y-1.5">
                {navItems.map(({ id, label, indent }) => (
                  <li key={id} className={indent ? 'pl-3' : ''}>
                    <a href={`#${id}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>

            <div className="prose-doc">{children}</div>
          </article>
        </div>
      </div>
    </div>
  );
}
