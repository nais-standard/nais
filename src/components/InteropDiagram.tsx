/**
 * Hero centerpiece: the NAIS resolution flow, top → bottom, as one legible story:
 *   any AI agent → ① discovers domain → DNS TXT (trusted key) → ② fetches signed
 *   card → ③ card's signature matches the DNS key → trusted, safe to call MCP.
 * The same key fingerprint appears in the DNS record and the card (matching cyan)
 * so the verification is visible. Pure HTML/CSS; pulses freeze under
 * prefers-reduced-motion (see globals.css).
 */

function NaisMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect width="20" height="20" rx="5" fill="#2563eb" />
      <path d="M5 14V6h1.5l4 5.5V6H12v8h-1.5L6.5 8.5V14H5z" fill="white" fillRule="evenodd" />
    </svg>
  );
}

/** Numbered connector between flow stages, with a downward pulse. */
function FlowStep({ n, label, accent = false }: { n: string; label: string; accent?: boolean }) {
  return (
    <div className="relative my-0.5 flex h-10 w-px items-center justify-center bg-gradient-to-b from-white/5 via-blue-400/40 to-white/5">
      <span
        className="flow-dot absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full bg-cyan-300"
        style={{ boxShadow: '0 0 8px 1px rgba(34,211,238,0.7)' }}
      />
      <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-ink-950 px-2.5 py-0.5 text-[0.7rem] text-slate-300">
        <span
          className={`flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-full border text-[0.6rem] font-semibold ${
            accent ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300' : 'border-white/15 bg-white/5 text-slate-400'
          }`}
        >
          {n}
        </span>
        {label}
      </span>
    </div>
  );
}

export default function InteropDiagram() {
  return (
    <div className="mx-auto w-full max-w-[400px] min-w-0 select-none" aria-hidden="true">
      <div className="flex flex-col items-center">
        {/* Actor */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-200">
          <span className="flex -space-x-1">
            <i className="h-2.5 w-2.5 rounded-full bg-blue-400 ring-2 ring-ink-950" />
            <i className="h-2.5 w-2.5 rounded-full bg-violet ring-2 ring-ink-950" />
            <i className="h-2.5 w-2.5 rounded-full bg-cyan-300 ring-2 ring-ink-950" />
          </span>
          any AI agent
        </div>

        <FlowStep n="1" label="discovers domain" />

        {/* DNS TXT record — read first; carries the trusted key */}
        <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[0.64rem] font-medium uppercase tracking-wider text-slate-500">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <circle cx="8" cy="3.5" r="2" />
              <path d="M8 5.5V14M3 9a5 5 0 0010 0M3 9H1.5M13 9h1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            DNS record
          </div>
          <div className="truncate font-mono text-[0.72rem] text-slate-400">_agent.weatheragent.link &nbsp;TXT</div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="truncate font-mono text-[0.72rem]">
              <span className="text-slate-500">k=</span>
              <span className="text-cyan-300">ed25519:Bx91kQz3vR7w…</span>
            </span>
            <span className="flex-shrink-0 text-[0.6rem] text-slate-600">trusted key</span>
          </div>
        </div>

        <FlowStep n="2" label="fetches signed card" />

        {/* The signed agent card — focal object */}
        <div className="relative w-full">
          <div
            className="pointer-events-none absolute -inset-3 rounded-3xl opacity-70 blur-2xl"
            style={{ background: 'radial-gradient(60% 60% at 50% 40%, rgba(124,58,237,0.32), transparent 70%)' }}
          />
          <div className="card-dark relative w-full p-4" style={{ borderColor: 'rgba(124,58,237,0.45)' }}>
            <div className="flex items-center gap-2.5">
              <NaisMark />
              <span className="min-w-0 flex-1 truncate font-mono text-[0.95rem] font-semibold text-white">
                weatheragent.link
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[0.7rem] font-semibold text-cyan-300">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M2 6.5l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                signed
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-[0.7rem]">
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-[4.75rem] flex-shrink-0 text-slate-500">signed by</span>
                <span className="min-w-0 flex-1 truncate font-mono text-cyan-300">ed25519:Bx91kQz3vR7w…</span>
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <span className="w-[4.75rem] flex-shrink-0 text-slate-500">endpoint</span>
                <span className="min-w-0 flex-1 truncate font-mono text-blue-300">https://weatheragent.link/mcp</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-slate-500">capabilities</span>
              {['forecast', 'alerts', 'radar'].map((t) => (
                <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[0.7rem] text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <FlowStep n="3" label="signature matches the DNS key" accent />

        {/* Result: trusted → call */}
        <div className="w-full rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill="rgba(16,185,129,0.18)" stroke="rgba(52,211,153,0.5)" />
              <path d="M5 8l2 2 4-4.5" fill="none" stroke="#6ee7b7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold text-emerald-300">Trusted — safe to call</span>
          </div>
          <div className="mt-1 truncate pl-[1.4rem] font-mono text-[0.72rem] text-slate-400">
            → https://weatheragent.link/mcp
          </div>
        </div>

        <div className="mt-3 text-center text-[0.72rem] leading-relaxed text-slate-500">
          Only the domain owner controls DNS — so a forged card can&apos;t match the key, and never gets called.
        </div>
      </div>
    </div>
  );
}
