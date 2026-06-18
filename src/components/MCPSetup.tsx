'use client';
import { useState } from 'react';
import CodeBlock from './CodeBlock';

/**
 * Tabbed install snippet for the NAIS gateway across MCP-capable clients.
 * The gateway is a standard stdio MCP server, so any host that speaks MCP can run it.
 */
const SETUPS = [
  {
    id: 'claude',
    label: 'Claude Code',
    language: 'bash',
    filename: 'terminal',
    code: 'claude mcp add nais -- npx -y @nais-standard/mcp',
  },
  {
    id: 'config',
    label: 'Cursor · Claude Desktop · VS Code',
    language: 'json',
    filename: 'mcp config',
    code: `{
  "mcpServers": {
    "nais": {
      "command": "npx",
      "args": ["-y", "@nais-standard/mcp"]
    }
  }
}`,
  },
];

export default function MCPSetup() {
  const [active, setActive] = useState(0);
  const s = SETUPS[active];

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1">
        {SETUPS.map((setup, i) => (
          <button
            key={setup.id}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              active === i
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            {setup.label}
          </button>
        ))}
      </div>
      <CodeBlock code={s.code} language={s.language} filename={s.filename} />
    </div>
  );
}
