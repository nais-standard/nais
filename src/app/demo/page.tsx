import type { Metadata } from 'next';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Demo Agent | NAIS',
  description: 'weatheragent.nais.id is a live demonstration of a fully NAIS-compliant agent. Explore its DNS records, agent.json manifest, MCP endpoint, and verify it yourself using the public resolver.',
};

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'dns-record', label: 'DNS Record' },
  { id: 'manifest', label: 'agent.json Manifest' },
  { id: 'resolving', label: 'Resolving the Agent' },
  { id: 'mcp-endpoint', label: 'MCP Endpoint' },
  { id: 'what-this-proves', label: 'What This Proves' },
];

const DNS_RECORD = `_agent.weatheragent.nais.id  3600  IN  TXT  "v=nais1; manifest=https://weatheragent.nais.id/.well-known/agent.json; mcp=https://weatheragent.nais.id/mcp; auth=wallet; pay=x402"`;

const AGENT_JSON = `{
  "standard": "nais",
  "nais": "1.0",
  "id": "weatheragent.nais.id",
  "domain": "weatheragent.nais.id",
  "name": "WeatherAgent",
  "description": "A demonstration NAIS-compliant weather agent that provides forecast, current conditions, historical data, and severe weather alerts for any location worldwide.",
  "owner": {
    "name": "NAIS Demo Projects",
    "url": "https://nais.id",
    "wallet": "0x742d35Cc6634C0532925a3b8D4C9B7F1A2e3d4E5"
  },
  "service": {
    "mcp_endpoint": "https://weatheragent.nais.id/mcp",
    "api_endpoint": "https://weatheragent.nais.id/api/v1"
  },
  "auth": {
    "methods": ["wallet", "none"],
    "wallet_chains": ["ethereum", "base", "polygon"],
    "challenge_endpoint": "https://weatheragent.nais.id/auth/challenge"
  },
  "capabilities": [
    {
      "name": "forecast",
      "description": "Multi-day weather forecast for any location worldwide (up to 10 days).",
      "input_schema": { "type": "object", "properties": { "location": { "type": "string" }, "days": { "type": "integer", "default": 5 }, "units": { "type": "string", "enum": ["metric", "imperial"] } }, "required": ["location"] }
    },
    {
      "name": "current",
      "description": "Real-time current weather conditions including temperature, humidity, wind, and UV index.",
      "input_schema": { "type": "object", "properties": { "location": { "type": "string" }, "units": { "type": "string", "enum": ["metric", "imperial"] } }, "required": ["location"] }
    },
    {
      "name": "historical",
      "description": "Historical weather data for any date range. Auth required for ranges over 7 days.",
      "input_schema": { "type": "object", "properties": { "location": { "type": "string" }, "date_from": { "type": "string", "format": "date" }, "date_to": { "type": "string", "format": "date" } }, "required": ["location", "date_from", "date_to"] }
    },
    {
      "name": "alerts",
      "description": "Active severe weather alerts for a region. Returns empty array if none active.",
      "input_schema": { "type": "object", "properties": { "location": { "type": "string" }, "severity": { "type": "string", "enum": ["all", "extreme", "severe", "moderate", "minor"] } }, "required": ["location"] }
    }
  ],
  "payment": {
    "methods": ["x402", "free"],
    "x402": {
      "endpoint": "https://weatheragent.nais.id/pay",
      "currencies": ["USDC", "ETH"],
      "price_per_call": { "forecast": "0.001", "current": "0.0005", "historical": "0.005", "alerts": "0.0005" },
      "free_quota": 100,
      "chain": "base",
      "chain_id": 8453
    }
  },
  "tags": ["weather", "forecast", "climate", "alerts", "demo", "nais"],
  "license": "MIT",
  "version": "1.0.0",
  "updated_at": "2025-03-17T00:00:00Z"
}`;

const CURL_EXAMPLE = `# Resolve weatheragent.nais.id using the public NAIS resolver
curl -s "https://resolver.nais.id/resolve.php?domain=weatheragent.nais.id" | jq .`;

