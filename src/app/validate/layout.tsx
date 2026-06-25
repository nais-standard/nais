import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Validate an Agent',
  description:
    'Resolve and cryptographically verify any NAIS agent by domain. Checks the DNS TXT record, fetches the signed agent.json card, and verifies its EdDSA (Ed25519) signature in your browser.',
  alternates: { canonical: '/validate' },
  openGraph: {
    title: 'Validate an Agent | NAIS',
    description:
      'Resolve and cryptographically verify any NAIS agent by domain — DNS, signed card, and Ed25519 signature.',
    url: '/validate',
  },
  twitter: {
    title: 'Validate an Agent | NAIS',
    description:
      'Resolve and cryptographically verify any NAIS agent by domain — DNS, signed card, and Ed25519 signature.',
  },
};

export default function ValidateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
