import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://nais.id'),
  title: {
    default: 'NAIS — Network Agent Identity Standard',
    template: '%s | NAIS',
  },
  description:
    'NAIS is an open standard for publishing AI agent identity, discovery, capabilities, and optional authentication using DNS and HTTPS.',
  keywords: [
    'NAIS', 'AI agent identity', 'open standard', 'DNS', 'agent discovery',
    'MCP', 'agent.json', 'machine payments', 'x402',
  ],
  authors: [{ name: 'NAIS Community' }],
  creator: 'NAIS Community',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nais.id',
    siteName: 'NAIS',
    title: 'NAIS — Network Agent Identity Standard',
    description: 'Websites use domains. Agents should too.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NAIS — Network Agent Identity Standard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAIS — Network Agent Identity Standard',
    description: 'Websites use domains. Agents should too.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets the theme class before paint (no flash). Precedence: ?theme= → saved → system. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=null,t=null;try{p=new URLSearchParams(location.search).get('theme')}catch(e){}try{if(p)localStorage.setItem('theme',p);t=p||localStorage.getItem('theme')}catch(e){t=p}var d=t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList[d?'add':'remove']('dark')})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Structured data for search engines (Organization + WebSite). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'NAIS',
                alternateName: 'Network Agent Identity Standard',
                url: 'https://nais.id',
                logo: 'https://nais.id/og-image.png',
                description:
                  'NAIS is an open standard for publishing AI agent identity, discovery, capabilities, and optional authentication using DNS and HTTPS.',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'NAIS — Network Agent Identity Standard',
                url: 'https://nais.id',
              },
            ]),
          }}
        />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