const PYTHON_EXAMPLE = `from nais import resolve, validate

# Full resolver output
result = resolve("weatheragent.nais.id")
print(result["resolved"]["mcp_endpoint"])
# https://weatheragent.nais.id/mcp

# Simplified validation summary
summary = validate("weatheragent.nais.id")
print(summary)
# {
#   "valid": True,
#   "domain": "weatheragent.nais.id",
#   "version": "nais1",
#   "has_manifest": True,
#   "manifest_url": "https://weatheragent.nais.id/.well-known/agent.json",
#   "mcp_endpoint": "https://weatheragent.nais.id/mcp",
#   "has_mcp": True,
#   "auth": ["wallet"],
#   "payments": ["x402"],
#   "capabilities": ["forecast", "current", "historical", "alerts"],
#   "warnings": [],
#   "errors": [],
#   "cached": False
# }`;

const MCP_REQUEST = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "forecast",
    "arguments": {
      "location": "London, UK",
      "days": 5,
      "units": "metric"
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
        "text": "{\"location\":{\"display_name\":\"London, UK\",\"city\":\"London\",\"country\":\"UK\"},\"units\":\"metric\",\"forecast_days\":5,\"forecast\":[{\"date\":\"2025-03-17\",\"condition\":\"Partly Cloudy\",\"temp_high\":14.2,\"temp_low\":6.8,\"temp_unit\":\"°C\",\"precip_prob\":25,\"wind_speed\":18,\"wind_unit\":\"km/h\",\"humidity\":68,\"uv_index\":3},{\"date\":\"2025-03-18\",\"condition\":\"Light Rain\",\"temp_high\":11.5,\"temp_low\":5.2,\"temp_unit\":\"°C\",\"precip_prob\":75,\"wind_speed\":24,\"wind_unit\":\"km/h\",\"humidity\":82,\"uv_index\":1},{\"date\":\"2025-03-19\",\"condition\":\"Cloudy\",\"temp_high\":12.8,\"temp_low\":6.1,\"temp_unit\":\"°C\",\"precip_prob\":40,\"wind_speed\":14,\"wind_unit\":\"km/h\",\"humidity\":75,\"uv_index\":2},{\"date\":\"2025-03-20\",\"condition\":\"Clear\",\"temp_high\":16.3,\"temp_low\":7.9,\"temp_unit\":\"°C\",\"precip_prob\":10,\"wind_speed\":10,\"wind_unit\":\"km/h\",\"humidity\":55,\"uv_index\":5},{\"date\":\"2025-03-21\",\"condition\":\"Partly Cloudy\",\"temp_high\":15.1,\"temp_low\":7.4,\"temp_unit\":\"°C\",\"precip_prob\":20,\"wind_speed\":12,\"wind_unit\":\"km/h\",\"humidity\":60,\"uv_index\":4}],\"source\":\"WeatherAgent Demo (mock data)\"}"
      }
    ],
    "isError": false
  }
}`;

const MCP_INITIALIZE = `# Step 1: Initialize the MCP session
curl -s -X POST https://weatheragent.nais.id/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","clientInfo":{"name":"my-agent","version":"1.0"}}}'

# Step 2: List available tools
curl -s -X POST https://weatheragent.nais.id/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'`;

