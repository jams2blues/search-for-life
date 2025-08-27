# Search for Life — Master_Overview_And_Manifest_SFL.md
**Repo**: `jams2blues/search-for-life`  
**Last updated**: 2025-08-27 18:13:52 UTC
**Maintainers**: @jams2blues (owner), ZeroContract Studio (project), **AI Agents**: Codex primary + GPT‑5 Pro (you) as PM/Architect/QA.

---

## 0) Executive Summary
Search for Life (SFL) is a single‑file, fully on‑chain, deterministic, **infinite procedurally generated universe** rendered in the browser with **vanilla HTML+CSS+JS** only (no external libraries, no network fetches at runtime). It features sectorized worldgen, Newtonian-ish flight, **FTL warp** with a wormhole sequence, spectral stars, multi‑body solar systems, rings, moons, comets/asteroids, collisions/damage, and a pointer‑lock starship helm UI. Minting target: **ZeroUnbound.art**; CSP must be strict enough for on‑chain minting.

This document is the canonical, exhaustive manifest. New agents **must read this file first** before touching code. Nothing here is “optional”. Append updates—**never delete prior sections** unless the human owner explicitly directs it.

---

## 1) Immutable On‑Chain Invariants (do not break)
1. **Single file artifact** (`SearchForLife_*.html`) contains *all* runtime assets (scripts + styles + shaders + noscript poster).  
2. **No external network calls** in the artwork at runtime. CSP must enforce:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
   ```
3. **Determinism**: Every generative decision must be driven by a deterministic RNG seeded by either `tokenData.hash` (Prohibition) or the URL param `?seed=...`. State transitions (sector streaming, LOD, entity orbits) must be *stable* under constant time progression—i.e., traveling forward then backward returns to the same content.  
4. **Device‑agnostic**: Resolution and aspect‑ratio independent. Device‑pixel aware canvas; must deliver 60 FPS on a modern discrete GPU and remain playable on mid devices through *automatic fidelity scaling* (instancing caps, LOD, temporal upscaling, dynamic physics tick).  
5. **Graceful fallback**: If WebGL2 fails, degrade to Canvas2D starfield + billboard planets with navigation retained rather than a black screen.  
6. **No deps**: No bundlers, no node_modules at runtime. Dev tooling is allowed only in the Codex environment.  
7. **User inputs (defaults)**: pointer‑lock mouse look (left/right→yaw, up/down→pitch, non‑inverted by default; `I` toggles). `WASD` + `QE` translate, `SHIFT` boost, `CTRL` dampers/brake, `J` warp, `L` land, `X` takeoff, `H` HUD, `F` framegraph. Touch devices display virtual joystick + buttons for equivalent controls.
8. **Save/Restore**: Persist last known seed and ship pose to `localStorage` (key `sfl.v1.state`) only; feature must be optional and never networked.
9. **Noscript poster**: A tiny inline PNG for marketplaces must remain embedded.  
10. **Copyright**: All code authored for SFL is © ZeroContract Studio / jams2blues and licensed for minting and display on-chain; third‑party code is prohibited (we write our own).

---

## 2) Architecture (target design)
### 2.1 Rendering stack
- Primary: **WebGL2** (no frameworks). Two pipelines:
  - **Deep‑space pipeline**: instanced point sprites for stars/dust; ray‑marched fog for nebulae; 3D grid lines hidden (debug only).
  - **Body pipeline**: **SDF‑based** planet shader (sphere/ellipsoid) with layered **value noise** (not Perlin) for terrain color and cloud coverage; rings drawn as analytic strips; atmosphere via thickness integral; moons as instanced spheres; suns as emissive spheres with bloom (post approximated with multi‑tap).  
- Fallback: **Canvas2D** – starfield + billboarded planets (kept simple, must always render something).

### 2.2 World model
- Space is partitioned into **sectors** (cubic cells) of edge `SECTOR_M = 1e6` meters. A **Deterministic Sector Function** `G(sectorXYZ, universeSeed)` yields immutable **SectorDescriptor** containing stars (class, mass, temp), n planets (type, semimajor axis, eccentricity, inclinations), belts, and transient bodies (comets, debris clusters).  
- Streaming window is a 5×5×5 cube centered on the ship. Each sector’s content is cached and reference‑counted; eviction obeys LRU.  
- Planet systems exist inside **star sub‑spaces** keyed by `StarId`. Planet orbits advance with a stable epoch `t0 = 0` at seed time; time `t` comes from accumulated sim dt.  
- **Spectral star classes** (O,B,A,F,G,K,M, + white/brown dwarf, neutron) with temperature → color mapping. Approaching a star spawns its system using deterministically derived seeds. **Radiation/heat damage** increases near the photosphere. 

### 2.3 Simulation
- Discrete integrator at **variable physics tick** (default 60 Hz, can drop to 30/20 under load).  
- **Flight model**: velocity vector with thrust, strafe, vertical thrust; dragless vacuum with configurable damping for playability.  
- **FTL & wormhole**: Hold `J` to charge; tunnel opens and camera enters a 10s Einstein‑Rosen warp (blue/red shifts). Exit deposits ship near target sector boundary; all transitions deterministic.  
- **Damage**: impacts scale with closing speed; suns kill; debris reduces hull integrity; respawn at previous safe sector with one fewer life.  
- **Landing** (v1 prototype scope): analytic heightfield for close‑range SDF sphere; at altitude threshold ship auto‑aligns; while landed, we render a parallax “surface mode” (true terrain marching is v2).

### 2.4 Performance controls
- **Tiered quality** `q ∈ [0..5]` selected automatically by time‑averaged FPS; caps draw call count, instancing counts, and effect toggles (e.g., disable clouds at q=0).  
- **Temporal dilation**: large deltaTime are subdivided to keep physics stable.  
- **Adaptive star batches**: instance buffer grows/shrinks.  
- **GPU‑safe**: detect and disable float color buffers / msaa if unsupported.  

---

## 3) File/Path Manifest
> Single‑file build remains the runtime artifact. Dev docs/scripts live in repo but are **never** fetched by the artwork.

```
/SearchForLife_v10_infinite.html          # current playable artifact (inline)
// New in this commit:
/docs/
  Master_Overview_And_Manifest_SFL.md    # you are here
  AGENTS.md                               # Codex boot & collaboration protocol
  CODEX_ENVIRONMENT.md                    # exact environment settings & scripts
  prompts/
    SFL_Codex_SuperPrompt.md
    SFL_Codex_Task_Template.md
