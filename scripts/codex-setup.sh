#!/usr/bin/env bash
# Developed by @jams2blues — ZeroContract Studio
# File: scripts/codex-setup.sh
# Rev : r6 2025-08-26
# Summary: Minimal, deterministic bootstrap for static on-chain repos running in Codex.
#          Handles both package and single-file projects. Avoids relying on $BASH_SOURCE
#          because Codex injects scripts via temp files.

set -Eeuo pipefail
trap 'echo "✖ Setup failed at line $LINENO" >&2; exit 1' ERR

log(){ printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }

# 0) Locate repo root (Codex clones into /workspace/<repo>)
REPO_ROOT="/workspace"
if [[ -d /workspace ]]; then
  first_sub=$(ls -1d /workspace/*/ 2>/dev/null | head -n1 || true)
  if [[ -n "${first_sub:-}" ]]; then
    REPO_ROOT="${first_sub%/}"
  fi
fi
cd "$REPO_ROOT" || cd /workspace || true

log "⏳ ZeroUnbound Codex bootstrap (static, on-chain project)"

# 1) Ensure Node/Corepack/Yarn available and pinned
if command -v node >/dev/null 2>&1; then
  log "🐣 Node: $(node --version)"
else
  log "⚠ Node not found; environment should provide Node v22"
fi

if command -v corepack >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || true
  corepack prepare yarn@4.9.1 --activate >/dev/null 2>&1 || true
fi
if command -v yarn >/dev/null 2>&1; then
  log "🧶 Yarn: $(yarn --version)"
fi

# 2) Install deps when a package.json exists; otherwise skip (single-file project)
if [[ -f package.json ]]; then
  log "📦 Installing (immutable)…"
  yarn install --immutable --inline-builds
else
  log "📦 No package.json — nothing to install (single-file project)."
fi

# 3) Touch success marker for maintenance phase
echo "ok $(date -u +%Y-%m-%dT%H:%M:%SZ)" > .codex-setup.ok

log "✅ Setup complete."
