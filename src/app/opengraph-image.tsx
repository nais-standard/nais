import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'NAIS — Network Agent Identity Standard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: '#2563eb',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24,
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            N
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              fontFamily: 'monospace',
            }}
          >
            NAIS
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.1,
            margin: 0,
            marginBottom: 24,
            letterSpacing: '-0.03em',
            maxWidth: 800,
          }}
        >
          Open identity for the agent internet
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: '#475569',
            margin: 0,
            marginBottom: 48,
          }}
        >
          Websites use domains. Agents should too.
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['DNS Discovery', 'agent.json', 'MCP', 'Open Standard'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '8px 16px',
                background: '#eff6ff',
                color: '#1d4ed8',
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            fontSize: 20,
            color: '#94a3b8',
            fontFamily: 'monospace',
          }}
        >
          nais.id
        </div>
      </div>
    ),
    { ...size }
  );
}
