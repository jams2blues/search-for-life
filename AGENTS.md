# AGENTS.md — Search for Life (SFL) · Codex Agent Handbook
**Repo:** `search-for-life` • **Mode:** single-file, fully inline HTML/JS (no external deps)  
**Owner:** @jams2blues • **Agent:** OpenAI Codex (multi-agent capable)

---

## 0) Prime Directives (Invariants)
These rules **always** apply. Never regress them. Append to this list as new constraints emerge.
1. **Single-file artifact:** The mintable artwork is one deterministic, **self-contained** HTML file with inline `<script>` and `<style>` only. No external network calls, CDNs, fonts, images, WASM or workers. CSP must enforce this (`default-src 'none' ; img-src data: ; style-src 'unsafe-inline' ; script-src 'unsafe-inline'`).  
2. **Determinism:** All randomness must route through a **seeded PRNG** (sfc32/JS) keyed by a 128‑bit hex hash `seed` (+ optional salt like tokenId). Given the same seed and camera input stream, results are bit‑for‑bit identical. No `Math.random`.  
3. **Resolution agnostic:** Visuals, input regions and HUD must scale to viewport and DPR. No fixed pixel constants for layout.  
4. **Performance budget:** On desktop target (high‑end GPU) aim **60 FPS**; gracefully tier features for mid/low devices via an auto **QoS ladder** (60▶48▶30▶24 FPS). Tiering may reduce LOD, particle counts, shader quality, and star/galaxy density, never gameplay.  
5. **Streaming universe:** Space is infinite & continuous by **chunked generation** (deterministic by integer sector coords + seed). Use floating‑origin and precision rebasing. No hard seams; adjacent sectors share boundary continuity (e.g., blue‑noise jitter with shared keys).  
6. **Physics scale:** Units are **kilometers**; time step is real seconds (smoothed/clamped). Speeds range from m/s (landed) to **FTL** (fractional c in warp). Collisions with suns/asteroids do hull damage; zero lives ⇒ reset at last safe state.  
7. **UX:** Pointer‑lock mouselook; **WASD/QE** 6‑DOF thrusters; **Shift** boost; **Ctrl** brake; **J** enter/exit warp; **L** land; **X** takeoff; **I** invert Y; **H** HUD; **F** framegraph. All rebindable via an in‑HUD menu.  
8. **Aesthetics:** Not photoreal; stylised “Jams2blues hyper‑rainbow cosmic noir.” Star temperature drives color; galaxies swirl; wormhole has chromatic aberration & blue/red‑shift streaks; rings can be rainbow; planets may be earthlike (rare) or exotic.  
9. **No libraries:** Author everything in vanilla Canvas2D+WebGL2 (fallback to Canvas2D when WebGL unavailable).  
10. **Mint‑safe:** Embed a tiny `noscript` PNG preview and a strict CSP meta tag. The token page must render without JS in marketplaces.  
11. **Keyboard rate‑limit:** Debounce destructive keys (restart/warp).  
12. **Repo hygiene:** lint‑clean (`eslint:recommended` style if used), comments explain non‑obvious math, no dead code. All new work lands behind feature flags if risky.

---

## 1) File Layout (minimal)
- `/SearchForLife_v10_infinite.html` — current working artifact (to be evolved to v11+).
- `/docs/*` — project overview, environment, and Codex prompts.
- `/scripts/codex-setup.sh` — one‑shot container bootstrap.
- `/scripts/codex-maintenance.sh` — maintenance for cached containers.

---

## 2) Agent Workflow
1. **Bootstrap** using `/scripts/codex-setup.sh` inside the “universal” container.  
2. **Read before coding:** `docs/Master_Overview_And_Manifest_SFL.md`, `docs/CODEX_ENVIRONMENT.md`, and the prompt for your current task in `docs/prompts/*.md`.  
3. **Branching:** Create a working branch `feat/v11-streaming-flight` (or the task ID). Commit early & often with atomic diffs.  
4. **Definition of Done (DoD):**
   - New HTML artifact passes a self‑check: console is clean, and the HUD reports the target FPS tier on the test device.
   - Seed determinism verified (reload equals identical first 30 seconds given same inputs).
   - Mobile & desktop input sanity (touch joystick + pointer‑lock fallback).
   - All acceptance tests in the task prompt pass.
