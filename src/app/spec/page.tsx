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
  { id: 'dns-fields', label: 'Field reference', indent: true },
  { id: 'card', label: 'agent.json Card' },
  { id: 'card-fields', label: 'Field reference', indent: true },
  { id: 'signature', label: 'Card Signature' },
  { id: 'signature-canonical', label: 'Canonicalization', indent: true },
  { id: 'signature-verify', label: 'Verification', indent: true },
  { id: 'mcp-snapshot', label: 'MCP Snapshot' },
  { id: 'mcp', label: 'MCP Endpoint' },
  { id: 'auth', label: 'Wallet Auth Flow' },
  { id: 'payment', label: 'x402 Payment Flow' },
  { id: 'security', label: 'Security Considerations' },
  { id: 'versioning', label: 'Versioning' },
  { id: 'changelog', label: 'Version History' },
];

const DNS_TXT_FULL = `; Minimum required record (manifest defaults to /.well-known/agent.json)
_agent.example.com  IN  TXT  "v=nais1; k=ed25519:Bx91kQz3vR7w8mFhZTrVuMkzceQoc5a92N1h1Vg9Pl"

; With an explicit manifest URL
_agent.example.com  IN  TXT  "v=nais1; manifest=https://example.com/.well-known/agent.json; k=ed25519:Bx91kQz3vR7w8mFhZTrVuMkzceQoc5a92N1h1Vg9Pl"`;

const CARD_FULL = `{
  "nais": "1.0",
  "cardVersion": 7,
  "updated": "2026-06-11T10:00:00Z",

  "name": "Example Agent",
  "domain": "example.com",
  "description": "A short description of what this agent does",
  "tags": ["language", "productivity"],
  "contact": "ops@example.com",

  "mcp": "https://example.com/mcp",

  "auth": [
    { "scheme": "none" }
  ],

  "payment": {
    "type": "x402",
    "networks": ["base"],
    "assets": ["USDC"],
    "payTo": ["0x9aF3c21D8b44e7A0fF2e6B19d4C7a8E5f1B0d6C2"],
    "pricing": { "summarize": "0.001", "translate": "0.0005" }
  },

  "linkedAgents": [
    { "domain": "translate.example.com", "relation": "provider", "name": "Translation Service", "verified": true },
    { "domain": "search.partner.org", "relation": "partner", "name": "Web Search", "verified": false }
  ],

  "mcpSnapshot": {
    "capturedAt": "2026-06-11T10:00:00Z",
    "toolsHash": "sha256:7f3a91c4e8b2d6f0a1c5e9b3d7f2a8c4e6b0d9f3a7c1e5b9d3f7a2c8e4b6d0f9",
    "tools": [
      { "name": "summarize", "description": "Summarize a document or web page." },
      { "name": "translate", "description": "Translate text between languages." }
    ]
  },

  "signature": {
    "alg": "EdDSA",
    "kid": "ed25519:Bx91kQz3vR7w8mFhZTrVuMkzceQoc5a92N1h1Vg9Pl",
    "jws": "eyJhbGciOiJFZERTQSIsImtpZCI6ImVkMjU1MTk6Qng5MWtRej...In0..o4xT2"
  }
}`;

const SIGNATURE_EXAMPLE = `"signature": {
  "alg": "EdDSA",
  "kid": "ed25519:Bx91kQz3vR7w8mFhZTrVuMkzceQoc5a92N1h1Vg9Pl",
  "jws": "eyJhbGciOiJFZERTQSIsImtpZCI6ImVkMjU1MTk6Qng5MWtRej...In0..o4xT2"
}`;

