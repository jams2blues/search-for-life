#!/usr/bin/env bash
# Developed by @jams2blues — ZeroContract Studio
# File: scripts/codex-maintenance.sh
# Rev : r6 2025-08-26
# Summary: Idempotent maintenance for warm containers. Verifies toolchain,
#          prints versions, and ensures previous setup completed.

set -Eeuo pipefail
trap 'echo "✖ Maintenance failed at line $LINENO" >&2; exit 1' ERR

log(){ printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }

# Locate repo root again (same heuristic as setup script)
REPO_ROOT="/workspace"
if [[ -d /workspace ]]; then
  first_sub=$(ls -1d /workspace/*/ 2>/dev/null | head -n1 || true)
  if [[ -n "${first_sub:-}" ]]; then
    REPO_ROOT="${first_sub%/}"
  fi
fi
cd "$REPO_ROOT" || cd /workspace || true

log "🔁 ZeroUnbound Codex maintenance…"
[[ -f .codex-setup.ok ]] || log "ℹ Setup marker missing (cold container); proceeding."

if command -v node >/dev/null 2>&1; then
  log "🐣 Node $(node -v)"
fi
if command -v yarn >/dev/null 2>&1; then
  log "🧶 Yarn $(yarn -v)"
fi

log "✅ Maintenance complete."
