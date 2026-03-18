# NAIS — Network Agent Identity Standard

NAIS defines a universal identity and resolution layer for agents, services, and users using DNS and HTTPS.

## What is NAIS?

NAIS is an open, vendor-neutral standard that enables:

- **Agent identity** — domain-based identity for AI agents
- **DNS discovery** — `_agent` TXT records for metadata resolution
- **Manifest publishing** — `/.well-known/agent.json` for capabilities, auth, and payment info
- **MCP endpoint discovery** — standard endpoint for agent interaction
- **Wallet authentication** — optional challenge-response auth via wallet signatures
- **x402 payments** — optional HTTP 402-based payment flows

## Repository Structure

This repository contains the **nais.id website** — the public-facing documentation, validator, and reference content for the NAIS standard.

```
src/
├── app/
│   ├── page.tsx             # Home page
│   ├── spec/page.tsx        # Full specification
│   ├── quickstart/page.tsx  # Getting started guide
│   ├── demo/page.tsx        # Live demo (weatheragent.nais.id)
│   ├── validate/page.tsx    # Domain validator
│   ├── sdks/page.tsx        # SDK documentation
│   ├── examples/page.tsx    # Example implementations
│   ├── faq/page.tsx         # FAQ
│   └── governance/page.tsx  # Governance model
├── components/
│   ├── Nav.tsx              # Navigation
│   ├── Footer.tsx           # Footer
│   ├── DocLayout.tsx        # Documentation layout
│   └── CodeBlock.tsx        # Syntax-highlighted code blocks
public/                      # Static assets
```

## Tech Stack

- Next.js 14 (static export)
- React 18
- TypeScript
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the site locally.

## Build

```bash
npm run build
```

Static output is generated in the `out/` directory.

## Related Repositories

| Repository | Description |
|------------|-------------|
| [spec](https://github.com/nais-standard/spec) | Formal NAIS specification |
| [resolver](https://github.com/nais-standard/resolver) | Reference resolver implementation |
| [clients](https://github.com/nais-standard/clients) | SDKs for JavaScript, Python, and PHP |
| [examples](https://github.com/nais-standard/examples) | Demo agents and integration patterns |
| [naips](https://github.com/nais-standard/naips) | NAIS Improvement Proposals |

## License

Open standard. See [governance](https://nais.id/governance) for contribution guidelines.
