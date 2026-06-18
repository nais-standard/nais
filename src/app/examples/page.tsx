'use client';
import { useState } from 'react';
import CodeBlock from '@/components/CodeBlock';

const EXAMPLES = [
  {
    id: 'public',
    label: 'Public Agent',
    badge: 'No auth',
    badgeClass: 'badge-green',
    title: 'Public read-only agent',
    description:
      'A fully public agent with no authentication and no payment requirements. Anyone can resolve the domain, fetch the manifest, and call the MCP endpoint.',
    dns: `_agent.publicdata.ai  3600  IN  TXT  "v=nais1; manifest=https://publicdata.ai/.well-known/agent.json; k=ed25519:Lp4m...Qv8"`,
    manifest: `{
  "nais": "1.0",
  "cardVersion": 4,
  "updated": "2026-06-17T00:00:00Z",
  "name": "Public Data Agent",
  "description": "Open access to curated public datasets — no API key required",
  "domain": "publicdata.ai",
  "mcp": "https://publicdata.ai/mcp",
  "auth": [{ "scheme": "none" }],
  "tags": ["data", "open-access", "public", "search", "fetch", "summarize"],
  "contact": "hello@publicdata.ai",
  "signature": {
    "alg": "EdDSA",
    "kid": "ed25519:Lp4m...Qv8",
    "jws": "eyJhbGciOiJFZERTQS...detached"
  }
}`,
    usage: `from nais import resolve

# Discover the agent — its signature is verified on resolve
agent = resolve("publicdata.ai")
print(agent.signature_verified)
# → True
print(agent.tags)
# → ["data", "open-access", "public", "search", "fetch", "summarize"]

# Call a tool — no auth needed
result = agent.call("search", query="global population data 2024")
for item in result.items:
    print(item.title, item.url)`,
    usageLang: 'python',
    notes: [
      'auth is [{ "scheme": "none" }] — resolvers treat this as open access.',
      'Anyone can call the MCP endpoint without an API key.',
      'The card is still signed: the signature proves the card has not been tampered with.',
      'Suitable for public APIs, open datasets, documentation agents.',
    ],
  },
  {
    id: 'wallet',
    label: 'Wallet Auth',
    badge: 'Wallet auth',
    badgeClass: 'badge-blue',
    title: 'Wallet-authenticated agent',
    description:
      'An agent that requires callers to authenticate with a cryptographic wallet. Only agents with a valid, verified domain identity can call it.',
    dns: `_agent.secure-agent.xyz  3600  IN  TXT  "v=nais1; manifest=https://secure-agent.xyz/.well-known/agent.json; k=ed25519:Wq2...7Hs"`,
    manifest: `{
  "nais": "1.0",
  "cardVersion": 9,
  "updated": "2026-06-17T00:00:00Z",
  "name": "Secure Analysis Agent",
  "description": "Proprietary analysis engine with wallet-gated access",
  "domain": "secure-agent.xyz",
  "mcp": "https://secure-agent.xyz/mcp",
  "auth": [{ "scheme": "wallet" }],
  "tags": ["analysis", "classify", "report", "private"],
  "contact": "access@secure-agent.xyz",
  "signature": {
    "alg": "EdDSA",
    "kid": "ed25519:Wq2...7Hs",
    "jws": "eyJhbGciOiJFZERTQS...detached"
  }
}`,
    usage: `import { resolve } from '@nais-standard/sdk';

// The SDK handles wallet auth automatically
const agent = await resolve('secure-agent.xyz', {
  wallet: window.ethereum,   // or a server-side signer
});

// SDK: requests challenge → signs → calls
const result = await agent.call('analyze', {
  data: financialRecords,
  format: 'structured',
});

console.log(result.summary);`,
    usageLang: 'javascript',
    notes: [
      'auth declares [{ "scheme": "wallet" }] — callers must prove identity via wallet signing.',
      'Caller identity is their own NAIS domain, verified through wallet ownership.',
      'The SDK handles the challenge–response flow automatically.',
      'The card itself is signed; its kid matches the DNS k= fingerprint.',
    ],
  },
  {
    id: 'paid',
    label: 'Paid Agent',
    badge: 'x402 payments',
    badgeClass: 'badge-amber',
    title: 'Paid agent using x402',
    description:
      'An agent that charges per-call using the HTTP 402 / x402 protocol. Callers send a micro-payment in USDC before each call is fulfilled.',
    dns: `_agent.forecastpro.io  3600  IN  TXT  "v=nais1; manifest=https://forecastpro.io/.well-known/agent.json; k=ed25519:Zr8...3Tn"`,
    manifest: `{
  "nais": "1.0",
  "cardVersion": 12,
  "updated": "2026-06-17T00:00:00Z",
  "name": "ForecastPro",
  "description": "Professional-grade weather and climate forecasting agent",
  "domain": "forecastpro.io",
  "mcp": "https://forecastpro.io/mcp",
  "auth": [{ "scheme": "wallet" }],
  "payment": {
    "type": "x402",
    "networks": ["base"],
    "assets": ["USDC"],
    "payTo": ["0x9aB3c1D4e5F60718293A4b5C6d7E8f90A1B2C3d4"],
    "pricing": { "forecast": "0.002", "historical": "0.005", "alerts": "0.001" }
  },
  "tags": ["weather", "climate", "forecast", "historical", "alerts", "radar"],
  "signature": {
    "alg": "EdDSA",
    "kid": "ed25519:Zr8...3Tn",
    "jws": "eyJhbGciOiJFZERTQS...detached"
  }
}`,
    usage: `from nais import resolve
from nais.payment import X402Wallet

# Configure payment wallet (server-side)
wallet = X402Wallet.from_private_key(os.getenv("AGENT_PRIVATE_KEY"))

# Resolve with payment support
agent = resolve("forecastpro.io", payment_wallet=wallet)

# Only pay after the card's signature is verified
assert agent.signature_verified, "refuse to pay an unsigned card"

# SDK auto-pays the per-tool price to the signed payTo address
result = agent.call("forecast", location="Tokyo", days=7)
print(result.summary)

# Check spend
print(f"Total spent: {agent.payment.total_spent} USDC")`,
    usageLang: 'python',
    notes: [
      'Per-tool pricing in USDC on Base, charged via x402.',
      'payTo lives inside the signed card body — trusted only after signature verification.',
      'x402 payments are irreversible, so never pay from an unsigned/unverified card.',
      'The SDK handles the 402 response and payment submission automatically.',
    ],
  },
  {
    id: 'internal',
    label: 'Enterprise Agent',
    badge: 'Bearer auth',
    badgeClass: 'badge-gray',
    title: 'Internal enterprise agent',
    description:
      'A private agent for internal enterprise use. It uses bearer token authentication, is not publicly resolvable, and operates inside a corporate domain.',
    dns: `; Internal DNS zone — not publicly accessible
_agent.invoicing-agent.acme.corp  300  IN  TXT  "v=nais1; manifest=https://invoicing-agent.acme.corp/.well-known/agent.json; k=ed25519:Nm5...9Kp"`,
    manifest: `{
  "nais": "1.0",
  "cardVersion": 3,
  "updated": "2026-06-17T00:00:00Z",
  "name": "Acme Invoicing Agent",
  "description": "Automates invoice generation, routing, and approval workflows",
  "domain": "invoicing-agent.acme.corp",
  "mcp": "https://invoicing-agent.acme.corp/mcp",
  "auth": [{ "scheme": "bearer" }],
  "tags": ["finance", "internal", "automation", "create-invoice", "export-pdf"],
  "contact": "platform-team@acme.corp",
  "signature": {
    "alg": "EdDSA",
    "kid": "ed25519:Nm5...9Kp",
    "jws": "eyJhbGciOiJFZERTQS...detached"
  }
}`,
    usage: `package main

import (
    "github.com/nais-standard/nais-go/nais"
    "os"
)

func main() {
    // Token obtained from internal auth service
    token := os.Getenv("INTERNAL_AGENT_TOKEN")

    agent, err := nais.Resolve("invoicing-agent.acme.corp",
        nais.WithBearerToken(token),
    )
    if err != nil {
        panic(err)
    }

    result, err := agent.Call("create-invoice", map[string]any{
        "vendor":   "Acme Supplies Ltd",
        "amount":   4200.00,
        "currency": "USD",
        "due_days": 30,
    })
    if err != nil {
        panic(err)
    }

    fmt.Println("Invoice ID:", result["invoice_id"])
}`,
    usageLang: 'go',
    notes: [
      'Domain is a private corp TLD — only resolvable from within the corporate network.',
      'Bearer auth — callers present a standard JWT from the internal auth service.',
      'No payment required — internal agents are not monetised.',
      'NAIS provides consistent discovery even for internal agents.',
    ],
  },
];

export default function ExamplesPage() {
  const [active, setActive] = useState(EXAMPLES[0].id);
  const example = EXAMPLES.find((e) => e.id === active)!;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <div className="mb-8 pb-8 border-b border-slate-200 dark:border-white/10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">Examples</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Four worked examples showing NAIS across different agent types — from fully public agents
            to paid, wallet-authenticated, and private enterprise deployments.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setActive(ex.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                active === ex.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {ex.label}
              <span
                className={`badge ${ex.badgeClass} ${
                  active === ex.id ? 'opacity-80' : ''
                }`}
              >
                {ex.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Example content */}
        <div key={example.id}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{example.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{example.description}</p>
          </div>

          {/* Notes */}
          <div className="callout callout-note mb-2">
            <ul className="space-y-1 mb-0">
              {example.notes.map((n) => (
                <li key={n} className="flex gap-2 text-sm">
                  <span className="text-slate-400 dark:text-slate-500 mt-px">→</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                DNS Record
              </p>
              <CodeBlock code={example.dns} language="dns" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 mt-4">
                agent.json Manifest
              </p>
              <CodeBlock code={example.manifest} language="json" filename="/.well-known/agent.json" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Resolver Usage
              </p>
              <CodeBlock code={example.usage} language={example.usageLang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
