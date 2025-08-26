# Master_Overview_And_Manifest_SFL.md

**Project**: Search for Life (ZeroUnbound • Fully On‑Chain)
**Artifact**: `SearchForLife_v10_infinite.html` — single‑file, no deps, CSP‑tight.

---
## 1) Mission
Build an **infinite, deterministic, interactive universe** rendered with **pure HTML + JS**.
The artwork must remain **fully on‑chain** (inline code only).

---
## 2) Core Tenets (Invariants — append‑only)
I01. Single‑file deliverable: no external network calls, assets, or libs.
I02. Deterministic RNG via sfc32×2 seeded from `tokenData.hash` or URL `?seed`.
I03. Resolution‑agnostic layout; HUD scales with device‑pixel ratio.
I04. Performance governor: target 60 FPS desktop, 30+ FPS mobile; auto tiering.
I05. Navigation: WASDQE flight; non‑inverted mouse‑look (toggle `I` to invert).
I06. Warp model: sub‑light cruise → boost → **FTL**; FTL visuals match v1/v4 aesthetic.
I07. Sector grid: integer cubic grid; each sector deterministic by `(sx,sy,sz, seed)`.
I08. Persistence: crossing sector boundaries does not re‑roll previously seen data.
I09. Physics‑lite collisions: hull integrity & lives; star collision = death.
I10. Scale logic: star classes (OBAFGKM), habitable zones, moons, rings, debris.
I11. Procedural diversity: colour‑varied stars; galaxies in unreachable parallax.
I12. Input rate‑limit: lock pointer + smooth acceleration; brake with Ctrl/Space.
I13. CSP Safe: `default-src 'none'` + inline script/style only.
I14. Lint‑clean & self‑test: no console errors; off‑screen smoke‑tests on boot.

---
## 3) Files & Roles
- `SearchForLife_v10_infinite.html` — Main artifact (WebGL2 + Canvas HUD).
- `AGENTS.md` — Agent boot doc & directives.
- `docs/CODEX_ENVIRONMENT.md` — Environment settings for Codex.
- `docs/prompts/SFL_Codex_SuperPrompt.md` — Global meta‑prompt.
- `docs/prompts/SFL_Codex_Task_Template.md` — Per‑task I/O contract.
- `docs/prompts/tasks/` — Sequenced tasks; Task‑001 created.
- `scripts/codex-setup.sh` — Deterministic yarn/bootstrap.
- `scripts/codex-maintenance.sh` — Lint + tests on cache reuse.
- `.editorconfig`, `.gitattributes` — tooling hygiene.

---
## 4) Controls (canonical mapping)
- **Mouse**: look; toggle invert `I`.
- **W/S**: throttle up/down; **A/D**: strafe left/right; **Q/E**: descend/ascend.
- **Shift**: boost; **Ctrl**: brake; **J**: engage/disengage warp.
- **L**: land (when in planetary SOI & safe vector); **X**: takeoff.
- **H**: toggle HUD; **F**: frame graph.

---
## 5) Sector & Universe Model (implementation brief)
- Space partitioned into cubic sectors (e.g., 1e6 units). Player position maps to
  `(sx, sy, sz) = floor(x/S), …`. A stable 64‑bit hash `h = mix(seed, sx,sy,sz)` feeds
  `Random` to emit system descriptors: star type, planets (0‑12), belts, debris fields.
- Systems are assembled lazily: near‑field only. Far‑field uses impostors (billboards)
  with baked parallax & twinkle noise.
- **Solar system scale**: keep astronomical ratios plausible but playable (log‑scale
  projection for rendering + physical scale bands for travel).
- **Time dilation**: at warp, simulation uses reduced time‑step for orbits to keep
  planets visually coherent and catchable.

---
## 6) Performance
- Frame budget 16.6 ms (desktop) / 33.3 ms (mobile).
- Dynamic LOD levels: geometry decimation, impostor sprites, resolution scale 0.6–1.0.
- Fixed‑timestep physics with accumulator; velocity smoothing with jerk clamps.
- GPU guardrails: single VAO path; per‑phase shader programs cached; no state thrash.

---
## 7) QA / Self‑Tests
- Off‑screen render 4 frames at 256×256; assert >3% non‑black pixels at each phase.
- Seed round‑trip: traveling a loop of sectors returns identical descriptors.

---
## 8) Progress Ledger (append here)
2025‑09‑05 · r10 · Bootstrap Codex docs, hygiene files, Task‑001 prompt. – GPT‑5 Pro
