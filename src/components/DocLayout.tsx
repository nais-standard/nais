import Link from 'next/link';

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
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex gap-10 lg:gap-16">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-20">
              <div className="mb-6">
                <h1 className="text-sm font-semibold text-slate-900 mb-0.5">{title}</h1>
                {badge && <span className="badge badge-blue mt-1">{badge}</span>}
              </div>
              <nav>
                <ul className="space-y-0.5">
                  {navItems.map(({ id, label, indent }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={`block text-sm py-1 transition-colors hover:text-blue-600 ${
                          indent ? 'pl-3 text-slate-400 hover:text-blue-500' : 'text-slate-500'
                        }`}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-400 mb-2">On GitHub</p>
                <a
                  href="https://github.com/nais-standard/nais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
                >
                  Edit this page
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
            <div className="mb-8 pb-8 border-b border-slate-200">
              {badge && (
                <div className="mb-3">
                  <span className="badge badge-blue">{badge}</span>
                </div>
              )}
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-slate-500 leading-relaxed">{description}</p>
              )}
            </div>

            <div className="prose-doc">{children}</div>
          </article>
        </div>
      </div>
    </div>
  );
}