5. **Outputs:** Replace `/SearchForLife_v10_infinite.html` with a new `/SearchForLife_v11_infinite.html` and update docs/HUD feature list.

---

## 3) Technical Blueprint (v11+)
**Universe Streaming**
- **Chunk grid:** 3D integer sectors `(gx, gy, gz)` of edge `S = 2e7 km` (tunable). Use `gx=floor(px/S)` etc.  
- **PRNG:** `sfc32` seeded with `mix(seed, gx, gy, gz)`; mix via 32‑bit integer hash.  
- **Continuity at borders:** Features that can reveal seams (nebula density, background starfield) must sample **shared boundary noise**: use an R2 **blue‑noise** lookup by `(gx, gy)` and tileable Worley/Perlin with a **wrap** on sector edges.
- **Streaming budget:** Keep ≤ 9 loaded sectors around origin (3×3×1 belt by default). Evict beyond radius with a hysteresis margin.  
- **Floating origin:** When `|p|> 1e9 km`, subtract that offset from **all** positions and accumulate into `worldOrigin`. All generators consume `worldOrigin + local`.  
- **Star systems:** For each sector, roll 0–3 stars by Poisson rate λ=0.35. Each star rolls: spectral class (OBAFGKM) ⇒ color temperature & luminosity; planets 0–12; belts; comets. Orbits are Kepler‑ish but **slow** (periods in days/weeks).

**Flight Model**
- **6‑DOF thrust:** velocity `v += (F_thruster - drag * v) * dt`.  
- **Accel ladder:** sub‑light cruise up to 200 km/s; engage **warp** (J) to enter FTL: camera tunnels to wormhole scene; on exit, rebase near target vector.  
- **Collision / heat:** Cross‑section tests vs. bodies; near a sun: heat increases — keep an **overlay heat gauge**. Impact damage reduces hull; zero hull ⇒ explode + respawn.  
- **Landing:** When within planet SOI and altitude < threshold and vertical speed < safe limit ⇒ transition to “landed” mode with local terrain LOD.  
- **Persistence:** Player state (seed, worldOrigin, pos, vel, lives) is serialised to localStorage.

**Rendering**
- **WebGL2 star/galaxy billboards:** instanced quads with per‑instance uniforms (color, magnitude, twinkle).  
- **Planet shading:** cheap physically‑inspired lambert + rim + clouds layer texture generated on the fly from noise into a small RGBA canvas and sampled in a fragment shader (or drawn to a texture).  
- **Warp:** streaks via full‑screen radial blur in N passes (or procedural lines) with Doppler hue shifts.  
- **HUD:** reactive layout with CSS vars; DPR aware; text uses system UI font; anchoring via `vw/vh` and `em`.  

---

## 4) Security/Compliance
- No eval/function constructors, no timers that spin CPU when tab is hidden, no sharedArrayBuffer, no external fetch.  
- CSP remains strict. Embeds limited to `data:` URIs for PNG preview.

---

## 5) Milestones
- **v11:** Streaming sectors + flight model + FTL + HUD overhaul + FPS QoS + deterministic stars/planets + invert‑Y toggle fix.  
- **v12:** Landable planets with procedural terrain, atmosphere scattering, and day/night.  
- **v13+:** NPCs/anomalies (pulsars, nebulae, wrecks), missions, codex entries.

---

## 6) References (internal)
- ZeroUnbound FA2/Factory interfaces and deployment notes (for mint‑side integrity): see the contract schemas and factory deploy in our Tezos stacks. fileciteturn0file21
- Bootstrap & Node/Yarn pinning scripts used in ZeroUnbound‘s CI (adapt ideas, not dependencies) — see `scripts/*` snippets. fileciteturn0file22

