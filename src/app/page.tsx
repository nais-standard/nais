import type { Metadata } from 'next';
import CodeBlock from '@/components/CodeBlock';
import InteropDiagram from '@/components/InteropDiagram';
import MCPSetup from '@/components/MCPSetup';
import Reveal from '@/components/Reveal';
import { Button, Eyebrow, Section, SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'NAIS — Open Identity for the Agent Internet',
  description:
    'NAIS is an open standard for publishing AI agent identity, discovery, capabilities, and optional authentication using DNS and HTTPS. Websites use domains. Agents should too.',
};

const DNS_EXAMPLE = `_agent.weatheragent.link  IN  TXT  "v=nais1; manifest=https://weatheragent.link/.well-known/agent.json; k=ed25519:Bx91kQz3vR7w..."`;

const MANIFEST_EXAMPLE = `{
  "nais": "1.0",
  "name": "Weather Agent",
  "domain": "weatheragent.link",
  "mcp": "https://weatheragent.link/mcp",
  "tags": ["forecast", "alerts", "radar"],
  "signature": {
    "alg": "EdDSA",
    "kid": "ed25519:Bx91kQz3vR7w…",
    "jws": "eyJhbGciOiJFZERTQS…detached"
  }
}`;

const TS_EXAMPLE = `import { validate } from "@nais-standard/sdk";

// One call: read the DNS record, fetch the card, verify the signature.
const agent = await validate("weatheragent.link");

console.log(agent.signatureVerified); // true — checked against the DNS key
console.log(agent.mcpEndpoint);        // https://weatheragent.link/mcp
console.log(agent.tags);               // ["forecast", "alerts", "radar"]`;

const FOUNDATIONS = ['DNS', 'HTTPS', 'Ed25519', 'MCP', 'x402'];

const PROBLEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="10" cy="7" r="3" />
        <path d="M4.5 16c0-3 2.5-4.8 5.5-4.8s5.5 1.8 5.5 4.8" strokeLinecap="round" />
      </svg>
    ),
    title: 'Who am I even talking to?',
    body: 'Agents show up as anonymous API keys and random IDs — not names you’d recognize or trust. There’s no weatheragent.link.',
    today: 'an anonymous key, not a name',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M10 2.5l5.5 2v4.5c0 3.6-2.5 5.8-5.5 6.9-3-1.1-5.5-3.3-5.5-6.9V4.5L10 2.5z" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Is it really them?',
    body: 'Nothing stops a lookalike from impersonating a real agent. Without a signature, there’s no proof you’ve reached the genuine one.',
    today: 'no way to prove it',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="4.5" />
        <path d="M12 12l4 4" strokeLinecap="round" />
      </svg>
    ),
    title: 'How do I even reach it?',
    body: 'Every platform hides its agents behind a private registry and its own rules. There’s no front door on the open internet.',
    today: 'no public address',
  },
];

const GATEWAY_TOOLS = [
  { name: 'nais_resolve', desc: 'Resolve + verify an agent by domain' },
  { name: 'nais_list_tools', desc: 'List the agent’s MCP capabilities' },
  { name: 'nais_call', desc: 'Invoke a capability — verification enforced' },
];

const COMPARISON = [
  { dim: 'Identity', old: 'Opaque API key — sk-9f2c4a…', neu: 'A domain — weatheragent.link' },
  { dim: 'Discovery', old: 'Private, per-platform registry', neu: 'Public DNS — _agent.<domain>' },
  { dim: 'Trust', old: 'Taken on faith', neu: 'EdDSA signature, anchored in DNS' },
  { dim: 'Portability', old: 'Locked to one platform', neu: 'Any registrar — fully portable' },
  { dim: 'Integration', old: 'Bespoke per-vendor SDK', neu: 'MCP-compatible out of the box' },
  { dim: 'Payments', old: 'No standard', neu: 'Optional x402 machine payments' },
];

const ARTIFACTS = [
  {
    n: '01',
    title: 'Publish one DNS record',
    desc: 'A TXT record at _agent.<yourdomain> anchors your signing key in DNS — the root of trust. Nothing new to host.',
    code: DNS_EXAMPLE,
    language: 'dns',
    filename: '_agent.weatheragent.link',
  },
  {
    n: '02',
    title: 'Serve a signed card',
    desc: 'Your /.well-known/agent.json says who you are and what you can do — sealed with an EdDSA signature. Change one byte and verification fails.',
    code: MANIFEST_EXAMPLE,
    language: 'json',
    filename: '/.well-known/agent.json',
  },
  {
    n: '03',
    title: 'Anyone resolves and uses it',
    desc: 'Any SDK — or the MCP gateway — fetches the card, checks its signature against the DNS key, then trusts it. No key exchange, no sign-up.',
    code: TS_EXAMPLE,
    language: 'typescript',
    filename: 'resolve.ts',
  },
];

function ToolGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="band-dark relative pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="glow-hero" />
        <div className="grid-texture" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            <div className="min-w-0">
              <div className="mb-6">
                <Eyebrow onDark>NAIS v1.0 Draft — open for community review</Eyebrow>
              </div>
              <h1 className="text-[2.75rem] sm:text-6xl font-semibold tracking-tight text-white leading-[1.05] mb-6">
                Open identity for the{' '}
                <span className="text-gradient">agent internet</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-400 font-normal mb-5 leading-snug">
                Websites use domains.{' '}
                <span className="text-white font-medium">Agents should too.</span>
              </p>
              <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-xl">
                The Network Agent Identity Standard (NAIS) lets any AI agent publish a
                domain-based, cryptographically signed identity — so every other agent can
                discover it, verify it, and call it over MCP. No registry. No lock-in.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/spec" variant="primary" arrow>
                  Read the Spec
                </Button>
                <Button href="/quickstart" variant="secondary" onDark>
                  Start Building
                </Button>
                <Button href="https://github.com/nais-standard/nais" variant="ghost" onDark external>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  View GitHub
                </Button>
              </div>
            </div>
            <div className="min-w-0 lg:pl-4">
              <InteropDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Built-on strip ---------------- */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Built on the open web
          </span>
          {FOUNDATIONS.map((f) => (
            <span key={f} className="font-mono text-sm font-medium text-slate-600">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- Problem ---------------- */}
      <Section tone="surface">
        <SectionHeading eyebrow="The problem" title="You trust a website by its name. Agents don’t have one.">
          On the web, a domain and a padlock tell you exactly who you’re dealing with. AI agents have
          no equivalent — yet they’re already starting to act on your behalf, and talk to each other.
        </SectionHeading>
        <div className="grid sm:grid-cols-3 gap-6">
          {PROBLEMS.map(({ icon, title, body, today }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="card-lift bg-white rounded-2xl p-6 border border-slate-200 h-full flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="text-[1.0625rem] font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{body}</p>
                <div className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-[0.75rem] font-medium text-rose-600">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" />
                  </svg>
                  {today}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- Interop band (centerpiece) ---------------- */}
      <section className="band-dark relative py-16 sm:py-24">
        <div className="glow-hero" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            eyebrow="Interoperability"
            title={<>Your agent can call any other agent</>}
            onDark
          >
            Add the local NAIS gateway once, and your agent can reach <em className="not-italic font-medium text-slate-200">any</em> other
            agent on the internet — finding each by its domain and verifying its signature before it
            trusts a single response. One setup opens the whole network, with nothing taken on faith.
          </SectionHeading>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Connect once */}
            <Reveal className="min-w-0">
              <div className="card-dark h-full p-6 sm:p-7">
                <h3 className="text-white font-semibold text-lg mb-2">Connect once</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  Works with any MCP-capable client. The gateway runs locally — never a shared
                  service — so verification stays in your trust path and nothing re-centralizes the network.
                </p>
                <MCPSetup />
                <div className="mt-5 grid sm:grid-cols-3 gap-3">
                  {GATEWAY_TOOLS.map((t) => (
                    <div key={t.name} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ink-border)' }}>
                      <div className="font-mono text-[0.8rem] text-blue-300 mb-1">{t.name}</div>
                      <div className="text-[0.75rem] text-slate-400 leading-snug">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Then it just works — the Claude workflow */}
            <Reveal className="min-w-0">
              <div className="card-dark h-full p-6 sm:p-7 flex flex-col">
                <h3 className="text-white font-semibold text-lg mb-2">Then it just works — in chat</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  No glue code, no per-provider SDKs. Just ask — your LLM finds the agent by domain,
                  verifies its signature, and calls the right tool for you.
                </p>

                <div className="mt-auto space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  {/* user message */}
                  <div className="flex justify-end">
                    <div className="max-w-[88%] rounded-2xl rounded-br-md bg-blue-600 px-3.5 py-2 text-[0.82rem] leading-relaxed text-white">
                      What’s the weekend forecast for Miami?
                    </div>
                  </div>

                  {/* Claude: tool use + answer */}
                  <div className="flex gap-2.5">
                    <span
                      className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
                      style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.4)' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#a78bfa" aria-hidden="true">
                        <path d="M12 2c.5 4 2 5.5 6 6-4 .5-5.5 2-6 6-.5-4-2-5.5-6-6 4-.5 5.5-2 6-6z" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      {/* tool calls (gateway) */}
                      <div className="space-y-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[0.7rem] text-slate-400">
                        <div className="flex items-center gap-2">
                          <ToolGlyph />
                          <span className="min-w-0 truncate">nais_resolve(&quot;weatheragent.link&quot;)</span>
                          <span className="ml-auto flex flex-shrink-0 items-center gap-1 text-cyan-300">
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M2 6.5l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            verified
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ToolGlyph />
                          <span className="min-w-0 truncate">{'nais_call("forecast", { location: "Miami" })'}</span>
                        </div>
                      </div>
                      {/* Claude answer */}
                      <div className="rounded-2xl rounded-tl-md bg-white/[0.06] px-3.5 py-2 text-[0.82rem] leading-relaxed text-slate-200">
                        Sunny and 84°F through the weekend in Miami, with low humidity.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="band-dark relative py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              How it works
            </div>
            <h2 className="text-3xl sm:text-[2.25rem] font-semibold tracking-tight text-white mb-4">
              Three artifacts. That’s the whole standard.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              No SDK to adopt, no platform to join — a DNS record, a signed card, and one call to
              resolve it. Here’s the real thing.
            </p>
          </div>

          <div className="space-y-12 sm:space-y-16">
            {ARTIFACTS.map(({ n, title, desc, code, language, filename }) => (
              <Reveal key={n}>
                <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg font-mono text-sm font-semibold"
                        style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.35)', color: '#93c5fd' }}
                      >
                        {n}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 lg:pl-12">{desc}</p>
                  </div>
                  <div className="min-w-0 lg:col-span-8">
                    <CodeBlock code={code} language={language} filename={filename} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why NAIS: the old way vs NAIS ---------------- */}
      <Section tone="surface">
        <SectionHeading eyebrow="Why NAIS" title="From opaque keys to open identity">
          The same identity layer the web already runs on — applied to agents. Vendor-neutral,
          free to implement, and verifiable by anyone.
        </SectionHeading>
        <Reveal className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* header (desktop) */}
            <div className="hidden border-b border-slate-200 text-[0.7rem] font-semibold uppercase tracking-wider sm:grid sm:grid-cols-12">
              <div className="col-span-2 px-5 py-3" />
              <div className="col-span-5 px-5 py-3 text-slate-400">The old way</div>
              <div className="col-span-5 flex items-center gap-1.5 border-l border-blue-100 bg-blue-50/70 px-5 py-3 text-blue-700">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect width="20" height="20" rx="5" fill="#2563eb" />
                  <path d="M5 14V6h1.5l4 5.5V6H12v8h-1.5L6.5 8.5V14H5z" fill="white" fillRule="evenodd" />
                </svg>
                With NAIS
              </div>
            </div>

            {COMPARISON.map(({ dim, old, neu }, i) => (
              <div
                key={dim}
                className={`sm:grid sm:grid-cols-12 sm:items-stretch ${i > 0 ? 'border-t border-slate-200' : ''}`}
              >
                <div className="col-span-2 px-4 pt-3 pb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400 sm:px-5 sm:py-3.5 sm:text-[0.72rem]">
                  {dim}
                </div>
                <div className="col-span-5 flex items-start gap-2 px-4 py-1.5 text-[0.82rem] text-slate-500 sm:px-5 sm:py-3.5">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.6" className="mt-0.5 flex-shrink-0" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                  <span className="min-w-0">{old}</span>
                </div>
                <div className="col-span-5 flex items-start gap-2 border-blue-100 bg-blue-50/40 px-4 pt-1.5 pb-3 text-[0.82rem] text-slate-800 sm:border-l sm:px-5 sm:py-3.5">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#2563eb" strokeWidth="1.8" className="mt-0.5 flex-shrink-0" aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="min-w-0">{neu}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="band-dark relative py-20 sm:py-28">
        <div className="glow-hero" />
        <div className="grid-texture" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4 tracking-tight">
            Build an agent the whole internet can reach
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
            NAIS is open, vendor-neutral, and free to implement. Register your agent domain and
            publish a signed manifest in minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button href="/quickstart" variant="primary" arrow className="px-6 py-3">
              Get started in 5 minutes
            </Button>
            <Button href="/spec" variant="ghost" onDark className="px-6 py-3">
              Read the specification
            </Button>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Open standard — no login, no fees, no vendor lock-in.
          </p>
        </div>
      </section>
    </>
  );
}
