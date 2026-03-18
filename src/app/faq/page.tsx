'use client';
import { useState } from 'react';

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

const FAQS: FAQItem[] = [
  {
    q: 'Is NAIS owned or controlled by one company?',
    a: (
      <>
        <p>
          No. NAIS is an open standard with no corporate owner. It is not controlled by any
          registrar, cloud provider, AI platform, or startup. The specification is developed in the
          open on GitHub under a CC BY 4.0 license, which means anyone can read it, implement it,
          fork it, or extend it without asking permission.
        </p>
        <p>
          No single organization has veto power over the standard. Governance decisions are made by
          consensus among contributors, with a small editorial board handling day-to-day editorial
          work. See the{' '}
          <a href="/governance" className="text-blue-600 hover:underline">
            Governance page
          </a>{' '}
          for the full model.
        </p>
      </>
    ),
  },
  {
    q: 'Does NAIS require cryptocurrency or blockchain?',
    a: (
      <>
        <p>
          No. The core NAIS standard — DNS-based discovery and the <code>agent.json</code> manifest
          — has no dependency on blockchain, tokens, or crypto wallets.
        </p>
        <p>
          Wallet authentication and x402 machine payments are <strong>entirely optional</strong>{' '}
          extensions. The vast majority of NAIS agents will not use them. If your agent is free and
          open-access, you need only a domain, a DNS TXT record, and a JSON file.
        </p>
      </>
    ),
  },
  {
    q: 'Does NAIS replace DNS or require changes to DNS infrastructure?',
    a: (
      <p>
        No. NAIS builds <em>on top of</em> DNS — it does not replace it or require changes to DNS
        servers, resolvers, or infrastructure. The only DNS change an agent operator makes is adding
        a single TXT record at the <code>_agent</code> subdomain. This is a standard operation
        supported by every DNS provider on the planet.
      </p>
    ),
  },
  {
    q: 'Does NAIS require MCP (Model Context Protocol)?',
    a: (
      <>
        <p>
          No. MCP endpoint discovery is one optional feature of NAIS. An agent can publish a NAIS
          identity without exposing any MCP endpoint. The <code>mcp</code> field in both the DNS
          record and the manifest is optional.
        </p>
        <p>
          Agents that prefer a REST API can use the <code>api</code> field in the manifest instead.
          Agents that simply want a discoverable identity with no programmatic endpoint are also
          valid NAIS agents.
        </p>
      </>
    ),
  },
  {
    q: 'Can I use NAIS with any domain registrar?',
    a: (
      <p>
        Yes. NAIS works with any domain registrar and any DNS provider — GoDaddy, Namecheap,
        Cloudflare, Porkbun, Google Domains, AWS Route 53, and so on. The only requirement is the
        ability to add a TXT record. Every registrar and DNS provider supports this. There is no
        approved registrar list, no partnership with registrars, and no advantage to using one
        registrar over another.
      </p>
    ),
  },
  {
    q: 'Are payments required to use NAIS?',
    a: (
      <p>
        No. Payments are an optional feature for agents that want to charge per-call. If you do not
        include a <code>payment</code> object in your manifest, your agent is free to call. Callers
        will never be asked to pay unless an agent explicitly opts into the x402 payment protocol.
        There are also no fees to use the NAIS standard itself — it is free to implement.
      </p>
    ),
  },
  {
    q: 'Can private or internal enterprise agents use NAIS?',
    a: (
      <>
        <p>
          Yes. NAIS works perfectly for private agents that are only resolvable within a corporate
          network, VPN, or internal DNS zone. An agent on <code>invoicing-agent.corp.acme.com</code>{' '}
          that is not publicly accessible is still a valid NAIS agent — it just cannot be resolved
          by entities outside the network.
        </p>
        <p>
          This is useful for internal enterprise automation: a finance agent, an HR agent, and a
          procurement agent can all discover each other through NAIS even though none of them are
          publicly accessible.
        </p>
      </>
    ),
  },
  {
    q: 'What stops someone from impersonating an agent domain?',
    a: (
      <>
        <p>
          The same mechanisms that prevent domain impersonation for websites: domain ownership and
          HTTPS certificates. Since agent identity is rooted in domain control, only the entity that
          controls the domain can publish a NAIS record and manifest for it.
        </p>
        <p>
          For additional security, operators should enable DNSSEC on their domain, which
          cryptographically signs DNS records and prevents spoofing at the DNS level. Resolvers
          should validate TLS certificates when fetching manifests and should refuse to follow
          redirects that cross domain boundaries.
        </p>
      </>
    ),
  },
  {
    q: 'Can I register the same agent on multiple domains?',
    a: (
      <p>
        Yes. A single agent can publish NAIS records on multiple domains. Each domain is an
        independent identity. If you want to migrate an agent from one domain to another, you can
        publish records on both during the transition period and deprecate the old one by removing or
        tombstoning its record.
      </p>
    ),
  },
  {
    q: 'How is NAIS different from a centralized agent registry?',
    a: (
      <>
        <p>
          A centralized registry requires agents to register with a third party and creates a single
          point of failure, censorship, and dependency. NAIS has no registry. Discovery happens
          through DNS, which is a distributed, replicated system with no central owner.
        </p>
        <p>
          This means: no registration fees, no approval process, no possibility of deregistration
          by a third party, and no platform lock-in. An agent&apos;s identity lives on the domain it
          controls, not in a database it doesn&apos;t.
        </p>
      </>
    ),
  },
  {
    q: 'What happens if the DNS record TTL expires or the manifest changes?',
    a: (
      <p>
        Resolvers should cache DNS TXT records according to the TTL set by the operator (commonly
        300–3600 seconds). Manifest responses should be cached using HTTP cache headers
        (<code>Cache-Control</code>, <code>ETag</code>). If a resolver caches a stale manifest, the
        worst case is that it uses outdated capability information until the cache expires. Resolvers
        should implement a sensible maximum cache TTL (NAIS recommends no more than 1 hour for
        manifests) to limit the impact of stale data.
      </p>
    ),
  },
  {
    q: 'Is NAIS ready for production use?',
    a: (
      <>
        <p>
          NAIS 1.0 is currently in <strong>draft</strong> status. The core protocol (DNS record
          format, manifest schema, resolution model) is stable and we do not anticipate breaking
          changes before 1.0 final. The optional extensions (wallet auth, x402 payments) are also
          stable but may receive minor refinements based on implementor feedback.
        </p>
        <p>
          You can implement NAIS today and have confidence that 1.0-draft manifests will continue to
          be valid under 1.0 final. We encourage early adopters to provide feedback on GitHub
          Discussions.
        </p>
      </>
    ),
  },
];

