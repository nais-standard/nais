import type { Metadata } from 'next';
import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata: Metadata = {
  title: 'Quickstart',
  description: 'Set up a NAIS-compliant agent identity in under 10 minutes.',
};

const NAV = [
  { id: 'intro', label: 'Introduction' },
  { id: 'step-1', label: 'Step 1 — Choose a Domain' },
  { id: 'step-2', label: 'Step 2 — Add TXT Record' },
  { id: 'step-3', label: 'Step 3 — Host agent.json' },
  { id: 'step-4', label: 'Step 4 — Expose MCP Endpoint' },
  { id: 'step-5', label: 'Step 5 — Validate' },
  { id: 'next-steps', label: 'Next Steps' },
];

const AGENT_JSON_MINIMAL = `{
  "nais": "1.0",
  "name": "My Agent",
  "description": "What my agent does",
  "domain": "myagent.com",
  "version": "1.0.0",
  "capabilities": ["task-a", "task-b"],
  "contact": "hello@myagent.com"
}`;

const AGENT_JSON_WITH_MCP = `{
  "nais": "1.0",
  "name": "My Agent",
  "description": "What my agent does",
  "domain": "myagent.com",
  "version": "1.0.0",
  "mcp": "https://myagent.com/mcp",
  "capabilities": ["task-a", "task-b"],
  "contact": "hello@myagent.com",
  "license": "MIT"
}`;

const NGINX_CONFIG = `# NGINX — serve agent.json from /.well-known/
location /.well-known/agent.json {
    alias /var/www/agent.json;
    add_header Content-Type application/json;
    add_header Access-Control-Allow-Origin *;
}`;

const APACHE_CONFIG = `# Apache — .htaccess
<Files "agent.json">
    Header set Content-Type "application/json"
    Header set Access-Control-Allow-Origin "*"
</Files>

Alias /.well-known/agent.json /var/www/agent.json`;

const NODE_SERVER = `// Express.js — minimal NAIS server
import express from 'express';
const app = express();

// Serve the manifest
app.get('/.well-known/agent.json', (req, res) => {
  res.json({
    nais: "1.0",
    name: "My Agent",
    domain: "myagent.com",
    version: "1.0.0",
    mcp: "https://myagent.com/mcp",
    capabilities: ["task-a", "task-b"],
  });
});

app.listen(3000);`;

const PYTHON_SERVER = `# FastAPI — minimal NAIS server
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/.well-known/agent.json")
async def agent_manifest():
    return JSONResponse({
        "nais": "1.0",
        "name": "My Agent",
        "domain": "myagent.com",
        "version": "1.0.0",
        "mcp": "https://myagent.com/mcp",
        "capabilities": ["task-a", "task-b"],
    }, headers={"Access-Control-Allow-Origin": "*"})`;

const DNS_MINIMAL = `; Minimal NAIS record
_agent.myagent.com  3600  IN  TXT  "v=nais1; manifest=https://myagent.com/.well-known/agent.json"`;

const DNS_FULL = `; Full NAIS record with MCP and auth
_agent.myagent.com  3600  IN  TXT  "v=nais1; manifest=https://myagent.com/.well-known/agent.json; mcp=https://myagent.com/mcp; auth=wallet; pay=x402"`;

const CURL_VERIFY = `# Verify DNS TXT record
dig TXT _agent.myagent.com +short
# → "v=nais1; manifest=https://myagent.com/.well-known/agent.json"

# Verify manifest endpoint
curl -s https://myagent.com/.well-known/agent.json | jq .
# → { "nais": "1.0", "name": "My Agent", ... }`;

const NAIS_CLI_VALIDATE = `# Using the NAIS validator CLI (when available)
npx nais validate myagent.com

# Expected output:
✓  DNS record found       (_agent.myagent.com TXT)
✓  Manifest reachable     (200 OK, 342 bytes)
✓  Schema valid           (nais 1.0)
✓  Domain match           (manifest.domain == myagent.com)
⚠  MCP endpoint          (not configured — optional)
─────────────────────────────────────────────────
NAIS identity valid`;

