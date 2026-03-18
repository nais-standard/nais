import Link from 'next/link';

const sections = [
  {
    title: 'Standard',
    links: [
      { href: '/spec', label: 'Specification' },
      { href: '/quickstart', label: 'Quickstart' },
      { href: '/examples', label: 'Examples' },
      { href: '/validator', label: 'Validator' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { href: '/sdks', label: 'SDKs & Libraries' },
      { href: '/quickstart#agent-json', label: 'agent.json Schema' },
      { href: '/spec#dns', label: 'DNS Records' },
      { href: '/spec#mcp', label: 'MCP Discovery' },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: '/governance', label: 'Governance' },
      { href: '/faq', label: 'FAQ' },
      {
        href: 'https://github.com/nais-standard/nais',
        label: 'GitHub',
        external: true,
      },
      {
        href: 'https://github.com/nais-standard/nais/discussions',
        label: 'Discussions',
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect width="20" height="20" rx="4" fill="#2563eb" />
                <path
                  d="M5 14V6h1.5l4 5.5V6H12v8h-1.5L6.5 8.5V14H5z"
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
              <span className="font-mono font-medium text-slate-900">NAIS</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-3">
              Network Agent Identity Standard
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              An open standard. Not owned by any company.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="badge badge-blue text-[0.625rem]">v1.0 Draft</span>
              <span className="badge badge-green text-[0.625rem]">Open Standard</span>
            </div>
          </div>

          {/* Nav columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
                      >
                        {link.label}
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M3 2h5v5M8 2 2 8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            NAIS is released under the{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 underline underline-offset-2"
            >
              CC BY 4.0
            </a>{' '}
            license.
          </p>
          <p className="text-xs text-slate-400">
            Contributions welcome on{' '}
            <a
              href="https://github.com/nais-standard/nais"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 underline underline-offset-2"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
