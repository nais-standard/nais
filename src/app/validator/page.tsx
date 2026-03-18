'use client';
import { useState } from 'react';

type CheckStatus = 'pending' | 'loading' | 'ok' | 'warn' | 'fail';

interface CheckResult {
  label: string;
  status: CheckStatus;
  value?: string;
  detail?: string;
}

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === 'ok') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Pass">
        <circle cx="9" cy="9" r="8" fill="#dcfce7" />
        <polyline points="5.5,9 8,11.5 12.5,6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'warn') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Warning">
        <circle cx="9" cy="9" r="8" fill="#fef3c7" />
        <path d="M9 5.5v4M9 12h.01" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === 'fail') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Fail">
        <circle cx="9" cy="9" r="8" fill="#fee2e2" />
        <path d="M6 6l6 6M12 6l-6 6" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === 'loading') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Loading" className="animate-spin">
        <circle cx="9" cy="9" r="7" stroke="#e2e8f0" strokeWidth="2" />
        <path d="M2 9a7 7 0 017-7" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Pending">
      <circle cx="9" cy="9" r="7" stroke="#e2e8f0" strokeWidth="2" fill="none" />
    </svg>
  );
}

function SummaryBadge({ summary }: { summary: 'valid' | 'partial' | 'invalid' }) {
  if (summary === 'valid') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        NAIS identity valid
      </span>
    );
  }
  if (summary === 'partial') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v5M6 9h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        Partial — optional fields missing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      Validation failed
    </span>
  );
}

function buildChecks(data: any): { checks: CheckResult[]; summary: 'valid' | 'partial' | 'invalid' } {
  const checks: CheckResult[] = [];

  // 1. DNS TXT record
  const agentRecords = data.dns?.agent_records ?? [];
  if (agentRecords.length > 0) {
    const raw = typeof agentRecords[0] === 'string' ? agentRecords[0] : agentRecords[0]?.raw ?? '';
    checks.push({
      label: 'DNS TXT record',
      status: 'ok',
      value: `_agent.${data.domain} TXT found`,
      detail: raw,
    });
  } else {
    checks.push({
      label: 'DNS TXT record',
      status: 'fail',
      value: `_agent.${data.domain} — no record found`,
      detail: 'No TXT record at _agent subdomain',
    });
  }

  // 2. Manifest reachable
  if (data.manifest?.fetched && data.manifest?.http_status === 200) {
    checks.push({
      label: 'Manifest reachable',
      status: 'ok',
      value: `HTTP ${data.manifest.http_status}`,
      detail: data.resolved?.manifest_url ?? '',
    });
  } else if (agentRecords.length === 0) {
    checks.push({ label: 'Manifest reachable', status: 'pending', value: 'Skipped — DNS failed' });
  } else {
    checks.push({
      label: 'Manifest reachable',
      status: 'fail',
      value: `HTTP ${data.manifest?.http_status ?? 'N/A'} — fetch failed`,
      detail: data.manifest?.error ?? '',
    });
  }

  // 3. Schema validation
  if (data.manifest?.validation?.valid) {
    const warnings = data.manifest.validation.warnings ?? [];
    if (warnings.length > 0) {
      checks.push({
        label: 'Schema validation',
        status: 'warn',
        value: 'Valid — with warnings',
        detail: warnings.join('; '),
      });
    } else {
      checks.push({
        label: 'Schema validation',
        status: 'ok',
        value: 'NAIS manifest — all required fields present',
        detail: data.manifest.data?.name ? `Agent: ${data.manifest.data.name}` : '',
      });
    }
  } else if (!data.manifest?.fetched) {
    checks.push({ label: 'Schema validation', status: 'pending', value: 'Skipped — manifest not fetched' });
  } else {
    const errors = data.manifest?.validation?.errors ?? [];
    checks.push({
      label: 'Schema validation',
      status: 'fail',
      value: 'Manifest has validation errors',
      detail: errors.join('; '),
    });
  }

  // 4. Domain match
  const manifestDomain = data.manifest?.data?.domain || data.manifest?.data?.id;
  if (manifestDomain) {
    const matches = manifestDomain === data.domain;
    checks.push({
      label: 'Domain match',
      status: matches ? 'ok' : 'warn',
      value: matches ? 'manifest.domain matches DNS domain' : 'Domain mismatch',
      detail: `${manifestDomain} ${matches ? '==' : '!='} ${data.domain}`,
    });
  } else if (!data.manifest?.fetched) {
    checks.push({ label: 'Domain match', status: 'pending', value: 'Skipped' });
  } else {
    checks.push({ label: 'Domain match', status: 'warn', value: 'No domain field in manifest' });
  }

  // 5. MCP endpoint
  if (data.resolved?.mcp_endpoint) {
    checks.push({
      label: 'MCP endpoint',
      status: 'ok',
      value: 'Declared',
      detail: data.resolved.mcp_endpoint,
    });
  } else if (!data.manifest?.fetched) {
    checks.push({ label: 'MCP endpoint', status: 'pending', value: 'Skipped' });
  } else {
    checks.push({
      label: 'MCP endpoint',
      status: 'warn',
      value: 'Not configured',
      detail: 'No mcp field — optional',
    });
  }

  // 6. Auth
  const authMethods = data.resolved?.auth ?? [];
  if (authMethods.length > 0 && !(authMethods.length === 1 && authMethods[0] === 'none')) {
    checks.push({
      label: 'Authentication',
      status: 'ok',
      value: authMethods.join(', '),
    });
  } else if (!data.manifest?.fetched) {
    checks.push({ label: 'Authentication', status: 'pending', value: 'Skipped' });
  } else {
    checks.push({
      label: 'Authentication',
      status: 'warn',
      value: 'Not configured',
      detail: 'auth = none — optional',
    });
  }

  // 7. Payments
  const payMethods = data.resolved?.payments ?? [];
  if (payMethods.length > 0 && !(payMethods.length === 1 && payMethods[0] === 'free')) {
    checks.push({
      label: 'Payment',
      status: 'ok',
      value: payMethods.join(', '),
    });
  } else if (!data.manifest?.fetched) {
    checks.push({ label: 'Payment', status: 'pending', value: 'Skipped' });
  } else {
    checks.push({
      label: 'Payment',
      status: 'warn',
      value: 'Not configured',
      detail: 'No payment methods — optional',
    });
  }

  // Determine summary
  const hasFail = checks.some(c => c.status === 'fail');
  const hasWarn = checks.some(c => c.status === 'warn');
  const summary = hasFail ? 'invalid' : hasWarn ? 'partial' : 'valid';

  return { checks, summary };
}