export default function QuickstartPage() {
  return (
    <DocLayout
      title="Quickstart"
      description="Set up a NAIS-compliant agent identity in under 10 minutes. No new infrastructure required."
      navItems={NAV}
    >
      <section id="intro">
        <h2 className="sr-only">Introduction</h2>
        <p>
          This guide walks through publishing a NAIS identity for an agent from scratch. By the end
          you will have a live, resolvable agent identity with a DNS record, a manifest, and an
          optional MCP endpoint.
        </p>
        <p>
          <strong>Prerequisites:</strong> a domain name, access to your DNS provider&apos;s control panel,
          and an HTTPS server (or static hosting) that can serve a JSON file.
        </p>
        <div className="callout">
          Using a subdomain like <code>agent.mycompany.com</code> is perfectly valid if you are
          registering an internal or departmental agent rather than a standalone one.
        </div>
      </section>

      {/* Step 1 */}
      <section id="step-1">
        <h2>
          <span className="step-number inline-flex mr-3">1</span>
          Choose a domain
        </h2>
        <p>
          Your agent&apos;s identity will be its domain name. Choose a domain that is memorable and
          reflects what the agent does. You can use:
        </p>
        <ul>
          <li>A brand-new domain registered just for this agent (e.g. <code>weatheragent.link</code>)</li>
          <li>A subdomain of an existing domain (e.g. <code>agent.yourcompany.com</code>)</li>
          <li>An internal domain for enterprise agents (e.g. <code>procurement-agent.corp</code>)</li>
        </ul>
        <p>
          NAIS works with any domain registrar and any DNS provider. You need to control the DNS
          records for the domain to publish the NAIS TXT record.
        </p>
        <div className="callout callout-note">
          <strong>Internal agents:</strong> private/internal agents that use non-public domains are
          valid NAIS agents. Resolvers that cannot reach the domain will simply fail resolution,
          which is the correct behaviour for a private agent.
        </div>
      </section>

      {/* Step 2 */}
      <section id="step-2">
        <h2>
          <span className="step-number inline-flex mr-3">2</span>
          Add the _agent TXT record
        </h2>
        <p>
          Log in to your DNS provider and add a TXT record at <code>_agent.myagent.com</code>. Start
          with the minimal required record:
        </p>
        <CodeBlock code={DNS_MINIMAL} language="dns" filename="DNS zone" />
        <p>
          Once you have the manifest hosted (step 3), you can optionally expand the record with MCP
          and auth hints:
        </p>
        <CodeBlock code={DNS_FULL} language="dns" filename="DNS zone (expanded)" />
        <p>
          DNS propagation typically takes 1–15 minutes for most providers, though the TTL you set
          controls how long resolvers will cache the record. A TTL of 3600 (1 hour) is a reasonable
          default; use a shorter value (300) while testing.
        </p>
        <div className="callout callout-warning">
          Do not forget the leading underscore. The record MUST be at <code>_agent.yourdomain.com</code>,
          not <code>agent.yourdomain.com</code>. The underscore prefix prevents conflicts with other
          DNS records.
        </div>
      </section>

      {/* Step 3 */}
      <section id="step-3">
        <h2>
          <span className="step-number inline-flex mr-3">3</span>
          Host /.well-known/agent.json
        </h2>
        <p>
          Create the manifest file. Start with the minimal version and expand as needed:
        </p>
        <CodeBlock code={AGENT_JSON_MINIMAL} language="json" filename="agent.json (minimal)" />
        <p>
          Place this file so it is served at <code>https://myagent.com/.well-known/agent.json</code>.
          The file MUST be served with <code>Content-Type: application/json</code> and MUST be
          accessible over HTTPS without credentials. Adding a CORS header is recommended so that
          browser-based resolvers can access it:
        </p>
        <p className="font-medium text-slate-700 mt-4 mb-2">NGINX configuration:</p>
        <CodeBlock code={NGINX_CONFIG} language="bash" filename="nginx.conf" />
        <p className="font-medium text-slate-700 mt-4 mb-2">Apache / .htaccess:</p>
        <CodeBlock code={APACHE_CONFIG} language="bash" filename=".htaccess" />
        <p className="font-medium text-slate-700 mt-4 mb-2">
          Or serve dynamically from your application:
        </p>
        <CodeBlock code={NODE_SERVER} language="javascript" filename="server.js" />
        <CodeBlock code={PYTHON_SERVER} language="python" filename="main.py" />
        <div className="callout callout-note">
          Static hosting works well for agents with stable capabilities. GitHub Pages, Cloudflare
          Pages, Vercel, and Netlify all support the <code>/.well-known/</code> path.
        </div>
      </section>

      {/* Step 4 */}
      <section id="step-4">
        <h2>
          <span className="step-number inline-flex mr-3">4</span>
          Expose an MCP endpoint (optional)
        </h2>
        <p>
          If your agent supports the Model Context Protocol, add the <code>mcp</code> field to
          your manifest:
        </p>
        <CodeBlock code={AGENT_JSON_WITH_MCP} language="json" filename="agent.json (with MCP)" />
        <p>
          Also add the <code>mcp</code> field to your DNS TXT record as a shortcut for resolvers
          that need only the endpoint URL.
        </p>
        <p>
          The MCP endpoint MUST be on the same domain or a subdomain of the agent domain. It MUST be
          served over HTTPS. Refer to the{' '}
          <a
            href="https://modelcontextprotocol.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            MCP specification
          </a>{' '}
          for the protocol contract.
        </p>
        <div className="callout callout-note">
          MCP support is entirely optional. A NAIS agent without an MCP endpoint is still a valid
          NAIS agent. You can expose a REST API via the <code>api</code> manifest field instead.
        </div>
      </section>

      {/* Step 5 */}
      <section id="step-5">
        <h2>
          <span className="step-number inline-flex mr-3">5</span>
          Validate your setup
        </h2>
        <p>Verify each layer manually with standard tools:</p>
        <CodeBlock code={CURL_VERIFY} language="bash" filename="Manual verification" />
        <p>Or use the NAIS online validator:</p>
        <div
          className="flex items-center gap-4 p-5 rounded-lg border border-blue-200 bg-blue-50 my-4"
        >
          <div className="flex-1">
            <div className="font-medium text-slate-900 mb-0.5">NAIS Validator</div>
            <div className="text-sm text-slate-500">
              Enter your domain to check DNS, manifest, schema, and endpoint availability.
            </div>
          </div>
          <a
            href="/validator"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
          >
            Open validator →
          </a>
        </div>
        <p>Or the CLI tool when available:</p>
        <CodeBlock code={NAIS_CLI_VALIDATE} language="bash" filename="CLI validation" />
      </section>

      {/* Next Steps */}
      <section id="next-steps">
        <h2>Next Steps</h2>
        <p>Your agent is now discoverable. Here is what to do next:</p>
        <ul>
          <li>
            <strong>Add wallet auth</strong> — set <code>auth.type = &quot;wallet&quot;</code> in your
            manifest to require callers to prove their identity. See the{' '}
            <a href="/spec#auth" className="text-blue-600 hover:underline">Auth spec</a>.
          </li>
          <li>
            <strong>Enable machine payments</strong> — add an <code>x402</code> payment object to
            monetize per-call usage. See the{' '}
            <a href="/spec#payment" className="text-blue-600 hover:underline">Payment spec</a>.
          </li>
          <li>
            <strong>Pick an SDK</strong> — use a community library to speed up integration. See the{' '}
            <a href="/sdks" className="text-blue-600 hover:underline">SDK list</a>.
          </li>
          <li>
            <strong>Browse examples</strong> — see worked examples for different agent types. See{' '}
            <a href="/examples" className="text-blue-600 hover:underline">Examples</a>.
          </li>
          <li>
            <strong>Enable DNSSEC</strong> — strongly recommended to prevent DNS spoofing. Check your
            registrar&apos;s documentation for DNSSEC setup instructions.
          </li>
        </ul>
      </section>
    </DocLayout>
  );
}
