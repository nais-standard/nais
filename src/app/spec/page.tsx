import type { Metadata } from 'next';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata: Metadata = {
  title: 'Specification',
  description:
    'The complete NAIS specification — DNS records, manifest schema, auth flows, and payment protocol.',
};

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'terminology', label: 'Terminology' },
  { id: 'discovery', label: 'Discovery Model' },
  { id: 'dns', label: 'DNS Records' },
  { id: 'dns-required', label: 'Required records', indent: true },
  { id: 'dns-optional', label: 'Optional fields', indent: true },
  { id: 'manifest', label: 'agent.json Manifest' },
  { id: 'manifest-fields', label: 'Field reference', indent: true },
  { id: 'multi-agent', label: 'Multi-Agent Discovery' },
  { id: 'multi-agent-schema', label: 'nais-agents.json', indent: true },
  { id: 'multi-agent-linked', label: 'Linked agents', indent: true },
  { id: 'mcp', label: 'MCP Endpoint' },
  { id: 'auth', label: 'Wallet Auth Flow' },
  { id: 'payment', label: 'x402 Payment Flow' },
  { id: 'security', label: 'Security Considerations' },
  { id: 'versioning', label: 'Versioning' },
  { id: 'changelog', label: 'Version History' },
];

const DNS_TXT_FULL = `; Minimum required record
_agent.example.com  IN  TXT  "v=nais1; manifest=https://example.com/.well-known/agent.json"

; Full record with optional fields
_agent.example.com  IN  TXT  "v=nais1; manifest=https://example.com/.well-known/agent.json; mcp=https://example.com/mcp; auth=wallet; pay=x402"`;

const MANIFEST_FULL = `{
  "nais": "1.0",
  "name": "Example Agent",
  "description": "A short description of what this agent does",
  "domain": "example.com",
  "version": "1.0.0",
  "updated": "2025-01-15",

  "mcp": "https://example.com/mcp",
  "api": "https://example.com/api/v1",

  "auth": {
    "type": "wallet",
    "chains": ["ethereum", "solana", "base"],
    "endpoint": "https://example.com/auth/challenge"
  },

  "payment": {
    "type": "x402",
    "endpoint": "https://example.com/pay",
    "currencies": ["USDC", "ETH"],
    "pricePerCall": "0.001",
    "freeQuota": 100
  },

  "capabilities": [
    "summarize",
    "translate",
    "search"
  ],

  "tags": ["language", "productivity"],
  "contact": "agent@example.com",
  "license": "MIT",
  "source": "https://github.com/example/agent"
}`;

const AUTH_FLOW = `# Step 1: Request a challenge nonce
GET https://example.com/auth/challenge?domain=caller.com
→ { "nonce": "abc123", "expires": "2025-01-15T12:00:00Z" }

# Step 2: Sign the nonce with your wallet
# message = "nais-auth:abc123:caller.com"
# signature = wallet.sign(message)

# Step 3: Submit signed challenge
POST https://example.com/mcp
Authorization: NAIS-Wallet domain=caller.com; nonce=abc123; sig=<hex-signature>`;

const X402_FLOW = `# Step 1: Call endpoint without payment
POST https://example.com/mcp
→ HTTP 402 Payment Required
   X-Payment-Required: x402
   X-Payment-Endpoint: https://example.com/pay
   X-Payment-Amount: 0.001
   X-Payment-Currency: USDC

# Step 2: Submit payment receipt to payment endpoint
POST https://example.com/pay
{ "tx": "0xabc...", "chain": "base", "amount": "0.001" }
→ { "receipt": "r_xyz789", "expires": "2025-01-15T12:05:00Z" }

# Step 3: Retry request with receipt
POST https://example.com/mcp
X-Payment-Receipt: r_xyz789`;