export default function DemoPage() {
  return (
    <DocLayout
      title="Demo Agent"
      description="weatheragent.nais.id is a live, fully functional NAIS-compliant agent you can resolve and query right now."
      navItems={navItems}
      badge="Live Demo"
    >
      {/* Validate CTA */}
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="9" r="7" />
          <polyline points="5.5,9 8,11.5 12.5,6.5" />
        </svg>
        <span className="text-sm text-blue-800">
          Want to verify this domain yourself?{' '}
          <Link href="/validate?domain=weatheragent.nais.id" className="font-semibold underline underline-offset-2 hover:text-blue-600">
            Validate this domain →
          </Link>
        </span>
      </div>

      {/* 1. Overview */}
      <section id="overview">
        <h2>Overview</h2>
        <p>
          <strong>weatheragent.nais.id</strong> is a live demonstration agent built specifically to show that the NAIS
          standard works end-to-end in production. It is not a toy or a mockup — every part of the stack is real:
          the DNS TXT record is published, the <code>agent.json</code> manifest is served over HTTPS, and the MCP
          endpoint accepts and responds to JSON-RPC 2.0 requests.
        </p>
        <p>
          The agent exposes four capabilities: <strong>forecast</strong> (multi-day weather), <strong>current</strong>{' '}
          (real-time conditions), <strong>historical</strong> (past weather data), and <strong>alerts</strong> (active
          severe weather warnings). All capabilities follow standard JSON Schema input contracts, making it easy for
          any AI agent or automation tool to call them without out-of-band documentation.
        </p>
        <p>
          The demo uses the x402 micropayment protocol with a free tier of 100 calls per day, and supports wallet
          authentication on the Ethereum, Base, and Polygon chains — showing exactly how a production NAIS agent
          would handle identity and payment.
        </p>
        <p>
          The purpose of this demo is simple: <em>prove it works</em>. Any developer who has read the NAIS spec can
          independently verify every claim on this page using nothing but <code>dig</code>, <code>curl</code>, and a
          browser — no special tools required.
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
                <td className="py-2">HTTPS URL of the agent.json manifest. Must be served with CORS headers.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4 font-mono text-xs">mcp</td>
                <td className="py-2 pr-4 font-mono text-xs break-all">https://…/mcp</td>
                <td className="py-2">MCP endpoint URL. Accepts JSON-RPC 2.0 POST requests.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4 font-mono text-xs">auth</td>
                <td className="py-2 pr-4 font-mono text-xs">wallet</td>
                <td className="py-2">Authentication method(s) supported. <code>wallet</code> = EVM wallet signing.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">pay</td>
                <td className="py-2 pr-4 font-mono text-xs">x402</td>
                <td className="py-2">Payment protocol. <code>x402</code> = HTTP 402 micropayment standard.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          You can verify this record exists right now by running <code>dig TXT _agent.weatheragent.nais.id</code> from
          any terminal. The 3600-second TTL means resolvers cache it for one hour before re-querying.
        </p>
      </section>

      {/* 3. agent.json Manifest */}
      <section id="manifest">
        <h2>agent.json Manifest</h2>
        <p>
          The manifest is a JSON document served at the HTTPS URL declared in the DNS record. It provides structured
          metadata about the agent that resolvers, AI frameworks, and developer tools can consume without any
          per-agent documentation. The full manifest for weatheragent.nais.id:
        </p>
        <CodeBlock code={AGENT_JSON} language="json" />
        <p>Key sections:</p>
        <ul>
          <li>
            <strong>Identity (<code>id</code>, <code>domain</code>, <code>name</code>)</strong> — Uniquely identifies
            this agent. The <code>id</code> must match the domain where the manifest is hosted.
          </li>
          <li>
            <strong>Service (<code>mcp_endpoint</code>, <code>api_endpoint</code>)</strong> — The live URLs where the
            agent&apos;s services are reachable. MCP endpoints receive JSON-RPC 2.0 requests.
          </li>
          <li>
            <strong>Auth (<code>methods</code>, <code>wallet_chains</code>)</strong> — Declares that the agent accepts
            wallet-based authentication (EVM SIWE) on Ethereum, Base, and Polygon. <code>none</code> indicates a
            public free tier also exists.
          </li>
          <li>
            <strong>Capabilities (array)</strong> — Each capability has a machine-readable <code>input_schema</code>{' '}
            (JSON Schema) that agents and LLMs can use to validate parameters before calling. No out-of-band
            documentation needed.
          </li>
          <li>
            <strong>Payment (<code>x402</code>)</strong> — Declares a free quota, per-call pricing in USDC/ETH, the
            payment endpoint, and the chain (Base, chain ID 8453).
          </li>
        </ul>
      </section>

      {/* 4. Resolving */}
      <section id="resolving">
        <h2>Resolving the Agent</h2>
        <p>
          The public NAIS resolver at <code>resolver.nais.id</code> performs the full resolution pipeline in a single
          HTTP request: DNS lookup → manifest fetch → validation. Use it directly with curl:
        </p>
        <CodeBlock code={CURL_EXAMPLE} language="bash" />
        <p>
          The resolver returns the full structured output including raw DNS records, parsed fields, manifest data, and
          validation messages. You can also use the official Python SDK for cleaner access:
        </p>
        <CodeBlock code={PYTHON_EXAMPLE} language="python" />
        <p>
          The <code>validate()</code> function returns a simplified summary with a boolean <code>valid</code> flag and
          a list of any discovered capabilities, making it easy to gate agent usage on successful NAIS validation.
        </p>
      </section>

      {/* 5. MCP Endpoint */}
      <section id="mcp-endpoint">
        <h2>MCP Endpoint</h2>
        <p>
          The MCP endpoint at <code>https://weatheragent.nais.id/mcp</code> is a live JSON-RPC 2.0 server. All
          requests are HTTP POST with <code>Content-Type: application/json</code>. Start by initializing the session,
          then list available tools:
        </p>
        <CodeBlock code={MCP_INITIALIZE} language="bash" />
        <p>
          Once you know the available tools, call the <code>forecast</code> capability with a location and number of
          days. The request follows the standard MCP <code>tools/call</code> format:
        </p>
        <CodeBlock code={MCP_REQUEST} language="json" filename="MCP tools/call request" />
        <p>The server responds with a JSON-RPC 2.0 result envelope wrapping the tool output:</p>
        <CodeBlock code={MCP_RESPONSE} language="json" filename="MCP tools/call response" />
        <p>
          The <code>content</code> array follows the MCP content block spec — each block has a <code>type</code>{' '}
          (<code>&quot;text&quot;</code>, <code>&quot;image&quot;</code>, etc.) and the corresponding data. For this
          agent all responses use <code>type: &quot;text&quot;</code> with a JSON-encoded payload as the text value.
          The <code>isError: false</code> field signals a successful tool execution.
        </p>
        <p>
          All three other capabilities (<code>current</code>, <code>historical</code>, <code>alerts</code>) follow
          exactly the same pattern — only the method arguments differ. The input schemas in the manifest tell you
          exactly what parameters each capability expects.
        </p>
      </section>

      {/* 6. What This Proves */}
      <section id="what-this-proves">
        <h2>What This Proves</h2>
        <p>
          weatheragent.nais.id is proof that the complete NAIS stack works today, end-to-end, with no special software
          required:
        </p>
        <ol>
          <li>
            <strong>DNS as the root of trust.</strong> The <code>_agent.</code> TXT record is the only thing that
            needs to exist for discovery to start. Any resolver — including your own — can look it up with a standard
            DNS query. No central registry, no API key, no permission required.
          </li>
          <li>
            <strong>HTTPS for integrity.</strong> The manifest URL uses HTTPS, so the TLS certificate of
            weatheragent.nais.id authenticates the response. If the manifest has been tampered with, the certificate
            mismatch will surface immediately.
          </li>
          <li>
            <strong>Machine-readable capabilities.</strong> Every capability has a JSON Schema. AI agents, LLMs, and
            automation tools can introspect what the agent does and how to call it without reading any human-written
            docs — the manifest <em>is</em> the documentation.
          </li>
          <li>
            <strong>Open payment and auth protocols.</strong> x402 and wallet auth are open standards with no
            platform lock-in. Any agent or client that understands these protocols can interact with any NAIS agent
            that declares them — including weatheragent.nais.id.
          </li>
          <li>
            <strong>Independently verifiable right now.</strong> You don&apos;t have to trust this page. Run{' '}
            <code>dig TXT _agent.weatheragent.nais.id</code>, fetch the manifest URL in your browser, POST a request
            to the MCP endpoint, or use the validator below. Every claim is checkable with standard tools in under
            60 seconds.
          </li>
        </ol>

        {/* Validate CTA (bottom) */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 not-prose">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="9" r="7" />
            <polyline points="5.5,9 8,11.5 12.5,6.5" />
          </svg>
          <span className="text-sm text-blue-800">
            Ready to verify?{' '}
            <Link href="/validate?domain=weatheragent.nais.id" className="font-semibold underline underline-offset-2 hover:text-blue-600">
              Validate this domain →
            </Link>
          </span>
        </div>
      </section>
    </DocLayout>
  );
}
