import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about NAIS — how agent identity works over DNS and HTTPS, how signed cards are verified, trust assumptions, and how it relates to MCP.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ | NAIS',
    description:
      'Answers to common questions about NAIS agent identity, signed cards, trust assumptions, and MCP.',
    url: '/faq',
  },
  twitter: {
    title: 'FAQ | NAIS',
    description:
      'Answers to common questions about NAIS agent identity, signed cards, trust assumptions, and MCP.',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
