import type { Metadata } from 'next';
import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';

export const metadata: Metadata = {
  title: 'NAIS — Open Identity for the Agent Internet',
  description:
    'NAIS is an open standard for publishing AI agent identity, discovery, capabilities, and optional authentication using DNS and HTTPS. Websites use domains. Agents should too.',
};

const DNS_EXAMPLE = `_agent.weatheragent.com  IN  TXT  "v=nais1; manifest=https://weatheragent.com/.well-known/agent.json; mcp=https://weatheragent.com/mcp; auth=wallet; pay=x402"`;

const MANIFEST_EXAMPLE = `{
  "nais": "1.0",
  "name": "Weather Agent",
  "description": "Real-time weather forecasting and alerts",
  "domain": "weatheragent.com",
  "version": "2.1.0",
  "mcp": "https://weatheragent.com/mcp",
  "auth": {
    "type": "wallet",
    "chains": ["ethereum", "solana"]
  },
  "payment": {
    "type": "x402",
    "endpoint": "https://weatheragent.com/pay",
    "currencies": ["USDC"],
    "pricePerCall": "0.001"
  },
  "capabilities": ["forecast", "historical", "alerts", "radar"],
  "contact": "agent@weatheragent.com",
  "license": "MIT"
}`;

const PYTHON_EXAMPLE = `from nais import resolve

# Discover any agent by domain
agent = resolve("weatheragent.com")

# Inspect capabilities
print(agent.capabilities)
# → ["forecast", "historical", "alerts", "radar"]

# Call a capability
result = agent.call("forecast", location="Miami", days=5)
print(result.summary)
# → "Sunny, 84°F, low humidity through the weekend"`;

const PROBLEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 10h14M3 6h14M3 14h8" strokeLinecap="round" />
      </svg>
    ),
    title: 'Fragmented identity',
    body: 'Today, AI agents are identified by opaque API keys, proprietary registry entries, or platform-specific accounts with no interoperability between them.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6v4l3 2" strokeLinecap="round" />
      </svg>
    ),
    title: 'No standard discovery',
    body: 'There is no universal way to find what an agent does, how to authenticate with it, or whether it supports machine payments — without reading proprietary documentation.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="2" y="5" width="16" height="12" rx="2" />
        <path d="M2 9h16" />
        <path d="M6 2v3M14 2v3" strokeLinecap="round" />
      </svg>
    ),
    title: 'Weak portability',
    body: 'Moving an agent between platforms means updating every client that references it. Identity is tied to infrastructure, not to the agent itself.',
  },
];

const BENEFITS = [
  { label: 'Open and registrar-agnostic', desc: 'Works with any domain from any registrar worldwide.' },
  { label: 'Human-readable identity', desc: 'weatheragent.com is more trustworthy than a UUID.' },
  { label: 'DNS + HTTPS native', desc: 'No new infrastructure. Runs on the existing internet.' },
  { label: 'Optional wallet auth', desc: 'Cryptographic proof of agent ownership without passwords.' },
  { label: 'Optional machine payments', desc: 'x402 support for metered, autonomous agent billing.' },
  { label: 'MCP compatible', desc: 'Endpoint discovery works with the Model Context Protocol.' },
];