export default function SpecPage() {
  return (
    <DocLayout
      title="Specification"
      description="The complete NAIS specification — discovery model, DNS record format, manifest schema, authentication flows, and payment protocol."
      navItems={NAV}
      badge="v1.0 Draft"
    >
      {/* Overview */}
      <section id="overview">
        <h2>Overview</h2>
        <p>
          The Network Agent Identity Standard (NAIS) defines a vendor-neutral mechanism for AI agents
          to publish and discover their identity, capabilities, and connection endpoints using existing
          internet infrastructure — specifically DNS TXT records and HTTPS-served JSON manifests.
        </p>
        <p>
          NAIS is intentionally minimal. It does not require a new registry, a blockchain, a central
          authority, or proprietary software. An agent operator needs only a domain name, the ability
          to publish a DNS TXT record, and an HTTPS server capable of serving a static JSON file.
        </p>
        <div className="callout">
          <strong>Design goals:</strong> human-readable identity, zero new infrastructure, composable
          with existing standards (DNS, HTTPS, MCP, HTTP 402), and permissive enough for both public
          and private deployments.
        </div>
      </section>

      {/* Terminology */}
      <section id="terminology">
        <h2>Terminology</h2>
        <p>
          The key words <strong>MUST</strong>, <strong>MUST NOT</strong>, <strong>REQUIRED</strong>,{' '}
          <strong>SHOULD</strong>, <strong>SHOULD NOT</strong>, <strong>RECOMMENDED</strong>, and{' '}
          <strong>MAY</strong> in this document are to be interpreted as described in{' '}
          <a href="https://www.rfc-editor.org/rfc/rfc2119" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">RFC 2119</a>.
        </p>
        <table>
          <thead>
            <tr>
              <th>Term</th>
              <th>Definition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Agent</code></td>
              <td>An autonomous program or service acting on behalf of a user or system.</td>
            </tr>
            <tr>
              <td><code>Agent Domain</code></td>
              <td>The fully-qualified domain name used as the agent&apos;s canonical identifier (e.g. <code>weatheragent.link</code>).</td>
            </tr>
            <tr>
              <td><code>NAIS Record</code></td>
              <td>The DNS TXT record published at <code>_agent.{'{domain}'}</code> that anchors the agent identity.</td>
            </tr>
            <tr>
              <td><code>Manifest</code></td>
              <td>The JSON file served at <code>{'https://{domain}/.well-known/agent.json'}</code> describing the agent.</td>
            </tr>
            <tr>
              <td><code>Resolver</code></td>
              <td>A client library or agent that implements the NAIS resolution process.</td>
            </tr>
            <tr>
              <td><code>MCP Endpoint</code></td>
              <td>A server implementing the Model Context Protocol, referenced by the manifest.</td>
            </tr>
            <tr>
              <td><code>Wallet Auth</code></td>
              <td>Challenge–response authentication using a cryptographic wallet to prove domain ownership.</td>
            </tr>
            <tr>
              <td><code>x402</code></td>
              <td>HTTP 402-based machine payment protocol for per-call metering between agents.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Discovery Model */}
      <section id="discovery">
        <h2>Discovery Model</h2>
        <p>
          NAIS resolution follows a deterministic two-step process. A resolver receives a domain name
          and performs the following:
        </p>
        <ol>
          <li>
            <strong>DNS Lookup:</strong> Query for a TXT record at <code>_agent.{'{domain}'}</code>.
            The presence of a record beginning with <code>v=nais1</code> signals NAIS compliance. The
            record contains the manifest URL and optional inline metadata.
          </li>
          <li>
            <strong>Manifest Fetch:</strong> Retrieve the <code>agent.json</code> manifest from the
            URL specified in the <code>manifest</code> field of the TXT record (typically{' '}
            <code>{'https://{domain}/.well-known/agent.json'}</code>). The manifest MUST be served over
            HTTPS. The resolver validates the manifest against the NAIS schema.
          </li>
        </ol>
        <p>
          Resolution succeeds if both steps complete without error and the manifest passes schema
          validation. Resolvers SHOULD cache DNS responses according to the record&apos;s TTL and SHOULD
          cache manifests with a maximum TTL of 3600 seconds unless the HTTP response specifies otherwise.
        </p>
        <div className="callout callout-note">
          The <code>manifest</code> URL in the DNS record MUST match the domain in the agent&apos;s{' '}
          <code>domain</code> field. Resolvers MUST reject manifests served from a different domain.
        </div>
      </section>

      {/* DNS Records */}
      <section id="dns">
        <h2>DNS Records</h2>
        <h3 id="dns-required">Required Records</h3>
        <p>
          The sole required DNS change is a TXT record at the subdomain <code>_agent</code> under the
          agent&apos;s domain. The record value is a semicolon-delimited set of key=value pairs, ordered
          by importance.
        </p>
        <CodeBlock code={DNS_TXT_FULL} language="dns" filename="DNS zone" />
        <p>
          The <code>v</code> field MUST appear first and MUST equal <code>nais1</code>. The{' '}
          <code>manifest</code> field MUST be present and MUST contain a valid HTTPS URL.
        </p>
        <h3 id="dns-optional">TXT Record Field Reference</h3>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>v</code></td>
              <td>Yes</td>
              <td>Protocol version. MUST be <code>nais1</code>.</td>
            </tr>
            <tr>
              <td><code>manifest</code></td>
              <td>Yes</td>
              <td>HTTPS URL to the <code>agent.json</code> manifest.</td>
            </tr>
            <tr>
              <td><code>mcp</code></td>
              <td>No</td>
              <td>Shortcut URL to the MCP endpoint. Mirrors the manifest <code>mcp</code> field.</td>
            </tr>
            <tr>
              <td><code>auth</code></td>
              <td>No</td>
              <td>Authentication type: <code>wallet</code>, <code>bearer</code>, or <code>none</code>. Defaults to <code>none</code>.</td>
            </tr>
            <tr>
              <td><code>pay</code></td>
              <td>No</td>
              <td>Payment protocol. Only <code>x402</code> is defined in this version.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Manifest */}
      <section id="manifest">
        <h2>agent.json Manifest</h2>
        <p>
          The manifest is a JSON document served at{' '}
          <code>{'https://{domain}/.well-known/agent.json'}</code>. It MUST be served with
          Content-Type <code>application/json</code> and MUST be accessible over HTTPS without
          authentication. The manifest provides the canonical, machine-readable description of an agent.
        </p>
        <CodeBlock code={MANIFEST_FULL} language="json" filename="/.well-known/agent.json" showLineNumbers />
        <h3 id="manifest-fields">Field Reference</h3>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>nais</code></td><td>string</td><td>Yes</td><td>NAIS spec version. MUST be <code>&quot;1.0&quot;</code>.</td></tr>
            <tr><td><code>name</code></td><td>string</td><td>Yes</td><td>Human-readable display name.</td></tr>
            <tr><td><code>domain</code></td><td>string</td><td>Yes</td><td>Canonical domain. MUST match the DNS record domain.</td></tr>
            <tr><td><code>description</code></td><td>string</td><td>No</td><td>Short description (max 280 characters recommended).</td></tr>
            <tr><td><code>version</code></td><td>string</td><td>No</td><td>Semantic version of the agent implementation.</td></tr>
            <tr><td><code>updated</code></td><td>string</td><td>No</td><td>ISO 8601 date of last manifest update.</td></tr>
            <tr><td><code>mcp</code></td><td>string (URL)</td><td>No</td><td>URL to the MCP endpoint.</td></tr>
            <tr><td><code>api</code></td><td>string (URL)</td><td>No</td><td>URL to a REST API endpoint.</td></tr>
            <tr><td><code>auth</code></td><td>object</td><td>No</td><td>Authentication configuration. See Auth section.</td></tr>
            <tr><td><code>payment</code></td><td>object</td><td>No</td><td>Payment configuration. See Payment section.</td></tr>
            <tr><td><code>capabilities</code></td><td>string[]</td><td>No</td><td>List of capability identifiers the agent supports.</td></tr>
            <tr><td><code>tags</code></td><td>string[]</td><td>No</td><td>Searchable topic tags.</td></tr>
            <tr><td><code>contact</code></td><td>string</td><td>No</td><td>Contact email or URL for the agent operator.</td></tr>
            <tr><td><code>license</code></td><td>string</td><td>No</td><td>SPDX license identifier (e.g. <code>MIT</code>).</td></tr>
            <tr><td><code>source</code></td><td>string (URL)</td><td>No</td><td>URL to the agent source code.</td></tr>
          </tbody>
        </table>
      </section>

      {/* Multi-Agent Discovery */}
      <section id="multi-agent">
        <h2>Multi-Agent Discovery (NAIS 1.1)</h2>
        <p>
          Starting with NAIS 1.1, a domain MAY publish a discovery document at{' '}
          <code>/.well-known/nais-agents.json</code> to declare multiple agents and reference
          external partner agents. This is the <strong>domain-level discovery layer</strong> —
          it sits above individual agent manifests and provides an index of all agents associated
          with a domain.
        </p>
        <p>
          This document is <strong>optional</strong>. Domains with a single agent can continue
          using only <code>/.well-known/agent.json</code>. The resolver checks for both files
          independently.
        </p>

        <h3 id="multi-agent-schema">nais-agents.json Schema</h3>
        <p>
          The discovery document declares local agents and linked external agents:
        </p>
        <pre><code>{`{
  "nais_version": "1.1",
  "domain": "example.com",
  "default_agent": "support.example.com",
  "agents": [
    {
      "id": "support.example.com",
      "scope": "local",
      "name": "Support Agent",
      "description": "Handles customer support and FAQs.",
      "manifest_url": "https://example.com/.well-known/agents/support/agent.json",
      "mcp_endpoint": "https://example.com/mcp/support",
      "tags": ["support"],
      "status": "active"
    },
    {
      "id": "sales.example.com",
      "scope": "local",
      "name": "Sales Agent",
      "description": "Helps visitors choose products and pricing.",
      "manifest_url": "https://example.com/.well-known/agents/sales/agent.json",
      "status": "active"
    }
  ],
  "linked_agents": [
    {
      "id": "weatheragent.nais.id",
      "scope": "external",
      "name": "Weather Agent",
      "relationship": "partner",
      "verified": true
    }
  ]
}`}</code></pre>
        <p>Required fields:</p>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>nais_version</code></td><td>string</td><td>Protocol version (e.g., &quot;1.1&quot;)</td></tr>
            <tr><td><code>domain</code></td><td>string</td><td>Canonical domain publishing this document</td></tr>
            <tr><td><code>agents</code></td><td>array</td><td>At least one local agent entry</td></tr>
          </tbody>
        </table>
        <p>Each agent entry requires <code>id</code>, <code>name</code>, and <code>manifest_url</code>.</p>
        <p>
          The <code>default_agent</code> field specifies which agent ID to use when no specific
          agent is requested. This enables graceful routing — a domain can expose a &quot;front desk&quot;
          agent while maintaining specialized agents for specific tasks.
        </p>

        <h3 id="multi-agent-linked">Linked External Agents</h3>
        <p>
          The <code>linked_agents</code> array allows a domain to explicitly reference agents hosted
          on other domains. Each entry includes a <code>relationship</code> field indicating the nature
          of the link:
        </p>
        <table>
          <thead>
            <tr><th>Relationship</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>partner</code></td><td>Mutual integration or business partnership</td></tr>
            <tr><td><code>provider</code></td><td>External service provider (e.g., payments, data)</td></tr>
            <tr><td><code>affiliate</code></td><td>Referral or affiliate relationship</td></tr>
            <tr><td><code>fallback</code></td><td>Used when local agents are unavailable</td></tr>
            <tr><td><code>recommended</code></td><td>Suggested complementary agent</td></tr>
          </tbody>
        </table>
        <p>
          The <code>verified</code> boolean indicates whether the domain operator has confirmed
          the external agent&apos;s identity. Clients SHOULD treat unverified linked agents with
          lower trust than verified ones.
        </p>
        <p>
          <strong>Schema:</strong>{' '}
          <a href="https://nais.id/schema/nais-agents.json" target="_blank" rel="noopener noreferrer">
            https://nais.id/schema/nais-agents.json
          </a>
        </p>
      </section>

      {/* MCP */}
      <section id="mcp">
        <h2>MCP Endpoint Discovery</h2>
        <p>
          If the agent exposes a Model Context Protocol endpoint, it SHOULD publish the URL in both the
          DNS TXT record (<code>mcp</code> field) and the manifest (<code>mcp</code> field). The DNS
          record provides a fast shortcut for resolvers that only need to locate the MCP endpoint
          without fetching the full manifest.
        </p>
        <p>
          The MCP endpoint URL MUST be on the same domain as the agent or a subdomain thereof. It MUST
          be served over HTTPS. Resolvers discovering an MCP endpoint via NAIS SHOULD perform TLS
          certificate validation before establishing a connection.
        </p>
        <div className="callout callout-note">
          NAIS does not define the MCP protocol itself. Refer to the{' '}
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            MCP specification
          </a>{' '}
          for details on the protocol contract.
        </div>
      </section>

      {/* Auth */}
      <section id="auth">
        <h2>Wallet Auth Flow</h2>
        <p>
          When an agent requires authentication (<code>auth.type = &quot;wallet&quot;</code>), callers
          prove their identity by signing a challenge nonce with the private key associated with their
          agent domain. This enables mutual, passwordless authentication between agents without a
          central authority.
        </p>
        <CodeBlock code={AUTH_FLOW} language="bash" filename="Wallet auth exchange" />
        <p>
          The signature MUST cover the string{' '}
          <code>nais-auth:{'{nonce}'}:{'{caller-domain}'}</code> using EIP-191 personal_sign (Ethereum)
          or equivalent. The server MUST verify:
        </p>
        <ol>
          <li>The nonce was issued by this server and has not expired.</li>
          <li>The signature is valid for the claimed caller domain.</li>
          <li>
            The recovered address matches the public key registered for that domain (via a{' '}
            <code>_auth.{'{caller-domain}'}</code> TXT record containing the address, or via
            on-chain domain resolution such as ENS).
          </li>
        </ol>
        <h3>Auth object schema</h3>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>type</code></td><td>string</td><td>Yes</td><td><code>wallet</code>, <code>bearer</code>, or <code>none</code>.</td></tr>
            <tr><td><code>chains</code></td><td>string[]</td><td>No</td><td>Supported chain names (e.g. <code>ethereum</code>, <code>solana</code>, <code>base</code>).</td></tr>
            <tr><td><code>endpoint</code></td><td>string (URL)</td><td>No</td><td>URL to request a challenge nonce.</td></tr>
          </tbody>
        </table>
      </section>

      {/* Payment */}
      <section id="payment">
        <h2>x402 Payment Flow</h2>
        <p>
          NAIS supports optional machine-to-machine payments using the HTTP 402 Payment Required
          protocol (x402). When an agent call requires payment, the server responds with HTTP 402 and
          headers that describe the payment endpoint, amount, and accepted currencies.
        </p>
        <CodeBlock code={X402_FLOW} language="bash" filename="x402 payment exchange" />
        <div className="callout callout-warning">
          Payments are entirely optional. If no <code>payment</code> object is present in the manifest,
          the agent accepts calls without payment. Never assume payment is required without first
          attempting an unauthenticated request.
        </div>
        <h3>Payment object schema</h3>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>type</code></td><td>string</td><td>Yes</td><td>Payment protocol. Only <code>x402</code> is defined.</td></tr>
            <tr><td><code>endpoint</code></td><td>string (URL)</td><td>Yes</td><td>URL to submit payment receipts.</td></tr>
            <tr><td><code>currencies</code></td><td>string[]</td><td>Yes</td><td>Accepted token symbols (e.g. <code>USDC</code>, <code>ETH</code>).</td></tr>
            <tr><td><code>pricePerCall</code></td><td>string</td><td>No</td><td>Decimal string, denominated in the first listed currency.</td></tr>
            <tr><td><code>freeQuota</code></td><td>number</td><td>No</td><td>Number of free calls per authenticated caller per day.</td></tr>
          </tbody>
        </table>
      </section>

      {/* Security */}
      <section id="security">
        <h2>Security Considerations</h2>
        <h3>Domain hijacking</h3>
        <p>
          NAIS identity is rooted in DNS, which means that whoever controls the domain controls the
          agent identity. Operators MUST enable DNSSEC on their domain and SHOULD use registrar-level
          account protection (2FA, registry lock). Loss of domain control is equivalent to loss of
          agent identity.
        </p>
        <h3>Manifest tampering</h3>
        <p>
          The manifest is served over HTTPS. Resolvers MUST validate TLS certificates and MUST NOT
          follow HTTP redirects to a different domain. The domain in the manifest&apos;s <code>domain</code>{' '}
          field MUST match the domain used for resolution.
        </p>
        <h3>Replay attacks</h3>
        <p>
          Challenge nonces used in wallet auth MUST be single-use, server-generated, and MUST expire
          within a short window (recommended: 60–300 seconds). Servers MUST track used nonces to
          prevent replay attacks.
        </p>
        <h3>Rate limiting</h3>
        <p>
          Resolvers SHOULD implement DNS query rate limiting and manifest fetch caching to prevent
          DoS via repeated lookups. Servers SHOULD enforce rate limits independent of any payment
          requirements.
        </p>
      </section>

      {/* Versioning */}
      <section id="versioning">
        <h2>Versioning</h2>
        <p>
          The NAIS protocol is versioned with a single integer in the DNS TXT record (<code>v=nais1</code>)
          and a decimal version string in the manifest (<code>&quot;nais&quot;: &quot;1.0&quot;</code>). Minor
          additions (new optional manifest fields) increment the decimal only. Breaking changes increment
          the integer and require a new TXT record version string.
        </p>
        <p>
          Resolvers MUST ignore unknown manifest fields (forward compatibility). Resolvers MUST NOT
          fail resolution when encountering optional fields they do not implement.
        </p>
      </section>

      {/* Changelog */}
      <section id="changelog">
        <h2>Version History</h2>
        <table>
          <thead>
            <tr><th>Version</th><th>Date</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>1.0-draft</code></td>
              <td>2025-01-15</td>
              <td>Initial public draft. DNS record format, manifest schema, wallet auth, x402.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </DocLayout>
  );
}
