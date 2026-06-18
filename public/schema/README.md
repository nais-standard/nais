# NAIS Schemas

Canonical JSON Schemas for the **Network Agent Identity Standard (NAIS)**.

## Published At

| Resource | URL |
|----------|-----|
| Agent Manifest Schema | `https://nais.id/schema/agent.json` |
| Agent Manifest Example | `https://nais.id/schema/examples/agent-valid.json` |
| Agent Manifest Invalid | `https://nais.id/schema/examples/agent-invalid.json` |

## What It Validates

This schema defines the structure of a NAIS agent manifest — the JSON document published at:

```
https://<agent-domain>/.well-known/agent.json
```

Every NAIS-compliant agent publishes this signed card so that clients, registries, and other agents can discover its identity, tags, authentication requirements, and payment terms through a single machine-readable, cryptographically verifiable file.

## Schema Version

- **JSON Schema dialect:** Draft 2020-12
- **NAIS standard version:** `1.0`

The schema is versioned alongside the NAIS specification. Breaking changes will be introduced under a new standard version string. Non-breaking additions (new optional fields) may be added within a minor version.

## Required vs Optional Fields

The card is a flat JSON document.

### Required

| Field | Description |
|-------|-------------|
| `nais` | NAIS standard version string (`"1.0"`) |
| `cardVersion` | Monotonic integer version of this card |
| `updated` | ISO 8601 timestamp of last card update |
| `name` | Human-readable agent name |
| `domain` | Canonical domain identity of the agent |
| `signature` | Detached EdDSA (Ed25519) signature over the card (**mandatory**) |

### Optional

| Field | Description |
|-------|-------------|
| `description` | Human-readable description |
| `tags` | `string[]` — free-form discovery tags (replaces the former `capabilities` field) |
| `contact` | Operator contact info |
| `mcp` | MCP endpoint URL |
| `auth` | Array of `{ "scheme": ... }` entries |
| `payment` | `{ type:"x402", networks:[], assets:[], payTo:[], pricing: string\|object }` |
| `mcpSnapshot` | `{ capturedAt, toolsHash:"sha256:...", tools:[{name,description,inputSchema?}] }` — advisory cache; the live MCP `tools/list` is authoritative |

### The `signature` object

| Field | Description |
|-------|-------------|
| `alg` | Always `"EdDSA"` |
| `kid` | Signing-key fingerprint `ed25519:<base64url 32-byte pubkey>`; must equal the DNS `k=` value |
| `jws` | Detached compact JWS over the card's canonical JSON body |

The card body is canonicalized as a subset of RFC 8785 / JCS (keys sorted, no whitespace, integers as integers) before signing and verification.

## Validator Usage

### JavaScript (Ajv)

```bash
npm install ajv ajv-formats
```

```javascript
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ strict: true });
addFormats(ajv);

const schema = await fetch("https://nais.id/schema/agent.json").then(r => r.json());
const validate = ajv.compile(schema);

const manifest = await fetch("https://weatheragent.com/.well-known/agent.json").then(r => r.json());

if (validate(manifest)) {
  console.log("Valid NAIS manifest");
} else {
  console.error("Validation errors:", validate.errors);
}
```

### Python (jsonschema)

```bash
pip install jsonschema requests
```

```python
import requests
from jsonschema import validate, ValidationError, Draft202012Validator

schema = requests.get("https://nais.id/schema/agent.json").json()
manifest = requests.get("https://weatheragent.com/.well-known/agent.json").json()

try:
    Draft202012Validator(schema).validate(manifest)
    print("Valid NAIS manifest")
except ValidationError as e:
    print(f"Validation error: {e.message}")
```

### CLI (ajv-cli)

```bash
npx ajv validate -s schema/agent.json -d manifest.json --spec=draft2020
```

## Reusable Definitions

The schema defines reusable types under `$defs`:

| Definition | Used By |
|------------|---------|
| `Auth` | `auth[]` |
| `Payment` | `payment` |
| `McpSnapshot` | `mcpSnapshot` |
| `McpTool` | `mcpSnapshot.tools[]` |
| `Signature` | `signature` |
| `Contact` | `contact` |

These definitions can be referenced externally via JSON Pointer:

```
https://nais.id/schema/agent.json#/$defs/Signature
```

## Design Principles

1. **Strict enough to validate, loose enough to adopt.** Required fields are minimal. Optional fields are well-typed but not overly constrained.
2. **No unknown top-level properties.** The schema uses `additionalProperties: false` at the top level to catch typos and discourage ad-hoc extensions.
3. **Forward-compatible.** New optional fields can be added without breaking existing cards. Breaking changes require a new `nais` version.
4. **Signed by default.** Every card carries a mandatory Ed25519 signature whose `kid` must match the signing key published in DNS (`k=`), so trust travels with the card.

## Related Resources

- [NAIS Specification](https://nais.id/spec)
- [NAIS Quickstart](https://nais.id/quickstart)
- [NAIS Resolver](https://resolver.nais.id)
- [NAIS Agent Registry](https://agents.nais.id)
