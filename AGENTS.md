# AGENTS.md — Search for Life (SFL)

## Boot Sequence
1. Read `docs/MASTER_Overview_And_Manifest_SFL.md` completely.
2. Read `docs/CODEX_ENVIRONMENT.md` to align your tools.
3. Read `docs/prompts/SFL_Codex_SuperPrompt.md` and obey invariants.
4. For each task, consume a `docs/prompts/tasks/*.md` or a User Task
   message formatted per `docs/prompts/SFL_Codex_Task_Template.md`.

## Prime Directives
- **Determinism**: all randomness goes through the seeded Random class (sfc32 x2).
- **Single-file artifact**: `SearchForLife_v10_infinite.html` remains fully inline
  (CSP safe, no external calls). Keep it compile‑clean and lint‑clean.
- **Performance budget**: 60 FPS on modern desktops; 30 FPS on mid‑range mobile.
  Provide dynamic quality tiers + frame‑time governor.
- **UX**: Resolution‑agnostic HUD, non‑inverted mouse by default, toggle supported.
- **Safety**: Never fetch remote resources; zero network dependencies.
- **Compatibility**: Vanilla WebGL2 + Canvas2D only; no third‑party libs.
- **Persistence**: Sector/Universe determinism via integer hash grid.

## Output Contract
- Produce diffs or full files as requested. For full files: INLINE‑SAFE HTML/JS only.
- Keep functions pure where feasible; document side effects.
- Tests: ship built‑in self‑tests that render hidden off‑screen frames and assert
  non‑black buffers for sanity.
