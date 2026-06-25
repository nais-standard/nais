import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'Copy-paste NAIS examples — DNS TXT records, a signed agent.json card, MCP snapshots, and end-to-end resolution in JavaScript, Python, and PHP.',
  alternates: { canonical: '/examples' },
  openGraph: {
    title: 'Examples | NAIS',
    description:
      'Copy-paste NAIS examples — DNS records, a signed agent.json card, and end-to-end resolution in JS, Python, and PHP.',
    url: '/examples',
  },
  twitter: {
    title: 'Examples | NAIS',
    description:
      'Copy-paste NAIS examples — DNS records, a signed agent.json card, and end-to-end resolution in JS, Python, and PHP.',
  },
};

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