function FAQItem({ item, open, onToggle }: { item: FAQItem; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-medium text-slate-900 text-[0.9375rem] leading-snug group-hover:text-blue-600 transition-colors">
          {item.q}
        </span>
        <span className="flex-shrink-0 mt-0.5 text-slate-400 group-hover:text-blue-500 transition-colors">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className={`transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
            aria-hidden="true"
          >
            <line x1="9" y1="3" x2="9" y2="15" />
            <line x1="3" y1="9" x2="15" y2="9" className={`transition-opacity ${open ? 'opacity-0' : ''}`} />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-5 text-sm text-slate-600 leading-relaxed space-y-3 max-w-3xl [&_a]:text-blue-600 [&_a]:hover:underline [&_code]:text-[0.8em] [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-slate-200">
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <div className="mb-10 pb-8 border-b border-slate-200">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Common questions about NAIS — what it is, what it requires, and how it fits into the
            broader agent ecosystem.
          </p>
        </div>

        {/* FAQ list */}
        <div>
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Didn't find answer */}
        <div className="mt-10 pt-8 border-t border-slate-200 text-center">
          <h2 className="text-base font-semibold text-slate-700 mb-2">Didn&apos;t find your answer?</h2>
          <p className="text-sm text-slate-500 mb-4">
            Ask in GitHub Discussions or open an issue for spec-related questions.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://github.com/nais-standard/nais/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Ask on GitHub Discussions
            </a>
            <a
              href="https://github.com/nais-standard/nais/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-md transition-colors"
            >
              Open an Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
