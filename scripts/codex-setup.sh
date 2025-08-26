#!/usr/bin/env bash
set -euo pipefail
echo "⏳ Codex setup…"
if command -v corepack >/dev/null 2>&1; then
  corepack enable
  corepack prepare yarn@4.9.1 --activate
fi
echo "📦 Installing (immutable)…"
if [ -f package.json ]; then
  yarn install --immutable --inline-builds || true
fi
echo "✅ Done."
