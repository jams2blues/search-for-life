# CODEX_ENVIRONMENT — ZeroUnbound • Search for Life

These settings mirror the OpenAI Codex "Environment Configuration" panel.

## Container
- **Container image**: `universal` (Ubuntu 24.04)
- **Packages**: `Preinstalled packages` ✓
- **Agent internet access**: **On**
- **Domain allowlist**: **All (unrestricted)**
- **Environment variables** (optional, redacted in public repos):
  - `OPENAI_API_KEY` — if your agent calls the API on sub‑tasks.
  - `TZ` set to `UTC` for deterministic timestamps.

## Caching
- **Container Caching**: **On**
  - Setup script runs once per cache. Maintenance runs on each reuse.

## Setup Script (Manual)
```bash
#!/usr/bin/env bash
set -euo pipefail
./scripts/codex-setup.sh
```

## Maintenance Script
```bash
#!/usr/bin/env bash
set -euo pipefail
./scripts/codex-maintenance.sh
```

## Files Codex must read at boot
1. `AGENTS.md`
2. `docs/Master_Overview_And_Manifest_SFL.md`
3. `docs/CODEX_ENVIRONMENT.md`
4. `docs/prompts/SFL_Codex_SuperPrompt.md`
5. `docs/prompts/SFL_Codex_Task_Template.md`
6. `docs/prompts/tasks/*.md` (when present)

## Local development helpers
- `.gitattributes` forces LF endings (deterministic hashing).
- `.editorconfig` standardises style.
