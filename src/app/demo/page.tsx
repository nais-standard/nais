import type { Metadata } from 'next';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Demo Agent | NAIS',
  description: 'weatheragent.link is a live demonstration of a fully NAIS-compliant agent. Explore its DNS records, agent.json manifest, MCP endpoint, and verify it yourself using the public resolver.',
};

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'dns-record', label: 'DNS Record' },
  { id: 'manifest', label: 'agent.json Manifest' },
  { id: 'resolving', label: 'Resolving the Agent' },
  { id: 'mcp-endpoint', label: 'MCP Endpoint' },
  { id: 'what-this-proves', label: 'What This Proves' },
];

const FACTS = [
  { label: 'Domain', value: 'weatheragent.link', mono: true },
  { label: 'MCP endpoint', value: 'https://weatheragent.link/mcp', mono: true },
  { label: 'Tools', value: '5 live MCP tools' },
  { label: 'Access', value: 'Public — no auth, no payment' },
  { label: 'Signature', value: 'EdDSA (Ed25519), DNS-anchored' },
  { label: 'Weather data', value: 'Open-Meteo' },
];

const DNS_RECORD = `_agent.weatheragent.link  IN  TXT  "v=nais1; manifest=https://weatheragent.link/.well-known/agent.json; k=ed25519:i2tQ24-PhIHYhiB3gxHTjAXqL2-J-14FesniTYR4Uyw"`;

const AGENT_JSON = `{
  "nais": "1.0",
  "cardVersion": 1,
  "updated": "2026-06-18T00:00:00Z",
  "name": "WeatherAgent",
  "domain": "weatheragent.link",
  "description": "Production MCP weather server providing real-time current conditions, hourly and daily forecasts, geocoding, and multi-location comparison. Powered by Open-Meteo.",
  "tags": ["weather", "forecast", "geocoding", "mcp", "open-meteo"],
  "contact": "https://github.com/nais-standard/weatheragent-link/issues",
  "mcp": "https://weatheragent.link/mcp",
  "auth": [{ "scheme": "none" }],
  "mcpSnapshot": {
    "capturedAt": "2026-06-18T00:00:00Z",
    "toolsHash": "sha256:447ad8f8540a189fd82bd8c284e03a897bc182e3baaa69b72f147e8db011dd39",
    "tools": [
      { "name": "compare_weather", "description": "Compare current or daily forecast across multiple locations." },
      { "name": "geocode_location", "description": "Search a place by name; returns coordinates, country, timezone, population." },
      { "name": "get_current_weather", "description": "Current conditions for a location." },
      { "name": "get_daily_forecast", "description": "Daily forecast (up to 16 days) for a location." },
      { "name": "get_hourly_forecast", "description": "Hourly forecast (up to 168 hours) for a location." }
    ]
  },
  "signature": {
    "alg": "EdDSA",
    "kid": "ed25519:i2tQ24-PhIHYhiB3gxHTjAXqL2-J-14FesniTYR4Uyw",
    "jws": "eyJhbGciOiJFZERTQSIsImtpZCI6ImVkMjU1MTk6aTJ0UTI0LVBoSUhZaGlCM2d4SFRqQVhxTDItSi0xNEZlc25pVFlSNFV5dyJ9..RX7dJFN-KN9CAa_pcbxWLhAp7MLYsQglOI0FUOY0Aqt0HGkjLaTNcnmil7N6MNcAVYmD5c32ujRL6-O4V7kDBw"
  }
}`;

const RESOLVE_EXAMPLE = `import { validate } from "@nais-standard/sdk";

// Direct resolution, entirely client-side: DNS TXT lookup, card fetch,
// and EdDSA signature verification. No central resolver in the path.
const agent = await validate("weatheragent.link");

console.log(agent.valid);             // true
console.log(agent.signatureVerified); // true — verified against the DNS key
console.log(agent.mcpEndpoint);       // https://weatheragent.link/mcp
console.log(agent.tags);              // ["weather", "forecast", "geocoding", "mcp", "open-meteo"]`;