const DEMO_DOMAINS = ['weatheragent.nais.id'];

export default function ValidatorPage() {
  const [domain, setDomain] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<null | {
    domain: string;
    checks: CheckResult[];
    summary: 'valid' | 'partial' | 'invalid';
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = async (target?: string) => {
    const d = (target ?? domain).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!d) return;
    setDomain(d);
    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(
        `https://resolver.nais.id/resolve.php?domain=${encodeURIComponent(d)}`,
        { headers: { Accept: 'application/json' } }
      );
      if (!res.ok) {
        throw new Error(`Resolver returned HTTP ${res.status}`);
      }
      const data = await res.json();
      const { checks, summary } = buildChecks(data);
      setResult({ domain: d, checks, summary });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to reach the NAIS resolver: ${msg}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Header */}
        <div className="mb-8 pb-8 border-b border-slate-200">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-3">Validator</h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Check whether a domain is a valid NAIS agent identity. The validator checks DNS
            discovery, manifest reachability, schema compliance, and optional endpoint availability.
          </p>
        </div>

        {/* Input */}
        <div className="mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              validate();
            }}
            className="flex gap-3"
          >
            <div className="flex-1 relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3 3" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="weatheragent.nais.id"
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-300"
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
            <button
              type="submit"
              disabled={running || !domain.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
            >
              {running ? 'Checking\u2026' : 'Validate'}
            </button>
          </form>
          <p className="mt-2 text-xs text-slate-400">
            Try:{' '}
            {DEMO_DOMAINS.map((d, i) => (
              <span key={d}>
                {i > 0 && <span className="mx-1 text-slate-300">&middot;</span>}
                <button
                  onClick={() => validate(d)}
                  className="font-mono hover:text-blue-600 underline underline-offset-2"
                >
                  {d}
                </button>
              </span>
            ))}
          </p>
        </div>

        {/* Loading skeleton */}
        {running && (
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm font-mono text-slate-500">{domain}</span>
              <span className="text-xs text-slate-400 animate-pulse">Resolving via resolver.nais.id&hellip;</span>
            </div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 last:border-0">
                <div className="w-4 h-4 rounded-full bg-slate-100 animate-pulse" />
                <div className="h-3 rounded bg-slate-100 animate-pulse" style={{ width: `${40 + i * 8}%` }} />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !running && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-800">Resolver error</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !running && (
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm font-medium text-slate-700">{result.domain}</code>
                <span className="text-slate-300">&mdash;</span>
                <SummaryBadge summary={result.summary} />
              </div>
              <button
                onClick={() => setResult(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            </div>

            {/* Checks */}
            <div>
              {result.checks.map((check, i) => (
                <div
                  key={i}
                  className={`px-5 py-3.5 flex items-start gap-3 border-b border-slate-100 last:border-0 ${
                    check.status === 'fail'
                      ? 'bg-red-50/50'
                      : check.status === 'warn'
                      ? 'bg-amber-50/50'
                      : ''
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <StatusIcon status={check.status} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-800">{check.label}</span>
                      {check.value && (
                        <span className="text-sm text-slate-500">{check.value}</span>
                      )}
                    </div>
                    {check.detail && (
                      <div className="mt-0.5 font-mono text-xs text-slate-400 break-all">
                        {check.detail}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Checked at {new Date().toLocaleTimeString()}
              </span>
              <span className="text-xs text-slate-400">
                Resolved via resolver.nais.id
              </span>
            </div>
          </div>
        )}

        {/* Info section */}
        {!running && !result && !error && (
          <div className="mt-8 border-t border-slate-100 pt-8">
            <h2 className="text-base font-semibold text-slate-700 mb-4">What the validator checks</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'DNS Discovery',
                  desc: 'Queries _agent.{domain} for a TXT record starting with v=nais1. Verifies the manifest URL field is present.',
                },
                {
                  title: 'Manifest Fetch',
                  desc: 'Fetches the manifest URL over HTTPS. Checks HTTP status, Content-Type header, and CORS configuration.',
                },
                {
                  title: 'Schema Validation',
                  desc: 'Validates the manifest JSON against the NAIS 1.0 schema. Checks required fields, types, and URL formats.',
                },
                {
                  title: 'Domain Match',
                  desc: 'Confirms that manifest.domain matches the domain used for DNS lookup. Detects cross-domain spoofing.',
                },
                {
                  title: 'MCP Endpoint',
                  desc: 'If an MCP URL is present, checks that it is declared and reachable.',
                },
                {
                  title: 'Auth & Payment',
                  desc: 'Checks whether auth and payment methods are declared in the DNS record and manifest.',
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="font-medium text-slate-800 text-sm mb-1">{title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
