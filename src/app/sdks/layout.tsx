import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDKs',
  description:
    'Official NAIS SDKs for JavaScript/TypeScript, Python, and PHP. Resolve agents directly over DNS and verify their signed cards — no central resolver in the trust path.',
  keywords: [
    'NAIS SDK', 'JavaScript SDK', 'Python SDK', 'PHP SDK', 'agent resolution', 'Ed25519',
  ],
  alternates: { canonical: '/sdks' },
  openGraph: {
    title: 'SDKs | NAIS',
    description:
      'Official NAIS SDKs for JavaScript/TypeScript, Python, and PHP — resolve and verify agents directly over DNS.',
    url: '/sdks',
  },
  twitter: {
    title: 'SDKs | NAIS',
    description:
      'Official NAIS SDKs for JavaScript/TypeScript, Python, and PHP — resolve and verify agents directly over DNS.',
  },
};

export default function SdksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
