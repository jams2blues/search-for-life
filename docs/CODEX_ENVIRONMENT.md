# CODEX Environment — ZeroUnbound / Search for Life
**Mode:** _Single-file, fully on-chain HTML_. No external deps required.

## Required Codex Settings (UI → Environments → _search-for-life_)
- **Container image:** `universal` (preinstalled packages)
- **Container caching:** `On`
- **Agent internet access:** `On` (only used if Node is missing)
- **Domain allowlist:** `All` (unused by this repo)
- **Environment variables / Secrets:** _none needed_

## Scripts (paste into Codex UI)

### Setup script (Manual)
```bash
set -Eeuo pipefail
bash scripts/codex-setup.sh
```

### Maintenance script
```bash
set -Eeuo pipefail
bash scripts/codex-maintenance.sh
```

> **Why this works:** our repo is a single inline HTML artifact with
> no `package.json`. The setup script performs **no heavy installs**,
> avoids `apt-get` (which can cause terminal disconnects), and only
> installs Node if truly missing. Corepack/Yarn are enabled when present.

## Troubleshooting
- **Red “Terminal errored” at the end of test:** this is often a UI
  disconnect caused by long `apt-get` output (e.g., Chromium downloads).
  Use the minimal scripts above — no apt steps, tiny output, stable exit.
- **Want to run headless tests?** Add a separate task step; keep setup
  minimal so container caching remains hot and reliable.

## Deterministic Inputs for Agents
Agents must **read**:
- `docs/Master_Overview_And_Manifest_SFL.md`
- `AGENTS.md`
- `docs/prompts/SFL_Codex_SuperPrompt.md`
- `docs/prompts/tasks/*`

Agents must **respect**:
- Fully on-chain, inline HTML. No external URLs/CDNs/IPFS.
- Deterministic PRNG seeded by `tokenData.hash` or query param.
- Frame-rate governor compatible with low‑end devices.

