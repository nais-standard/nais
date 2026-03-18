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
    dns: `_agent.publicdata.ai  3600  IN  TXT  "v=nais1; manifest=https://publicdata.ai/.well-known/agent.json"`,
    manifest: `{
  "nais": "1.0",
  "name": "Public Data Agent",
  "description": "Open access to curated public datasets — no API key required",
  "domain": "publicdata.ai",
  "version": "1.4.0",
  "updated": "2025-01-10",
  "mcp": "https://publicdata.ai/mcp",
  "capabilities": [
    "search",
    "fetch",
    "summarize"
  ],
  "tags": ["data", "open-access", "public"],
  "contact": "hello@publicdata.ai",
  "license": "CC0-1.0",
  "source": "https://github.com/publicdata-ai/agent"
}`,
    usage: `from nais import resolve

# Discover the agent
agent = resolve("publicdata.ai")
print(agent.capabilities)
# → ["search", "fetch", "summarize"]

# Call a capability — no auth needed
result = agent.call("search", query="global population data 2024")
for item in result.items:
    print(item.title, item.url)`,
    usageLang: 'python',
    notes: [
      'No auth object in the manifest — resolvers treat this as open access.',
      'Anyone can call the MCP endpoint without an API key.',
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
    dns: `_agent.secure-agent.xyz  3600  IN  TXT  "v=nais1; manifest=https://secure-agent.xyz/.well-known/agent.json; auth=wallet"`,
    manifest: `{
  "nais": "1.0",
  "name": "Secure Analysis Agent",
  "description": "Proprietary analysis engine with wallet-gated access",
  "domain": "secure-agent.xyz",
  "version": "3.0.1",
  "mcp": "https://secure-agent.xyz/mcp",
  "auth": {
    "type": "wallet",
    "chains": ["ethereum", "base", "solana"],
    "endpoint": "https://secure-agent.xyz/auth/challenge"
  },
  "capabilities": [
    "analyze",
    "classify",
    "report"
  ],
  "contact": "access@secure-agent.xyz"
}`,
    usage: `import { resolve } from '@nais/sdk';

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
      'Server issues a nonce, caller signs it with their wallet, server verifies the signature.',
      'Caller identity is their own NAIS domain, verified through wallet ownership.',
      'The SDK handles the challenge–response flow automatically.',
      'Multi-chain: callers on Ethereum, Base, or Solana are all accepted.',
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
    dns: `_agent.forecastpro.io  3600  IN  TXT  "v=nais1; manifest=https://forecastpro.io/.well-known/agent.json; mcp=https://forecastpro.io/mcp; auth=wallet; pay=x402"`,
    manifest: `{
  "nais": "1.0",
  "name": "ForecastPro",
  "description": "Professional-grade weather and climate forecasting agent",
  "domain": "forecastpro.io",
  "version": "5.2.0",
  "mcp": "https://forecastpro.io/mcp",
  "auth": {
    "type": "wallet",
    "chains": ["base", "ethereum"],
    "endpoint": "https://forecastpro.io/auth/challenge"
  },
  "payment": {
    "type": "x402",
    "endpoint": "https://forecastpro.io/pay",
    "currencies": ["USDC"],
    "pricePerCall": "0.002",
    "freeQuota": 50
  },
  "capabilities": ["forecast", "historical", "alerts", "radar"],
  "tags": ["weather", "climate", "forecast"]
}`,
    usage: `from nais import resolve
from nais.payment import X402Wallet

# Configure payment wallet (server-side)
wallet = X402Wallet.from_private_key(os.getenv("AGENT_PRIVATE_KEY"))

# Resolve with payment support
agent = resolve("forecastpro.io", payment_wallet=wallet)

# First 50 calls are free (freeQuota = 50)
# After that, SDK auto-pays 0.002 USDC per call
result = agent.call("forecast", location="Tokyo", days=7)
print(result.summary)

# Check spend
print(f"Total spent: {agent.payment.total_spent} USDC")`,
    usageLang: 'python',
    notes: [
      'First 50 calls per authenticated caller are free (freeQuota).',
      'After free quota, 0.002 USDC is charged per call via x402.',
      'Payment is in USDC on Base (cheapest gas fees).',
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
_agent.invoicing-agent.acme.corp  300  IN  TXT  "v=nais1; manifest=https://invoicing-agent.acme.corp/.well-known/agent.json; auth=bearer"`,
    manifest: `{
  "nais": "1.0",
  "name": "Acme Invoicing Agent",
  "description": "Automates invoice generation, routing, and approval workflows",
  "domain": "invoicing-agent.acme.corp",
  "version": "2.3.4",
  "updated": "2025-01-08",
  "mcp": "https://invoicing-agent.acme.corp/mcp",
  "auth": {
    "type": "bearer",
    "endpoint": "https://auth.acme.corp/token"
  },
  "capabilities": [
    "create-invoice",
    "route-for-approval",
    "query-status",
    "export-pdf"
  ],
  "tags": ["finance", "internal", "automation"],
  "contact": "platform-team@acme.corp"
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
        <div className="mb-8 pb-8 border-b border-slate-200">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">Examples</h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
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
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
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
            <h2 className="text-xl font-semibold text-slate-900 mb-2">{example.title}</h2>
            <p className="text-slate-500 leading-relaxed max-w-2xl">{example.description}</p>
          </div>

          {/* Notes */}
          <div className="callout callout-note mb-2">
            <ul className="space-y-1 mb-0">
              {example.notes.map((n) => (
                <li key={n} className="flex gap-2 text-sm">
                  <span className="text-slate-400 mt-px">→</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                DNS Record
              </p>
              <CodeBlock code={example.dns} language="dns" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 mt-4">
                agent.json Manifest
              </p>
              <CodeBlock code={example.manifest} language="json" filename="/.well-known/agent.json" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
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
