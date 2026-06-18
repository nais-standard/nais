'use client';
import { useState } from 'react';
import CodeBlock from '@/components/CodeBlock';

/* ---------------- JavaScript / TypeScript ---------------- */
const JS_INSTALL = `npm install @nais-standard/sdk`;
const JS_RESOLVE = `import { resolve } from "@nais-standard/sdk";

// DNS lookup -> fetch the signed card -> verify its EdDSA signature.
// All client-side; no central resolver in the path.
const r = await resolve("weatheragent.link");

console.log(r.signature.verified); // true — checked against the DNS k= key
console.log(r.card.name);          // "WeatherAgent"
console.log(r.card.mcp);           // "https://weatheragent.link/mcp"
console.log(r.card.tags);          // ["weather", "forecast", ...]`;
const JS_VALIDATE = `import { validate } from "@nais-standard/sdk";

// Same pipeline, returned as a flat, verification-aware summary —
// convenient for gating whether you trust and use the agent.
const a = await validate("weatheragent.link");

console.log(a.valid);             // true
console.log(a.signatureVerified); // true
console.log(a.mcpEndpoint);       // "https://weatheragent.link/mcp"
console.log(a.tags);              // ["weather", "forecast", ...]`;
const JS_VERIFY = `import { verifyCard, canonicalize } from "@nais-standard/sdk";

// Verify a card you already hold against a DNS k= key — no network.
const sig = verifyCard(card, "ed25519:Bx91kQz3vR7w…");
console.log(sig.verified, sig.kid, sig.reason);

// Reproduce the exact bytes that get signed (JCS canonical form).
const signingBytes = canonicalize({ ...card, signature: undefined });

// DNS + fetch are injectable for offline, deterministic tests:
await resolve("example.com", { lookupTxt, fetchCard });`;

/* ---------------- Python ---------------- */
const PY_INSTALL = `pip install nais-sdk`;
const PY_RESOLVE = `from nais_sdk import resolve

# DNS lookup -> fetch the signed card -> verify its EdDSA signature.
r = resolve("weatheragent.link")

print(r["signature"]["verified"])  # True — checked against the DNS k= key
print(r["card"]["name"])           # "WeatherAgent"
print(r["card"]["mcp"])            # "https://weatheragent.link/mcp"
print(r["card"]["tags"])           # ["weather", "forecast", ...]`;
const PY_VALIDATE = `from nais_sdk import validate

# Flat, verification-aware summary.
a = validate("weatheragent.link")

print(a["valid"])               # True
print(a["signature_verified"])  # True
print(a["mcp_endpoint"])        # "https://weatheragent.link/mcp"
print(a["tags"])                # ["weather", "forecast", ...]`;
const PY_VERIFY = `from nais_sdk import verify_card, canonicalize

# Verify a card you already hold against a DNS k= key — no network.
sig = verify_card(card, "ed25519:Bx91kQz3vR7w…")
print(sig["verified"], sig["kid"], sig["reason"])

# DNS + fetch are injectable for offline, deterministic tests:
resolve("example.com", lookup_txt=lookup_txt, fetch_card=fetch_card)`;

/* ---------------- PHP ---------------- */
const PHP_INSTALL = `composer require nais-standard/sdk`;
const PHP_RESOLVE = `<?php
use Nais\\Resolver;

// DNS lookup -> fetch the signed card -> verify its EdDSA signature.
$r = (new Resolver())->resolve('weatheragent.link');

var_dump($r['signature']['verified']); // bool(true)
echo $r['card']['name'];               // "WeatherAgent"
echo $r['card']['mcp'];                // "https://weatheragent.link/mcp"
print_r($r['card']['tags']);`;
const PHP_VALIDATE = `<?php
use Nais\\Resolver;

// Flat, verification-aware summary.
$a = (new Resolver())->validate('weatheragent.link');

var_dump($a['valid']);              // bool(true)
var_dump($a['signature_verified']); // bool(true)
echo $a['mcp_endpoint'];            // "https://weatheragent.link/mcp"
print_r($a['tags']);`;
const PHP_VERIFY = `<?php
use Nais\\Resolver;

// Static helpers verify a card you already hold against a DNS k= key.
$sig = Resolver::verifyCard($card, 'ed25519:Bx91kQz3vR7w…');
var_dump($sig['verified']);

// Reproduce the exact bytes that get signed (JCS canonical form).
$bytes = Resolver::canonicalize($body);`;