const SIGNATURE_VERIFY = `# Given: the agent card and the _agent TXT "k=" value.

# 1. Confirm signature.kid equals the DNS k= fingerprint.
#    (binds the signing key to the domain's DNS zone)

# 2. Reconstruct the JWS signing input.
header  = base64url(  '{"alg":"EdDSA","kid":"<kid>"}'  )   # from the JWS
payload = base64url(  canonicalize(card without "signature")  )
signingInput = header + "." + payload

# 3. Recover the public key from the kid and verify.
pubkey = base64url_decode(kid after "ed25519:")            # 32 bytes
ok = ed25519_verify(pubkey, signature, signingInput)

# The card is authentic only if (1) the kid matches DNS AND (3) verifies.`;

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
      badge="v1.0"
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
            A record beginning with <code>v=nais1</code> signals NAIS compliance. The record carries the
            (optional) manifest URL and the <code>k=</code> signing-key fingerprint that anchors trust.
          </li>
          <li>
            <strong>Card Fetch:</strong> Retrieve the <code>agent.json</code> card from the URL in the{' '}
            <code>manifest</code> field, or from the default{' '}
            <code>{'https://{domain}/.well-known/agent.json'}</code> if absent. The card MUST be served
            over HTTPS.
          </li>
          <li>
            <strong>Signature Verification:</strong> Verify the card&apos;s mandatory detached EdDSA JWS
            (see <a href="#signature">Card Signature</a>). The card&apos;s <code>signature.kid</code> MUST
            equal the DNS <code>k=</code> value, and the signature MUST verify over the canonical card
            body. The resolver then validates the card against the NAIS schema.
          </li>
        </ol>
        <p>
          Resolution succeeds only if all three steps complete without error: the card is fetched, its
          signature verifies against the DNS-published key, and it passes schema validation. Resolvers
          SHOULD cache DNS responses according to the record&apos;s TTL and SHOULD cache cards with a
          maximum TTL of 3600 seconds unless the HTTP response specifies otherwise.
        </p>
        <div className="callout callout-note">
          The card&apos;s <code>domain</code> field MUST match the domain used for resolution, and its{' '}
          <code>signature.kid</code> MUST match the DNS <code>k=</code> key. Resolvers MUST reject a card
          whose signature does not verify, and MUST NOT follow redirects to a different host.
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
          <code>k</code> field MUST be present and MUST carry the agent&apos;s signing-key fingerprint —
          this is the trust anchor that binds the signed card to the domain&apos;s DNS zone. The{' '}
          <code>manifest</code> field is optional; when omitted, resolvers fetch{' '}
          <code>{'https://{domain}/.well-known/agent.json'}</code>.
        </p>
        <div className="callout callout-note">
          NAIS 1.0 moves all authoritative metadata (MCP endpoint, auth, payment) <em>into the signed
          card</em>. The DNS record therefore no longer carries <code>mcp</code>, <code>auth</code>, or{' '}
          <code>pay</code> shortcut fields — only the version, the optional manifest URL, and the signing
          key.
        </div>
        <h3 id="dns-fields">TXT Record Field Reference</h3>
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
              <td><code>k</code></td>
              <td>Yes</td>
              <td>Signing-key fingerprint: <code>ed25519:</code> followed by the base64url-encoded 32-byte Ed25519 public key. MUST equal the card&apos;s <code>signature.kid</code>.</td>
            </tr>
            <tr>
              <td><code>manifest</code></td>
              <td>No</td>
              <td>HTTPS URL to the <code>agent.json</code> card. Defaults to <code>{'https://{domain}/.well-known/agent.json'}</code>.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Card */}
      <section id="card">
        <h2>agent.json Card</h2>
        <p>
          The card is a JSON document served at{' '}
          <code>{'https://{domain}/.well-known/agent.json'}</code>. It MUST be served with
          Content-Type <code>application/json</code> and MUST be accessible over HTTPS without
          authentication. The card is the canonical, machine-readable, <em>signed</em> description of an
          agent — every card MUST carry a valid <a href="#signature">signature</a>.
        </p>
        <CodeBlock code={CARD_FULL} language="json" filename="/.well-known/agent.json" showLineNumbers />
        <h3 id="card-fields">Field Reference</h3>
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
            <tr><td><code>cardVersion</code></td><td>integer</td><td>Yes</td><td>Monotonically increasing card revision. Increment on every change so caches and registries detect updates.</td></tr>
            <tr><td><code>updated</code></td><td>string</td><td>Yes</td><td>ISO 8601 timestamp of the last card update.</td></tr>
            <tr><td><code>name</code></td><td>string</td><td>Yes</td><td>Human-readable display name.</td></tr>
            <tr><td><code>domain</code></td><td>string</td><td>Yes</td><td>Canonical domain. MUST match the resolved domain.</td></tr>
            <tr><td><code>signature</code></td><td>object</td><td>Yes</td><td>Detached EdDSA JWS over the card. See <a href="#signature">Card Signature</a>.</td></tr>
            <tr><td><code>description</code></td><td>string</td><td>No</td><td>Short description (max 280 characters recommended).</td></tr>
            <tr><td><code>tags</code></td><td>string[]</td><td>No</td><td>Free-form discovery tags. Advisory hints for narrowing agents in a catalog — they carry no normative meaning. (Replaces the removed <code>capabilities</code> field.)</td></tr>
            <tr><td><code>contact</code></td><td>string</td><td>No</td><td>Contact email or URL for the agent operator.</td></tr>
            <tr><td><code>mcp</code></td><td>string (URL)</td><td>No</td><td>URL to the MCP endpoint.</td></tr>
            <tr><td><code>auth</code></td><td>object[]</td><td>No</td><td>Accepted auth schemes, e.g. <code>[{'{ "scheme": "none" }'}]</code>. See Auth section.</td></tr>
            <tr><td><code>payment</code></td><td>object</td><td>No</td><td>Payment configuration; <code>payTo</code> is bound to the identity key. See Payment section.</td></tr>
            <tr><td><code>linkedAgents</code></td><td>object[]</td><td>No</td><td>Pointers to related agents (partners, providers, fallbacks). Advisory only. See <a href="#linked-agents">Linked Agents</a>.</td></tr>
            <tr><td><code>mcpSnapshot</code></td><td>object</td><td>No</td><td>Advisory snapshot of the live <code>tools/list</code>. See <a href="#mcp-snapshot">MCP Snapshot</a>.</td></tr>
          </tbody>
        </table>

        <h3 id="linked-agents">Linked Agents</h3>
        <p>
          A card MAY list other NAIS agents it relates to via <code>linkedAgents</code> — for example
          an upstream <code>provider</code> it depends on, a business <code>partner</code>, or a{' '}
          <code>fallback</code> to use when this agent is unavailable. Each entry is a small object:
        </p>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>domain</code></td><td>string</td><td>Yes</td><td>Canonical domain of the linked agent. Resolve and verify it independently, like any other NAIS agent.</td></tr>
            <tr><td><code>relation</code></td><td>string</td><td>Yes</td><td>One of <code>partner</code>, <code>provider</code>, <code>affiliate</code>, <code>fallback</code>, <code>recommended</code>.</td></tr>
            <tr><td><code>verified</code></td><td>boolean</td><td>No</td><td>The operator&apos;s attestation of an established, confirmed relationship (<code>true</code>) versus a mere mention (<code>false</code>).</td></tr>
            <tr><td><code>name</code></td><td>string</td><td>No</td><td>Human-readable display name for the linked agent.</td></tr>
          </tbody>
        </table>
        <div className="callout">
          <strong>Links confer no trust.</strong> <code>linkedAgents</code> is advisory metadata. Because
          it lives inside the signed card, it is authentic to <em>this</em> operator — but a link is not a
          credential for the agent it points at. A client MUST resolve and verify each linked agent&apos;s
          own signed card before relying on it, and <code>verified: true</code> is the operator&apos;s
          claim, never a substitute for that cryptographic check.
        </div>
      </section>

      {/* Signature */}
      <section id="signature">
        <h2>Card Signature</h2>
        <p>
          Every NAIS 1.0 card MUST carry a detached <strong>EdDSA (Ed25519) JWS</strong> over its own
          canonical body. The signing key&apos;s fingerprint is published in the <code>_agent</code> DNS
          record (<code>k=</code>), and the card&apos;s <code>signature.kid</code> MUST equal it. This
          makes trust travel <em>with</em> the card: a registry or resolver can cache and redistribute a
          card without being able to forge it, and DNSSEC adoption is not a prerequisite.
        </p>
        <div className="callout">
          <strong>Why signing matters:</strong> without it, the entire trust chain hangs on an unsigned
          DNS record plus TLS — so a single web-server compromise (the most common breach) lets an
          attacker rewrite <code>agent.json</code> and swap payment addresses. With a mandatory signature,
          forging a card requires compromising <em>both</em> the DNS zone (to change <code>k=</code>) and
          the private signing key. A web-server breach alone is not enough.
        </div>
        <CodeBlock code={SIGNATURE_EXAMPLE} language="json" filename="signature object" />
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>alg</code></td><td>string</td><td>Yes</td><td>Signature algorithm. MUST be <code>&quot;EdDSA&quot;</code> (Ed25519) in NAIS 1.0.</td></tr>
            <tr><td><code>kid</code></td><td>string</td><td>Yes</td><td><code>ed25519:</code> + base64url 32-byte public key. MUST equal the DNS <code>k=</code> value.</td></tr>
            <tr><td><code>jws</code></td><td>string</td><td>Yes</td><td>Detached compact JWS: <code>BASE64URL(header)..BASE64URL(signature)</code> (empty payload segment).</td></tr>
          </tbody>
        </table>

        <h3 id="signature-canonical">Canonicalization</h3>
        <p>
          The JWS payload is the card with its <code>signature</code> member removed, serialized using the
          NAIS canonical JSON profile — a subset of{' '}
          <a href="https://www.rfc-editor.org/rfc/rfc8785" target="_blank" rel="noopener noreferrer">RFC 8785 (JCS)</a>:
        </p>
        <ul>
          <li>Object keys sorted ascending by code point; no insignificant whitespace.</li>
          <li><code>/</code> and non-ASCII characters left unescaped (UTF-8).</li>
          <li>Integers emitted as integers. Cards MUST NOT contain floating-point numbers.</li>
        </ul>
        <p>
          The protected header is <code>{'{"alg":"EdDSA","kid":"<kid>"}'}</code> (same canonical form).
          The signing input is <code>BASE64URL(header) + &quot;.&quot; + BASE64URL(canonical payload)</code>;
          the resulting detached JWS stores an empty payload segment (<code>header..signature</code>).
        </p>

        <h3 id="signature-verify">Verification</h3>
        <CodeBlock code={SIGNATURE_VERIFY} language="bash" filename="Verification procedure" />
        <p>
          Resolvers and clients MUST reject a card when the <code>kid</code> does not match the DNS{' '}
          <code>k=</code> key, when the signature does not verify, or when the signature is absent. The
          reference resolver and all official SDKs verify the signature independently rather than trusting
          one another&apos;s verdict.
        </p>
      </section>

      {/* MCP Snapshot */}
      <section id="mcp-snapshot">
        <h2>MCP Snapshot</h2>
        <p>
          A card MAY include an <code>mcpSnapshot</code> derived from the MCP endpoint&apos;s live{' '}
          <code>tools/list</code> at generation time: each tool&apos;s name, description, and a trimmed
          input schema, plus a <code>capturedAt</code> timestamp and a <code>toolsHash</code>. This gives
          a deciding agent enough to evaluate the agent without a round-trip, and — because it is derived
          — it cannot be wrong at generation time.
        </p>
        <div className="callout callout-note">
          <strong>Normative:</strong> the snapshot is <em>advisory</em> for discovery; the live MCP{' '}
          <code>tools/list</code> is <em>authoritative</em>. Clients MUST treat the live listing as the
          source of truth before calling a tool.
        </div>
        <p>
          <code>toolsHash</code> is <code>sha256:&lt;hex&gt;</code> over the canonical JSON of the{' '}
          <code>tools</code> array (same canonicalization as the signature). A client that fetches the live{' '}
          <code>tools/list</code> can normalize it to the snapshot shape, recompute the hash, and detect a
          stale or altered snapshot. The whole snapshot is covered by the card signature.
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
        <h3>Auth schema</h3>
        <p>
          The card&apos;s <code>auth</code> field is an array of accepted schemes, in order of preference.
          An absent <code>auth</code> array, or <code>[{'{ "scheme": "none" }'}]</code>, means no
          authentication is required.
        </p>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>scheme</code></td><td>string</td><td>Yes</td><td><code>none</code>, <code>wallet</code>, or <code>bearer</code>.</td></tr>
            <tr><td><code>chains</code></td><td>string[]</td><td>No</td><td>For wallet auth: supported chain names (e.g. <code>ethereum</code>, <code>base</code>).</td></tr>
            <tr><td><code>challenge_endpoint</code></td><td>string (URL)</td><td>No</td><td>URL to request a challenge nonce.</td></tr>
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
          <strong>Verify before you pay.</strong> The <code>payTo</code> address lives inside the signed
          card body and is bound to the identity key. x402 payments are irreversible, so clients MUST
          verify the card&apos;s <a href="#signature">signature</a> before using any <code>payTo</code>
          address, and MUST NOT pay an address taken from an unsigned or unverified card. Payments remain
          optional — if no <code>payment</code> object is present, the agent accepts calls without payment.
        </div>
        <h3>Payment object schema</h3>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>type</code></td><td>string</td><td>Yes</td><td>Payment protocol. Only <code>x402</code> is defined.</td></tr>
            <tr><td><code>networks</code></td><td>string[]</td><td>Yes</td><td>Accepted networks (e.g. <code>base</code>).</td></tr>
            <tr><td><code>assets</code></td><td>string[]</td><td>Yes</td><td>Accepted assets / token symbols (e.g. <code>USDC</code>).</td></tr>
            <tr><td><code>payTo</code></td><td>string[]</td><td>Yes</td><td>Receiving address(es). Bound to the identity key by the card signature — trust only after verification.</td></tr>
            <tr><td><code>pricing</code></td><td>string | object</td><td>No</td><td>A single flat price string applied to every tool, or a map of tool name to price string. Prices are decimal strings in the first listed asset.</td></tr>
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
        <h3>Card tampering &amp; web-server compromise</h3>
        <p>
          The card is served over HTTPS, and resolvers MUST validate TLS certificates and MUST NOT follow
          HTTP redirects to a different domain. But TLS alone does not protect against the most common
          breach — a compromised web server. NAIS therefore requires a mandatory{' '}
          <a href="#signature">card signature</a>: because the signing key is published in DNS
          (<code>k=</code>) and the card is signed offline, an attacker who controls only the web server
          cannot forge a card or swap the <code>payTo</code> address. Forgery requires compromising both
          the DNS zone and the private signing key.
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
          and a decimal version string in the card (<code>&quot;nais&quot;: &quot;1.0&quot;</code>). Minor
          additions (new optional card fields) increment the decimal only. Breaking changes increment the
          integer and require a new TXT record version string. The per-card <code>cardVersion</code> is
          independent of the protocol version — it tracks revisions of an individual agent&apos;s card.
        </p>
        <p>
          Resolvers MUST ignore unknown card fields (forward compatibility) and MUST NOT fail resolution
          on optional fields they do not implement — but note that unknown fields are still covered by the
          signature, so they cannot be added or altered in transit.
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
              <td><code>1.0</code></td>
              <td>2026-06-17</td>
              <td>Mandatory card signatures (detached EdDSA JWS + DNS <code>k=</code> key), <code>mcpSnapshot</code>, identity-bound <code>payTo</code>, flat card shape with <code>tags</code> (replacing <code>capabilities</code>). DNS record slimmed to <code>v</code>/<code>manifest</code>/<code>k</code>.</td>
            </tr>
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
