'use client';
import { useState } from 'react';
import CodeBlock from '@/components/CodeBlock';

const JS_INSTALL = `npm install @nais/sdk`;
const JS_RESOLVE = `import { resolve } from '@nais/sdk';

// Basic resolution
const agent = await resolve('weatheragent.link');
console.log(agent.name);         // "Weather Agent"
console.log(agent.capabilities); // ["forecast", "historical", "alerts"]
console.log(agent.mcp);          // "https://weatheragent.link/mcp"

// Call a capability
const result = await agent.call('forecast', {
  location: 'San Francisco',
  days: 5,
});
console.log(result.summary);`;

const JS_AUTH = `import { resolve } from '@nais/sdk';

// With wallet authentication (browser)
const agent = await resolve('secure-agent.xyz', {
  wallet: window.ethereum,
});

// With wallet authentication (Node.js / server)
import { Wallet } from 'ethers';
const signer = new Wallet(process.env.PRIVATE_KEY!);

const agent = await resolve('secure-agent.xyz', {
  signer,
});

const result = await agent.call('analyze', { data: payload });`;

const JS_PAYMENT = `import { resolve } from '@nais/sdk';
import { X402Wallet } from '@nais/sdk/payment';

const wallet = new X402Wallet({
  privateKey: process.env.AGENT_PRIVATE_KEY!,
  chain: 'base',
});

const agent = await resolve('forecastpro.io', { payment: wallet });

// SDK handles 402 responses automatically
const result = await agent.call('forecast', { location: 'Miami' });

console.log('Spent:', agent.payment.totalSpent, 'USDC');`;

const PY_INSTALL = `pip install nais-sdk`;
const PY_RESOLVE = `from nais import resolve

# Basic resolution
agent = resolve("weatheragent.link")
print(agent.name)          # "Weather Agent"
print(agent.capabilities)  # ["forecast", "historical", "alerts"]
print(agent.mcp)           # "https://weatheragent.link/mcp"

# Call a capability
result = agent.call("forecast", location="New York", days=3)
print(result.summary)`;

const PY_AUTH = `from nais import resolve
from nais.auth import WalletSigner
import os

# Load signer from env
signer = WalletSigner.from_private_key(os.getenv("AGENT_PRIVATE_KEY"))

# Resolve with auth
agent = resolve("secure-agent.xyz", signer=signer)

# SDK handles challenge–response automatically
result = agent.call("analyze", data=payload)
print(result)`;

const PY_ASYNC = `import asyncio
from nais.asyncio import resolve

async def main():
    agent = await resolve("weatheragent.link")
    result = await agent.call("forecast", location="Tokyo")
    print(result.summary)

asyncio.run(main())`;

const PHP_INSTALL = `composer require nais/sdk`;
const PHP_RESOLVE = `<?php
use Nais\\Sdk\\Resolver;

$resolver = new Resolver();
$agent = $resolver->resolve('weatheragent.link');

echo $agent->getName();            // "Weather Agent"
print_r($agent->getCapabilities()); // ["forecast", "historical"]

$result = $agent->call('forecast', [
    'location' => 'London',
    'days'     => 5,
]);

echo $result['summary'];`;

const PHP_AUTH = `<?php
use Nais\\Sdk\\Resolver;
use Nais\\Sdk\\Auth\\WalletSigner;

$signer = WalletSigner::fromPrivateKey(getenv('AGENT_PRIVATE_KEY'));

$resolver = new Resolver();
$agent = $resolver->resolve('secure-agent.xyz', ['signer' => $signer]);

$result = $agent->call('analyze', ['data' => $payload]);
print_r($result);`;

const GO_INSTALL = `go get github.com/nais-standard/nais-go`;
const GO_RESOLVE = `package main

import (
    "fmt"
    "github.com/nais-standard/nais-go/nais"
)

func main() {
    agent, err := nais.Resolve("weatheragent.link")
    if err != nil {
        panic(err)
    }

    fmt.Println(agent.Name)          // "Weather Agent"
    fmt.Println(agent.Capabilities)  // [forecast historical alerts]

    result, err := agent.Call("forecast", map[string]any{
        "location": "Berlin",
        "days":     7,
    })
    if err != nil {
        panic(err)
    }

    fmt.Println(result["summary"])
}`;

const GO_AUTH = `package main

import (
    "os"
    "github.com/nais-standard/nais-go/nais"
    "github.com/nais-standard/nais-go/nais/auth"
)

func main() {
    signer, err := auth.NewWalletSigner(os.Getenv("AGENT_PRIVATE_KEY"))
    if err != nil {
        panic(err)
    }

    agent, err := nais.Resolve("secure-agent.xyz",
        nais.WithSigner(signer),
    )
    if err != nil {
        panic(err)
    }

    result, err := agent.Call("analyze", map[string]any{
        "data": payload,
    })
    if err != nil {
        panic(err)
    }

    fmt.Println(result)
}`;