const LANGS = [
  {
    id: 'javascript',
    label: 'JavaScript / TypeScript',
    icon: 'JS',
    iconBg: '#f7df1e',
    iconColor: '#000',
    package: '@nais-standard/sdk',
    packageUrl: 'https://www.npmjs.com/package/@nais-standard/sdk',
    packageLabel: 'npm',
    tabs: [
      { id: 'install', label: 'Install', code: JS_INSTALL, lang: 'bash' },
      { id: 'resolve', label: 'Resolve', code: JS_RESOLVE, lang: 'javascript' },
      { id: 'validate', label: 'Validate', code: JS_VALIDATE, lang: 'javascript' },
      { id: 'verify', label: 'Verify (offline)', code: JS_VERIFY, lang: 'javascript' },
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
    tabs: [
      { id: 'install', label: 'Install', code: PY_INSTALL, lang: 'bash' },
      { id: 'resolve', label: 'Resolve', code: PY_RESOLVE, lang: 'python' },
      { id: 'validate', label: 'Validate', code: PY_VALIDATE, lang: 'python' },
      { id: 'verify', label: 'Verify (offline)', code: PY_VERIFY, lang: 'python' },
    ],
  },
  {
    id: 'php',
    label: 'PHP',
    icon: 'PHP',
    iconBg: '#8892bf',
    iconColor: '#fff',
    package: 'nais-standard/sdk',
    packageUrl: 'https://packagist.org/packages/nais-standard/sdk',
    packageLabel: 'Packagist',
    tabs: [
      { id: 'install', label: 'Install', code: PHP_INSTALL, lang: 'bash' },
      { id: 'resolve', label: 'Resolve', code: PHP_RESOLVE, lang: 'php' },
      { id: 'validate', label: 'Validate', code: PHP_VALIDATE, lang: 'php' },
      { id: 'verify', label: 'Verify (offline)', code: PHP_VERIFY, lang: 'php' },
    ],
  },
];

const INTERFACE = [
  { name: 'resolve(domain)', desc: 'DNS lookup → fetch card → verify signature. Returns the full structured result (dns, card, signature, validation).' },
  { name: 'validate(domain)', desc: 'Same pipeline, returned as a flat, verification-aware summary (valid, signatureVerified, mcpEndpoint, tags, …).' },
  { name: 'verifyCard(card, k)', desc: 'Verify a card you already hold against a DNS k= key — offline, no network.' },
  { name: 'canonicalize(body)', desc: 'Reproduce the exact JCS canonical bytes that get signed.' },
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
        <div className="mb-8 pb-8 border-b border-slate-200 dark:border-white/10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-3">
            SDKs &amp; Libraries
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Official client libraries for resolving and verifying NAIS agents. All three implement
            the same interface — DNS resolution, signed-card fetching, mandatory EdDSA signature
            verification, and schema validation — entirely client-side, with no central resolver in
            the path. DNS lookup and card fetch are injectable for offline testing, and the
            verification logic is kept byte-identical across languages by a shared conformance suite.
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
                  ? 'border-blue-200 bg-blue-50 shadow-sm dark:border-blue-500/25 dark:bg-blue-500/10'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[0.04]'
              }`}
            >
              <span
                className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold font-mono flex-shrink-0"
                style={{ background: l.iconBg, color: l.iconColor }}
              >
                {l.icon}
              </span>
              <span className={`text-sm font-medium ${activeLang === l.id ? 'text-blue-900 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                {l.label}
              </span>
            </button>
          ))}
        </div>

        {/* Package info */}
        <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 dark:bg-white/[0.04] dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide font-medium">{lang.packageLabel}</span>
            <code className="font-mono text-sm text-slate-700 dark:text-slate-200">{lang.package}</code>
          </div>
          <a
            href={lang.packageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 flex items-center gap-1"
          >
            View on {lang.packageLabel}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 2h5v5M8 2 2 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 mb-0 border-b border-slate-200 dark:border-white/10">
          {lang.tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === t.id
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <CodeBlock code={tab.code} language={tab.lang} />

        {/* Shared interface */}
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">The shared interface</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-2xl leading-relaxed">
            Every SDK exposes the same four entry points (named idiomatically per language —
            e.g. <code>verify_card</code> in Python, <code>Resolver::verifyCard</code> in PHP). Because
            the conformance suite keeps them byte-identical, a card that verifies with one verifies with all.
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
            {INTERFACE.map((fn, i) => (
              <div
                key={fn.name}
                className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-4 py-3 ${
                  i > 0 ? 'border-t border-slate-200 dark:border-white/10' : ''
                }`}
              >
                <code className="font-mono text-sm text-blue-600 dark:text-blue-300 sm:w-56 flex-shrink-0">{fn.name}</code>
                <span className="text-sm text-slate-600 dark:text-slate-300">{fn.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related tooling */}
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Related tooling</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://www.npmjs.com/package/@nais-standard/cli"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
            >
              <div className="font-mono text-sm text-slate-900 dark:text-white mb-1">@nais-standard/cli</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                The <code>nais</code> command — scaffold, sign, and verify an agent from the terminal.
                <span className="block mt-1 font-mono text-xs text-slate-400 dark:text-slate-500">npx @nais-standard/cli init-agent &lt;domain&gt;</span>
              </p>
            </a>
            <a
              href="https://www.npmjs.com/package/@nais-standard/mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
            >
              <div className="font-mono text-sm text-slate-900 dark:text-white mb-1">@nais-standard/mcp</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Local MCP gateway — lets any MCP host discover, verify, and call NAIS agents by domain.
                <span className="block mt-1 font-mono text-xs text-slate-400 dark:text-slate-500">claude mcp add nais -- npx -y @nais-standard/mcp</span>
              </p>
            </a>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/25">
            <p className="text-sm text-slate-700 dark:text-slate-200">
              <strong>Contribute an SDK:</strong> the JS, Python, and PHP libraries share one
              conformance suite. To add a language (Rust, Go, Java, Ruby, .NET, …), implement the same
              interface against the{' '}
              <a
                href="https://github.com/nais-standard/clients"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-700 dark:text-blue-300 underline hover:no-underline"
              >
                conformance vectors
              </a>{' '}
              and open a PR.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