const MCP_REQUEST = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_current_weather",
    "arguments": {
      "location": "London",
      "temperature_unit": "celsius"
    }
  }
}`;

const MCP_RESPONSE = `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\\"location\\":{\\"name\\":\\"London\\",\\"country\\":\\"United Kingdom\\",\\"timezone\\":\\"Europe/London\\"},\\"current\\":{\\"time\\":\\"2026-06-22T21:15\\",\\"weather_description\\":\\"Overcast\\",\\"temperature\\":{\\"value\\":23.1,\\"unit\\":\\"°C\\"},\\"relative_humidity\\":{\\"value\\":59,\\"unit\\":\\"%\\"}}}"
      }
    ],
    "isError": false
  }
}`;

const MCP_INITIALIZE = `# Step 1: Initialize the MCP session
curl -s -X POST https://weatheragent.link/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","clientInfo":{"name":"my-agent","version":"1.0"}}}'

# Step 2: List available tools
curl -s -X POST https://weatheragent.link/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'`;

export default function DemoPage() {
  return (
    <DocLayout
      title="Demo Agent"
      description="weatheragent.link is a live, fully functional NAIS-compliant agent you can resolve and query right now."
      navItems={navItems}
      badge="Live Demo"
    >
      {/* Validate CTA */}
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-blue-200 dark:border-blue-500/25 bg-blue-50 dark:bg-blue-500/10 px-5 py-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="9" r="7" />
          <polyline points="5.5,9 8,11.5 12.5,6.5" />
        </svg>
        <span className="text-sm text-slate-700 dark:text-slate-200">
          Want to verify this domain yourself?{' '}
          <Link href="/validate?domain=weatheragent.link" className="font-semibold text-blue-700 dark:text-white underline underline-offset-2 hover:text-blue-900 dark:hover:text-blue-100">
            Validate this domain →
          </Link>
        </span>
      </div>

      {/* 1. Overview */}
      <section id="overview">
        <h2>Overview</h2>
        <p>
          <strong>weatheragent.link</strong> is a live, fully NAIS-compliant agent: real DNS records, a signed{' '}
          <code>agent.json</code> served over HTTPS, and an MCP endpoint answering JSON-RPC 2.0 requests against
          live weather data from Open-Meteo.
        </p>

        <div className="not-prose my-6 grid grid-cols-1 gap-x-8 gap-y-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] px-6 py-5 sm:grid-cols-2">
          {FACTS.map((f) => (
            <div key={f.label} className="flex flex-col gap-0.5">
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{f.label}</span>
              <span className={`text-sm text-slate-800 dark:text-slate-200 ${f.mono ? 'font-mono break-all' : ''}`}>{f.value}</span>
            </div>
          ))}
        </div>

        <p>
          The card lists five MCP tools in an advisory <code>mcpSnapshot</code>, but the live <code>tools/list</code>{' '}
          is always authoritative — so any AI agent can discover and call them without out-of-band documentation.
          Every field is covered by a mandatory EdDSA signature whose key is published in DNS, so a web-server
          compromise alone cannot forge the card.
        </p>
        <p>
          You don&apos;t have to take any of this on faith: verify every claim on this page with nothing but{' '}
          <code>dig</code>, <code>curl</code>, and a browser.
        </p>
      </section>

      {/* 2. DNS Record */}
      <section id="dns-record">
        <h2>DNS Record</h2>
        <p>
          NAIS discovery starts with a single DNS TXT record published at <code>_agent.&lt;domain&gt;</code>. For
          this demo agent the record is:
        </p>
        <CodeBlock code={DNS_RECORD} language="dns" />
        <p>Field breakdown:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-4 font-semibold text-slate-700 w-28">Field</th>
                <th className="text-left py-2 pr-4 font-semibold text-slate-700 w-48">Value</th>
                <th className="text-left py-2 font-semibold text-slate-700">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4 font-mono text-xs">v</td>
                <td className="py-2 pr-4 font-mono text-xs">nais1</td>
                <td className="py-2">NAIS version identifier. Always <code>nais1</code> for v1.x records.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4 font-mono text-xs">manifest</td>
                <td className="py-2 pr-4 font-mono text-xs break-all">https://…/agent.json</td>
                <td className="py-2">HTTPS URL of the signed agent.json card, served over HTTPS.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">k</td>
                <td className="py-2 pr-4 font-mono text-xs break-all">ed25519:i2tQ24…</td>
                <td className="py-2">Signing-key fingerprint. <code>ed25519:&lt;b64url pubkey&gt;</code> — must equal the card&apos;s <code>signature.kid</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          You can verify this record exists right now by running <code>dig TXT _agent.weatheragent.link</code> from
          any terminal. Resolvers cache the record according to its TTL before re-querying.
        </p>
      </section>

      {/* 3. agent.json Manifest */}
      <section id="manifest">
        <h2>agent.json Manifest</h2>
        <p>
          The manifest is a signed JSON card served at the HTTPS URL declared in the DNS record. It provides structured
          metadata about the agent that resolvers, AI frameworks, and developer tools can consume without any
          per-agent documentation. The card for weatheragent.link (with the <code>mcpSnapshot</code> tool list abbreviated
          for readability — the live manifest carries each tool&apos;s full input schema):
        </p>
        <CodeBlock code={AGENT_JSON} language="json" />
        <p>Key sections:</p>
        <ul>
          <li>
            <strong>Identity (<code>domain</code>, <code>name</code>, <code>cardVersion</code>, <code>updated</code>)</strong>{' '}
            — Uniquely identifies this agent. The <code>domain</code> must match the domain where the card is hosted.
          </li>
          <li>
            <strong>Endpoint &amp; auth (<code>mcp</code>, <code>auth</code>)</strong> — The live MCP URL (JSON-RPC 2.0)
            and an array of accepted auth schemes. Here <code>{'{ "scheme": "none" }'}</code> indicates a public,
            unauthenticated agent.
          </li>
          <li>
            <strong>Tags (array)</strong> — Free-form discovery tags that resolvers and indexers use to categorize the
            agent. (Tags replace the old <code>capabilities</code> field.)
          </li>
          <li>
            <strong>mcpSnapshot</strong> — An advisory cache of the live <code>tools/list</code> with a{' '}
            <code>toolsHash</code>. It speeds up discovery, but the live MCP <code>tools/list</code> is authoritative.
          </li>
          <li>
            <strong>Signature (mandatory)</strong> — A detached EdDSA (Ed25519) JWS over the card&apos;s canonical body.
            Its <code>kid</code> matches the DNS <code>k=</code> fingerprint, so forging a card requires both the DNS
            zone and the private signing key.
          </li>
        </ul>
      </section>

      {/* 4. Resolving */}
      <section id="resolving">
        <h2>Resolving the Agent</h2>
        <p>
          Agents resolve NAIS identities directly — there is no central service in the path. The official{' '}
          <code>@nais-standard/sdk</code> runs the full pipeline client-side: DNS TXT lookup → manifest fetch →
          EdDSA signature verification.
        </p>
        <CodeBlock code={RESOLVE_EXAMPLE} language="typescript" filename="resolve.ts" />
        <p>
          <code>validate()</code> returns a flat, verification-aware summary — a boolean <code>valid</code> flag, the{' '}
          <code>signatureVerified</code> status, the <code>mcpEndpoint</code>, and discovery <code>tags</code> — making
          it easy to gate agent usage on successful NAIS validation. The Python and PHP SDKs expose the same API.
        </p>
      </section>

      {/* 5. MCP Endpoint */}
      <section id="mcp-endpoint">
        <h2>MCP Endpoint</h2>
        <p>
          The MCP endpoint at <code>https://weatheragent.link/mcp</code> is a live JSON-RPC 2.0 server. All
          requests are HTTP POST with <code>Content-Type: application/json</code>. Start by initializing the session,
          then list available tools:
        </p>
        <CodeBlock code={MCP_INITIALIZE} language="bash" />
        <p>
          Once you know the available tools, call <code>get_current_weather</code> with a location. The request follows
          the standard MCP <code>tools/call</code> format:
        </p>
        <CodeBlock code={MCP_REQUEST} language="json" filename="MCP tools/call request" />
        <p>The server responds with a JSON-RPC 2.0 result envelope wrapping the tool output (abbreviated below):</p>
        <CodeBlock code={MCP_RESPONSE} language="json" filename="MCP tools/call response" />
        <p>
          The <code>content</code> array follows the MCP content block spec — each block has a <code>type</code>{' '}
          (<code>&quot;text&quot;</code>, <code>&quot;image&quot;</code>, etc.) and the corresponding data. For this
          agent all responses use <code>type: &quot;text&quot;</code> with a JSON-encoded payload as the text value.
          The <code>isError: false</code> field signals a successful tool execution.
        </p>
        <p>
          The other tools (<code>get_hourly_forecast</code>, <code>get_daily_forecast</code>, <code>geocode_location</code>,{' '}
          <code>compare_weather</code>) follow exactly the same pattern — only the method arguments differ. The card&apos;s{' '}
          <code>mcpSnapshot</code> lists each tool, but the live <code>tools/list</code> response is authoritative for what
          the agent exposes.
        </p>
      </section>

      {/* 6. What This Proves */}
      <section id="what-this-proves">
        <h2>What This Proves</h2>
        <p>
          weatheragent.link is proof that the complete NAIS stack works today, end-to-end, with no special software
          required:
        </p>
        <ol>
          <li>
            <strong>DNS as the root of trust.</strong> The <code>_agent.</code> TXT record is the only thing that
            needs to exist for discovery to start. Any resolver — including your own — can look it up with a standard
            DNS query. No central registry, no API key, no permission required.
          </li>
          <li>
            <strong>Cryptographic integrity.</strong> The card carries a mandatory detached EdDSA (Ed25519) JWS over
            its canonical body. The signing key&apos;s fingerprint is published in the DNS <code>k=</code> field, so the
            card&apos;s <code>kid</code> must match DNS. A web-server compromise alone cannot forge a card — an attacker
            would need both the DNS zone and the private signing key.
          </li>
          <li>
            <strong>Machine-readable tools.</strong> The <code>mcpSnapshot</code> advertises the live tools advisory,
            and the authoritative MCP <code>tools/list</code> lets AI agents, LLMs, and automation tools introspect
            what the agent does and how to call it without reading any human-written docs.
          </li>
          <li>
            <strong>Independently verifiable right now.</strong> You don&apos;t have to trust this page. Run{' '}
            <code>dig TXT _agent.weatheragent.link</code>, fetch the manifest URL in your browser, POST a request
            to the MCP endpoint, or use the validator below. Every claim is checkable with standard tools in under
            60 seconds.
          </li>
        </ol>

        {/* Validate CTA (bottom) */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-blue-200 dark:border-blue-500/25 bg-blue-50 dark:bg-blue-500/10 px-5 py-4 not-prose">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="9" r="7" />
            <polyline points="5.5,9 8,11.5 12.5,6.5" />
          </svg>
          <span className="text-sm text-slate-700 dark:text-slate-200">
            Ready to verify?{' '}
            <Link href="/validate?domain=weatheragent.link" className="font-semibold text-blue-700 dark:text-white underline underline-offset-2 hover:text-blue-900 dark:hover:text-blue-100">
              Validate this domain →
            </Link>
          </span>
        </div>
      </section>
    </DocLayout>
  );
}