const STEPS = [
  { n: '01', title: 'Agent gets a domain', body: 'weatheragent.com — same as any website, from any registrar.' },
  { n: '02', title: 'Domain publishes a TXT record', body: '_agent.weatheragent.com TXT record anchors the identity in DNS.' },
  { n: '03', title: 'Domain serves /.well-known/agent.json', body: 'A JSON manifest describes capabilities, endpoints, and auth.' },
  { n: '04', title: 'Other agents discover and connect', body: 'Any client can resolve the domain and call the MCP or API endpoint.' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-xs font-medium text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              NAIS v1.0 Draft — Open for community review
            </div>
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Open identity for<br />the agent internet
            </h1>
            <p className="text-xl sm:text-2xl text-slate-500 font-normal mb-4 leading-snug">
              Websites use domains.{' '}
              <span className="text-slate-900 font-medium">Agents should too.</span>
            </p>
            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-2xl">
              NAIS is an open standard for publishing AI agent identity, discovery, capabilities,
              and optional authentication and payment information using DNS and HTTPS.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/spec"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Read the Spec
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M3 7h8M7 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/quickstart"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors"
              >
                Start Building
              </Link>
              <a
                href="https://github.com/nais-standard/nais"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-md transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-16 bg-slate-50" style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              The problem with agent identity today
            </h2>
            <p className="text-slate-500 leading-relaxed">
              The agent ecosystem is fragmented before it has even matured. Without a common identity layer,
              agents cannot reliably discover or verify each other.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PROBLEMS.map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-white rounded-lg p-6 border border-slate-200"
              >
                <div className="text-slate-400 mb-3">{icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2 text-[0.9375rem]">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">How NAIS works</h2>
            <p className="text-slate-500 leading-relaxed">
              NAIS resolves agent identity the same way the web resolves website identity — through DNS
              and standard HTTP endpoints.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line on large screens */}
            <div
              className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px"
              style={{ background: 'linear-gradient(to right, #e2e8f0, #2563eb, #2563eb, #e2e8f0)', zIndex: 0 }}
            />
            {STEPS.map(({ n, title, body }) => (
              <div key={n} className="relative z-10">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 font-mono text-sm font-medium border"
                  style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }}
                >
                  {n}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5 text-[0.9375rem]">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="py-16 sm:py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-block font-mono text-sm font-medium text-blue-400 mb-3">
              weatheragent.com
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">See it in practice</h2>
            <p className="text-slate-400 max-w-xl leading-relaxed">
              Three artifacts — a DNS record, a JSON manifest, and a library call — are all it takes
              to make an agent universally discoverable.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                1 — DNS TXT Record
              </div>
              <div
                className="code-block rounded-lg overflow-hidden"
                style={{ background: '#0d1117' }}
              >
                <div
                  className="px-4 py-2 border-b text-xs text-slate-500"
                  style={{ borderColor: '#21262d', background: '#161b22' }}
                >
                  DNS
                </div>
                <pre
                  className="p-4 text-[0.75rem] leading-relaxed overflow-x-auto"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <code>
                    <span className="tok-dns-field">_agent.weatheragent.com</span>
                    {'  '}
                    <span className="tok-type">IN</span>
                    {'  '}
                    <span className="tok-kw">TXT</span>
                    {'\n  '}
                    <span className="tok-pct">&quot;</span>
                    <span className="tok-dns-field">v</span>
                    <span className="tok-dns-sep">=</span>
                    <span className="tok-dns-value">nais1</span>
                    <span className="tok-dns-sep">;</span>
                    {'\n   '}
                    <span className="tok-dns-field">manifest</span>
                    <span className="tok-dns-sep">=</span>
                    <span className="tok-dns-value">https://weatheragent.com/.well-known/agent.json</span>
                    <span className="tok-dns-sep">;</span>
                    {'\n   '}
                    <span className="tok-dns-field">mcp</span>
                    <span className="tok-dns-sep">=</span>
                    <span className="tok-dns-value">https://weatheragent.com/mcp</span>
                    <span className="tok-dns-sep">;</span>
                    {'\n   '}
                    <span className="tok-dns-field">auth</span>
                    <span className="tok-dns-sep">=</span>
                    <span className="tok-dns-value">wallet</span>
                    <span className="tok-dns-sep">;</span>
                    {'\n   '}
                    <span className="tok-dns-field">pay</span>
                    <span className="tok-dns-sep">=</span>
                    <span className="tok-dns-value">x402</span>
                    <span className="tok-pct">&quot;</span>
                  </code>
                </pre>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                2 — agent.json Manifest
              </div>
              <CodeBlock code={MANIFEST_EXAMPLE} language="json" filename="/.well-known/agent.json" />
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                3 — Resolve &amp; Call
              </div>
              <CodeBlock code={PYTHON_EXAMPLE} language="python" filename="discover.py" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Why NAIS</h2>
            <p className="text-slate-500 leading-relaxed">
              Designed for the open internet, not any single platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ label, desc }) => (
              <div
                key={label}
                className="flex gap-3 p-5 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="8" fill="#dbeafe" />
                  <polyline
                    points="5.5,9 8,11.5 12.5,6.5"
                    stroke="#2563eb"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div>
                  <div className="font-medium text-slate-900 text-sm mb-0.5">{label}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-16 sm:py-20"
        style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Build an agent that can be discovered by domain
          </h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
            NAIS is open, vendor-neutral, and free to implement. Register your agent domain and
            publish a manifest in minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/quickstart"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Get started in 5 minutes
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M3 7h8M7 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/spec"
              className="inline-flex items-center px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-md transition-colors"
            >
              Read the specification
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Open standard — no login, no fees, no vendor lock-in.
          </p>
        </div>
      </section>
    </>
  );
}