const LANGS = [
  {
    id: 'javascript',
    label: 'JavaScript / TypeScript',
    icon: 'JS',
    iconBg: '#f7df1e',
    iconColor: '#000',
    package: '@nais/sdk',
    packageUrl: 'https://www.npmjs.com/package/@nais/sdk',
    packageLabel: 'npm',
    status: 'available',
    tabs: [
      { id: 'install', label: 'Install', code: JS_INSTALL, lang: 'bash' },
      { id: 'resolve', label: 'Resolve & Call', code: JS_RESOLVE, lang: 'javascript' },
      { id: 'auth', label: 'With Auth', code: JS_AUTH, lang: 'javascript' },
      { id: 'payment', label: 'With Payment', code: JS_PAYMENT, lang: 'javascript' },
    ],
  },
  {
    id: 'python',
    label: 'Python',
    icon: 'PY',
    iconBg: '#3776ab',
    iconColor: '#fff',
    package: 'nais-sdk',
    packageUrl: 'https://pypi.org/project/nais-sdk/',
    packageLabel: 'PyPI',
    status: 'available',
    tabs: [
      { id: 'install', label: 'Install', code: PY_INSTALL, lang: 'bash' },
      { id: 'resolve', label: 'Resolve & Call', code: PY_RESOLVE, lang: 'python' },
      { id: 'auth', label: 'With Auth', code: PY_AUTH, lang: 'python' },
      { id: 'async', label: 'Async / await', code: PY_ASYNC, lang: 'python' },
    ],
  },
  {
    id: 'php',
    label: 'PHP',
    icon: 'PHP',
    iconBg: '#8892bf',
    iconColor: '#fff',
    package: 'nais/sdk',
    packageUrl: 'https://packagist.org/packages/nais/sdk',
    packageLabel: 'Packagist',
    status: 'available',
    tabs: [
      { id: 'install', label: 'Install', code: PHP_INSTALL, lang: 'bash' },
      { id: 'resolve', label: 'Resolve & Call', code: PHP_RESOLVE, lang: 'php' },
      { id: 'auth', label: 'With Auth', code: PHP_AUTH, lang: 'php' },
    ],
  },
  {
    id: 'go',
    label: 'Go',
    icon: 'GO',
    iconBg: '#00add8',
    iconColor: '#fff',
    package: 'github.com/nais-standard/nais-go',
    packageUrl: 'https://pkg.go.dev/github.com/nais-standard/nais-go',
    packageLabel: 'pkg.go.dev',
    status: 'available',
    tabs: [
      { id: 'install', label: 'Install', code: GO_INSTALL, lang: 'bash' },
      { id: 'resolve', label: 'Resolve & Call', code: GO_RESOLVE, lang: 'go' },
      { id: 'auth', label: 'With Auth', code: GO_AUTH, lang: 'go' },
    ],
  },
];

export default function SDKsPage() {
  const [activeLang, setActiveLang] = useState(LANGS[0].id);
  const [activeTab, setActiveTab] = useState(LANGS[0].tabs[0].id);

  const lang = LANGS.find((l) => l.id === activeLang)!;
  const tab = lang.tabs.find((t) => t.id === activeTab) ?? lang.tabs[0];

  const switchLang = (id: string) => {
    setActiveLang(id);
    setActiveTab(LANGS.find((l) => l.id === id)!.tabs[0].id);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <div className="mb-8 pb-8 border-b border-slate-200">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">
            SDKs &amp; Libraries
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            Community-maintained client libraries for resolving and calling NAIS agents. All SDKs
            implement the same core interface and support DNS resolution, manifest fetching, wallet
            authentication, and x402 payments.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => switchLang(l.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border transition-all ${
                activeLang === l.id
                  ? 'border-blue-200 bg-blue-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                style={{ background: l.iconBg, color: l.iconColor }}
              >
                {l.icon}
              </span>
              <span className={`text-sm font-medium ${activeLang === l.id ? 'text-blue-900' : 'text-slate-700'}`}>
                {l.label}
              </span>
            </button>
          ))}
        </div>

        {/* Package info */}
        <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">{lang.packageLabel}</span>
            <code className="font-mono text-sm text-slate-700">{lang.package}</code>
          </div>
          <a
            href={lang.packageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View on {lang.packageLabel}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 2h5v5M8 2 2 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 mb-0 border-b border-slate-200">
          {lang.tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <CodeBlock code={tab.code} language={tab.lang} />

        {/* Feature matrix */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">SDK Feature Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-2.5 px-4 border border-slate-200 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                    Feature
                  </th>
                  {LANGS.map((l) => (
                    <th key={l.id} className="text-center py-2.5 px-4 border border-slate-200 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      {l.icon}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['DNS resolution', true, true, true, true],
                  ['Manifest fetch + validation', true, true, true, true],
                  ['MCP endpoint call', true, true, true, true],
                  ['Wallet auth (EVM)', true, true, true, true],
                  ['Wallet auth (Solana)', true, true, false, false],
                  ['Bearer token auth', true, true, true, true],
                  ['x402 auto-payment', true, true, false, true],
                  ['Async / non-blocking', true, true, false, true],
                  ['Manifest caching', true, true, true, true],
                  ['DNSSEC validation', true, true, false, true],
                ].map(([feature, ...support]) => (
                  <tr key={String(feature)} className="even:bg-slate-50/50">
                    <td className="py-2.5 px-4 border border-slate-200 text-slate-700">{String(feature)}</td>
                    {(support as boolean[]).map((s, i) => (
                      <td key={i} className="py-2.5 px-4 border border-slate-200 text-center">
                        {s ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block" aria-label="Supported">
                            <circle cx="8" cy="8" r="7" fill="#dcfce7" />
                            <polyline points="4.5,8 7,10.5 11.5,5.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block" aria-label="Not supported">
                            <circle cx="8" cy="8" r="7" fill="#f1f5f9" />
                            <path d="M5.5 8h5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Contribute an SDK:</strong> NAIS SDKs are community-maintained. If you would
              like to contribute an SDK for a language not listed here (Rust, Java, Ruby, .NET, etc.),
              see the{' '}
              <a
                href="https://github.com/nais-standard/nais"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                SDK specification
              </a>{' '}
              on GitHub and open a PR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
