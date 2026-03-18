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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
