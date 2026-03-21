'use client';

import { useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ParsedRecord {
  v?: string;
  manifest?: string;
  mcp?: string;
  auth?: string;
  pay?: string;
  [key: string]: string | undefined;
}

interface AgentRecord {
  raw: string;
  parsed: ParsedRecord;
}

interface ResolverResponse {
  ok: boolean;
  cached: boolean;
  domain: string;
  resolver_version: string;
  discovery: {
    agent_txt_host: string;
    wallet_txt_host: string;
    payments_txt_host: string;
  };
  dns: {
    agent_records: AgentRecord[];
    wallet_records: AgentRecord[];
    payment_records: AgentRecord[];
  };
  resolved: {
    manifest_url: string | null;
    mcp_endpoint: string | null;
    auth: string[];
    payments: string[];
    wallet: string | null;
    version: string | null;
  };
  manifest: {
    fetched: boolean;
    http_status: number | null;
    error: string | null;
    data: Record<string, unknown> | null;
    validation: {
      valid: boolean;
      errors: string[];
      warnings: string[];
    };
  };
  error?: string;
}

// ─── Status Icons ─────────────────────────────────────────────────────────────

function IconOk() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 flex-shrink-0" aria-hidden="true">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1.5,5.5 4.5,8.5 9.5,2.5" />
      </svg>
    </span>
  );
}

function IconWarn() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 flex-shrink-0" aria-hidden="true">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M5.5 1L10 9.5H1L5.5 1Z" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="5.5" y1="4.5" x2="5.5" y2="6.5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="5.5" cy="8" r="0.6" fill="#d97706" />
      </svg>
    </span>
  );
}

function IconFail() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 flex-shrink-0" aria-hidden="true">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
        <line x1="2" y1="2" x2="9" y2="9" />
        <line x1="9" y1="2" x2="2" y2="9" />
      </svg>
    </span>
  );
}

function IconGray() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 flex-shrink-0" aria-hidden="true">
      <svg width="8" height="8" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" fill="#94a3b8" />
      </svg>
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-6" aria-live="polite" aria-busy="true" aria-label="Loading results">
      <div className="rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="rounded-xl border border-slate-200 p-5 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ─── KV Table ─────────────────────────────────────────────────────────────────

