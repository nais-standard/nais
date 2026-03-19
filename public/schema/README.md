# NAIS Agent Manifest Schema

The canonical JSON Schema for the **Network Agent Identity Standard (NAIS)** agent manifest.

## Published At

| Resource | URL |
|----------|-----|
| Schema | `https://nais.id/schema/agent.json` |
| Valid example | `https://nais.id/schema/examples/agent-valid.json` |
| Invalid example | `https://nais.id/schema/examples/agent-invalid.json` |

## What It Validates

This schema defines the structure of a NAIS agent manifest — the JSON document published at:

```
https://<agent-domain>/.well-known/agent.json
```

Every NAIS-compliant agent publishes this manifest so that clients, registries, and other agents can discover its identity, capabilities, authentication requirements, and payment terms through a single machine-readable file.

## Schema Version

- **JSON Schema dialect:** Draft 2020-12
- **NAIS standard version:** `nais/0.1`

The schema is versioned alongside the NAIS specification. Breaking changes will be introduced under a new standard version string (e.g., `nais/1.0`). Non-breaking additions (new optional fields) may be added within a minor version.

## Required vs Optional Fields

### Required

| Field | Description |
|-------|-------------|
| `standard` | NAIS version string (e.g., `"nais/0.1"`) |
| `id` | Canonical domain identity of the agent |
| `name` | Human-readable agent name |
| `service` | Service endpoints (must include `mcp_endpoint`) |

### Optional

| Field | Description |
|-------|-------------|
| `description` | Human-readable description |
| `version` | Manifest version (semver) |
| `owner` | Ownership identity (org, wallet, or individual) |
| `auth` | Authentication configuration (if present, `methods` is required) |
| `capabilities` | Array of tools/functions the agent exposes |
| `payment` | Payment configuration (if present, `methods` is required) |
| `proofs` | DNS or cryptographic identity proofs |
| `tags` | Freeform discovery tags |
| `license` | SPDX license identifier |
| `contact` | Operator contact info |
| `source` | Source code repository URL |
| `updated_at` | ISO 8601 timestamp of last manifest update |

## Conditional Requirements

- If `auth` is present, `auth.methods` is **required**.
- If `payment` is present, `payment.methods` is **required**.
- If `owner.wallets` is present, each wallet must include `chain` and `address`.

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
| `WalletIdentity` | `Owner.wallets[]` |
| `Service` | `service` |
| `Auth` | `auth` |
| `Capability` | `capabilities[]` |
| `CapabilityPricing` | `Capability.pricing` |
| `Payment` | `payment` |
| `FreeTier` | `Payment.free_tier` |
| `X402Config` | `Payment.x402` |
| `Proof` | `proofs[]` |
| `Contact` | `contact` |

These definitions can be referenced externally via JSON Pointer:

```
https://nais.id/schema/agent.json#/$defs/WalletIdentity
```

## Design Principles

1. **Strict enough to validate, loose enough to adopt.** Required fields are minimal. Optional fields are well-typed but not overly constrained.
2. **No unknown top-level properties.** The schema uses `additionalProperties: false` at the top level to catch typos and discourage ad-hoc extensions.
3. **Forward-compatible.** New optional fields can be added without breaking existing manifests. Breaking changes require a new `standard` version.
4. **Wallet-native.** Wallet identity and payment are first-class schema concepts, not afterthoughts.

## Related Resources

- [NAIS Specification](https://nais.id/spec)
- [NAIS Quickstart](https://nais.id/quickstart)
- [NAIS Resolver](https://resolver.nais.id)
- [NAIS Agent Registry](https://agents.nais.id)