/scripts/
  codex-setup.sh                          # setup script (copy into Environment UI)
  codex-maintenance.sh                    # maintenance script (cache resume path)
```

---

## 4) Seed & Determinism
- Universe seed: `tokenData.hash` (preferred) or `?seed=<hex|text>`; use a **dual sfc32** PRNG warmed with 1e6 cycles; never `Math.random`.  
- Sector key = `floor(worldPos / SECTOR_M)`; all child seeds derive via stable 128‑bit mixer `mix128(universe, sector, kind, index)`.  
- Time base: `simTime` from monotonic `performance.now()` accumulator; pausing doesn’t advance time.  
- Procedural assets (colors, sizes, orbits) must not depend on non‑deterministic runtime state (FPS, machine perf).

---

## 5) Controls & HUD (v10)
- Pointer‑lock (non‑inverted Y by default; toggle `I`; axes mapping is invariant).
- Touch: left pad move, right pad look, buttons for up/down, boost, brake.
- HUD shows seed, FPS, quality tier, position (sector + local), velocity, lives, warp charge, and heat/radiation near stars.
- Inputs: see §1 invariants.
- Game states: `FLIGHT`, `WARP`, `LANDED`, `DEAD`.

---

---

## 6) QA Gates
- Lint‑clean (ES2020+, no transpile) – ESLint standard style if used offline.  
- No console errors/warnings in runtime.  
- Smoke tests: WebGL2 available → draw starfield within 100ms; fallback path → visible stars.  
- 60 FPS on discrete GPU; 30+ FPS on 2021 laptops w/ integrated graphics (auto tier).

---

## 7) Roadmap (guided backlog for Codex)
1. **Sector continuity smoothing** (no seams; cross‑fading nebula noise) and **stable streaming** (no reshuffles).  
2. **Spectral starfield** with temperature → color and twinkling by scintillation.  
3. **Solar system builder**: to‑scale orbits, variable orbital periods (slowed 1000× for playability), rings, moons; spawn only when within N AU.  
4. **FTL warp polish** reusing the original art’s sequence as transition.  
5. **Collision & damage**: hull, heat, radiation; respawn.  
6. **Landing v1** (analytic) and surface parallax; v2: ray‑marched terrain with tri‑planar albedo.  
7. **Anomalies**: wormholes, relics, comets, belts, nebula pockets, pulsars, black holes (safe distances enforced).  
8. **Save/restore**, screenshots, optional GIF capture (dev tool only).

---

## 8) Progress Ledger (append‑only)
- 2025-08-26 16:43:30 UTC — **Docs & Codex bootstrap**: added AGENTS.md, environment guide, super‑prompt & task template; created setup/maintenance scripts. (Author: GPT‑5 Pro)  

- 2025-08-27 17:13:11 UTC — Documented mouse-axis invariant and initial mobile controls. (Author: GPT-5 Pro)
- 2025-08-27 18:13:52 UTC — Wrapped starfield around camera and added speed gauge for clearer motion. (Author: GPT-5 Pro)
---

## 9) Change Log (high‑level)
- v10: Pointer‑lock 6‑DOF, sectors, HUD; preparing Codex for rapid iteration.

---

## 10) Glossary
- **Sector**: cubic cell of space deterministically generated.  
- **LOD**: level of detail.  
- **SDF**: signed distance field.  
- **Epoch**: zero time for deterministic orbital angles.  

---

## 11) Legal / Licensing
- All code is original to this project; contributors license their changes under project license for minting and on‑chain display. Third‑party code snippets are not permitted without explicit owner approval.