function KVTable({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([key, val]) => (
          <tr key={key} className="border-b border-slate-100 last:border-0">
            <td className="py-1.5 pr-4 font-mono text-xs text-slate-500 whitespace-nowrap w-36 align-top pt-2">{key}</td>
            <td className="py-1.5 text-slate-800 break-all align-top pt-2">{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Empty / initial state ────────────────────────────────────────────────────

function EmptyState({ onTry }: { onTry: () => void }) {
  return (
    <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="7" />
          <line x1="15.5" y1="15.5" x2="20" y2="20" />
          <line x1="10" y1="7" x2="10" y2="13" />
          <line x1="7" y1="10" x2="13" y2="10" />
        </svg>
      </div>
      <h2 className="text-base font-semibold text-slate-800 mb-2">Validate a NAIS Agent Domain</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-1 leading-relaxed">
        Enter any domain that publishes NAIS DNS records. The validator will check the{' '}
        <code className="font-mono text-xs bg-white border border-slate-200 rounded px-1 py-0.5">_agent.</code> TXT record,
        fetch and parse the <code className="font-mono text-xs bg-white border border-slate-200 rounded px-1 py-0.5">agent.json</code> manifest,
        and report all discovered endpoints, capabilities, and validation issues.
      </p>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        No data is stored. All resolution is performed live via the public NAIS resolver.
      </p>
      <button
        onClick={onTry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="2,1 13,7 2,13" fill="currentColor" />
        </svg>
        Try weatheragent.nais.id
      </button>
    </div>
  );
}

// ─── Inner component that uses useSearchParams ────────────────────────────────

function ValidateInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [domain, setDomain] = useState<string>(searchParams.get('domain') ?? '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResolverResponse | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [rawOpen, setRawOpen] = useState(false);

  const runValidation = useCallback(async (targetDomain: string) => {
    const trimmed = targetDomain.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!trimmed) return;

    setDomain(trimmed);
    setLoading(true);
    setResult(null);
    setNetworkError(null);
    setRawOpen(false);

    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set('domain', trimmed);
    router.replace(url.pathname + url.search, { scroll: false });

    try {
      const res = await fetch(
        `https://resolver.nais.id/resolve.php?domain=${encodeURIComponent(trimmed)}`,
        { headers: { Accept: 'application/json' } }
      );
      if (!res.ok) {
        throw new Error(`Resolver returned HTTP ${res.status}`);
      }
      const data: ResolverResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown network error';
      setNetworkError(`Failed to reach the NAIS resolver: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runValidation(domain);
  };

  const fillDemo = () => {
    setDomain('weatheragent.nais.id');
    runValidation('weatheragent.nais.id');
  };

  // ── Derived state ───────────────────────────────────────────────────────────
  const overallOk = result?.ok && result.manifest?.validation?.valid;
  const hasWarnings = (result?.manifest?.validation?.warnings?.length ?? 0) > 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
            NAIS Domain Validator
          </h1>
          <p className="text-slate-500 leading-relaxed">
            Resolve and validate any NAIS-compliant agent domain in real time.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-stretch">
          <div className="relative flex-1">
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="weatheragent.nais.id"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-mono text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-label="Agent domain to validate"
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !domain.trim()}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
          >
            {loading ? 'Validating\u2026' : 'Validate'}
          </button>
        </form>

        {/* Quick-fill */}
        {!result && !loading && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-slate-400">Try:</span>
            <button
              onClick={fillDemo}
              className="text-xs text-blue-600 hover:text-blue-700 font-mono hover:underline focus:outline-none"
            >
              weatheragent.nais.id
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Network error */}
        {networkError && !loading && (
          <div className="mt-6 flex gap-3 items-start rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <IconFail />
            <div>
              <p className="text-sm font-medium text-red-800">Resolver error</p>
              <p className="text-sm text-red-600 mt-0.5">{networkError}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !result && !networkError && (
          <EmptyState onTry={fillDemo} />
        )}

        {/* Results */}
        {result && !loading && (
          <div className="mt-8 space-y-5" aria-live="polite">

            {/* 1. Summary Banner */}
            <div
              className={`flex items-start gap-4 rounded-xl border px-5 py-4 ${
                result.ok && overallOk
                  ? 'border-green-200 bg-green-50'
                  : hasWarnings && result.ok
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="mt-0.5">
                {overallOk ? <IconOk /> : hasWarnings ? <IconWarn /> : <IconFail />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-semibold text-slate-900 break-all">{result.domain}</span>
                  {result.ok ? (
                    <span className="inline-block rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5 font-medium">Resolved</span>
                  ) : (
                    <span className="inline-block rounded-full bg-red-100 text-red-700 text-xs px-2 py-0.5 font-medium">Failed</span>
                  )}
                  {result.cached && (
                    <span className="inline-block rounded-full bg-slate-100 text-slate-500 text-xs px-2 py-0.5 font-medium">Cached</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Resolver v{result.resolver_version}
                  {result.cached ? ' \u00b7 served from cache' : ' \u00b7 live DNS lookup'}
                  {result.manifest?.validation?.valid
                    ? ' \u00b7 manifest valid'
                    : result.manifest?.fetched
                    ? ' \u00b7 manifest has issues'
                    : ''}
                </p>
                {result.error && (
                  <p className="text-sm text-red-700 mt-1">{result.error}</p>
                )}
              </div>
            </div>

            {/* 2. DNS Discovery */}
            <Section title="DNS Discovery">
              <div className="space-y-4">
                <KVTable rows={([
                  ['agent host', <code key="a" className="font-mono text-xs bg-slate-100 rounded px-1.5 py-0.5 text-slate-700">{result.discovery.agent_txt_host}</code>],
                  ['wallet host', <code key="w" className="font-mono text-xs bg-slate-100 rounded px-1.5 py-0.5 text-slate-700">{result.discovery.wallet_txt_host}</code>],
                  ['payments host', <code key="p" className="font-mono text-xs bg-slate-100 rounded px-1.5 py-0.5 text-slate-700">{result.discovery.payments_txt_host}</code>],
                ] as [string, React.ReactNode][])} />

                {result.dns.agent_records.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                    <IconFail />
                    No _agent TXT records found at this domain.
                  </div>
                ) : (
                  result.dns.agent_records.map((rec, i) => (
                    <div key={i} className="mt-3">
                      <p className="text-xs font-medium text-slate-500 mb-1">_agent TXT record #{i + 1}</p>
                      <pre className="font-mono text-xs bg-slate-900 text-slate-100 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">{rec.raw}</pre>
                      {rec.parsed && Object.keys(rec.parsed).length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-slate-500 mb-2">Parsed fields</p>
                          <KVTable
                            rows={Object.entries(rec.parsed).map(([k, v]) => [
                              k,
                              <span key={k} className="font-mono text-xs text-slate-700">{String(v ?? '')}</span>,
                            ] as [string, React.ReactNode])}
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}

                {result.dns.wallet_records.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-500 mb-1">_wallet TXT records</p>
                    {result.dns.wallet_records.map((rec, i) => (
                      <pre key={i} className="font-mono text-xs bg-slate-900 text-slate-100 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed mb-2">{rec.raw}</pre>
                    ))}
                  </div>
                )}

                {result.dns.payment_records.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-500 mb-1">_payments TXT records</p>
                    {result.dns.payment_records.map((rec, i) => (
                      <pre key={i} className="font-mono text-xs bg-slate-900 text-slate-100 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed mb-2">{rec.raw}</pre>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            {/* 3. Manifest */}
            <Section title="Manifest">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {result.manifest.fetched && result.manifest.http_status === 200 ? <IconOk /> : <IconFail />}
                  <div>
                    <span className="text-sm text-slate-700">
                      HTTP {result.manifest.http_status ?? 'N/A'}
                      {result.manifest.fetched ? ' \u2014 fetched successfully' : ' \u2014 fetch failed'}
                    </span>
                    {result.manifest.error && (
                      <p className="text-xs text-red-600 mt-0.5">{result.manifest.error}</p>
                    )}
                  </div>
                </div>

                {result.resolved.manifest_url && (
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Manifest URL</span>
                    <a
                      href={result.resolved.manifest_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block font-mono text-xs text-blue-600 hover:underline break-all mt-0.5"
                    >
                      {result.resolved.manifest_url}
                    </a>
                  </div>
                )}

                {result.manifest.data && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-500 mb-2">Key fields</p>
                    <KVTable rows={([
                      ['standard', <span key="s" className="text-sm text-slate-800">{String(result.manifest.data.standard ?? result.manifest.data.nais ?? '\u2014')}</span>],
                      ['id / domain', <span key="id" className="font-mono text-xs text-slate-700">{String(result.manifest.data.id ?? result.manifest.data.domain ?? '\u2014')}</span>],
                      ['name', <span key="n" className="text-sm text-slate-800">{String(result.manifest.data.name ?? '\u2014')}</span>],
                      ['description', <span key="d" className="text-sm text-slate-600 leading-relaxed">{String(result.manifest.data.description ?? '\u2014')}</span>],
                      ['version', <span key="v" className="font-mono text-xs text-slate-700">{String(result.manifest.data.version ?? '\u2014')}</span>],
                    ] as [string, React.ReactNode][])} />
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  {result.manifest.validation?.valid ? <IconOk /> : <IconFail />}
                  <span className="text-sm text-slate-700">
                    {result.manifest.validation === null
                      ? 'Manifest could not be validated'
                      : result.manifest.validation.valid
                      ? 'Manifest is valid'
                      : 'Manifest has validation errors'}
                  </span>
                </div>
              </div>
            </Section>

            {/* 4. Endpoints */}
            <Section title="Endpoints">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {result.resolved.mcp_endpoint ? <IconOk /> : <IconGray />}
                  <div>
                    <span className="text-xs font-medium text-slate-500">MCP Endpoint</span>
                    {result.resolved.mcp_endpoint ? (
                      <a href={result.resolved.mcp_endpoint} target="_blank" rel="noopener noreferrer" className="block font-mono text-xs text-blue-600 hover:underline break-all">{result.resolved.mcp_endpoint}</a>
                    ) : (
                      <p className="text-xs text-slate-400">Not declared</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {result.resolved.auth && result.resolved.auth.length > 0 ? <IconOk /> : <IconGray />}
                  <div>
                    <span className="text-xs font-medium text-slate-500">Auth Methods</span>
                    {result.resolved.auth && result.resolved.auth.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.resolved.auth.map(a => (
                          <span key={a} className="inline-block rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2 py-0.5 font-mono">{a}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">None declared</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {result.resolved.payments && result.resolved.payments.length > 0 ? <IconOk /> : <IconGray />}
                  <div>
                    <span className="text-xs font-medium text-slate-500">Payment Methods</span>
                    {result.resolved.payments && result.resolved.payments.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.resolved.payments.map(p => (
                          <span key={p} className="inline-block rounded-full bg-green-50 border border-green-200 text-green-700 text-xs px-2 py-0.5 font-mono">{p}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">None declared</p>
                    )}
                  </div>
                </div>
              </div>
            </Section>

            {/* 5. Capabilities */}
            {(() => {
              const caps = result.manifest.data?.capabilities;
              if (!Array.isArray(caps) || caps.length === 0) return null;
              return (
                <Section title="Capabilities">
                  <ul className="space-y-3">
                    {(caps as Array<Record<string, unknown>>).map((cap, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <IconOk />
                        <div>
                          <span className="font-mono text-sm font-medium text-slate-800">{String(cap.name ?? `capability-${i}`)}</span>
                          {cap.description ? (
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{String(cap.description)}</p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>
              );
            })()}

            {/* 6. Validation Messages */}
            {result.manifest.validation && (result.manifest.validation.errors.length > 0 || result.manifest.validation.warnings.length > 0) && (
              <Section title="Validation Messages">
                <div className="space-y-2">
                  {result.manifest.validation.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      <IconFail />
                      <span>{err}</span>
                    </div>
                  ))}
                  {result.manifest.validation.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <IconWarn />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 7. Raw Response */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setRawOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={rawOpen}
              >
                <span className="text-sm font-semibold text-slate-700">View raw response</span>
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform ${rawOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <polyline points="3,6 8,11 13,6" />
                </svg>
              </button>
              {rawOpen && (
                <div className="border-t border-slate-200">
                  <pre className="overflow-x-auto bg-slate-900 text-slate-100 text-xs font-mono p-5 leading-relaxed max-h-[32rem]">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page export with Suspense boundary (required for useSearchParams) ────────

export default function ValidatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="mb-8">
            <div className="h-9 w-64 bg-slate-200 rounded animate-pulse mb-3" />
            <div className="h-5 w-96 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-11 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
    }>
      <ValidateInner />
    </Suspense>
  );
}
