#!/usr/bin/env bash
set -euo pipefail
echo "🔁 Codex maintenance…"
if [ -f package.json ]; then
  if yarn -v >/dev/null 2>&1; then
    yarn lint || true
    yarn test || true
  fi
fi
echo "✅ Maintenance complete."
