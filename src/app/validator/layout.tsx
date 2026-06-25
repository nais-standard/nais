import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Card Validator',
  description:
    'Validate a NAIS agent.json card against the NAIS 1.0 JSON Schema and inspect each resolution step — DNS discovery, card fetch, signature verification, and schema checks.',
  alternates: { canonical: '/validator' },
  openGraph: {
    title: 'Card Validator | NAIS',
    description:
      'Validate a NAIS agent.json card against the NAIS 1.0 JSON Schema and inspect each resolution step.',
    url: '/validator',
  },
  twitter: {
    title: 'Card Validator | NAIS',
    description:
      'Validate a NAIS agent.json card against the NAIS 1.0 JSON Schema and inspect each resolution step.',
  },
};

export default function ValidatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
