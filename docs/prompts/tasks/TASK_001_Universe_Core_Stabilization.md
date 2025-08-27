# TASK 001 — Universe Core Stabilization (SFL)

**Owner:** Codex Agent  
**Priority:** P0 (blocking)  
**Branch:** `feat/universe-core-stabilization`  
**Scope:** Single‑file HTML (`SearchForLife_v10_infinite.html`) with inline `<script>` only. No external deps. CSP must remain `default-src 'none'` and `script-src 'unsafe-inline'`.

---

## Objectives

1. **Deterministic, contiguous streaming universe**
   - Use **sector hashing**: partition 3D space into cubic sectors (e.g. 4 AU per side). A sector seed is `hash(globalSeed, floor(x/size), floor(y/size), floor(z/size))`.
   - Generation must be **pure** (idempotent) per sector seed. When revisiting, content is identical.
   - Maintain a sliding window of loaded sectors around the player: `N x N x N` (configurable), with hysteresis to avoid churn.
   - No hard square edges visible during warp: fade in/out newly loaded sector entities using temporal dithering (random per‑entity alpha ramp).

2. **Kinematics & Navigation**
   - Ship has **accelerometer** model:
     - Throttle (0..1), acceleration `a = throttle * aMax`, with boost (SHIFT) up to `aMaxBoost`.
     - Velocity clamped with **drag** curve for sublight; FTL engages at `|v| > vFTLThreshold`.
   - **FTL visuals**: reuse & adapt earlier warp tunnel effect; hueshift with relativistic gradient.
   - WASD strafes, QE up/down, CTRL for brake. Gamepad optional.
   - Mouse‑look: non‑inverted by default; toggle with `I`. Fix yaw/pitch mapping (Y up), pointer‑lock. Mapping is invariant.
   - Mobile: virtual joystick + throttle slider; buttons for boost, brake, ascend, descend.
3. **Celestial Simulation (to‑scale but playable)**
   - Star colors vary (OBAFGKM with temperature → color). Luminance falloff over distance; HDR tonemap to LDR.
   - **Solar systems**: within `Rspawn` of a star, spawn planets & moons with stable orbits (semi‑major axis + eccentricity; orbital period via Kepler’s third law simplified).
   - **Motion rates**: scaled time so bodies move perceptibly but remain catchable (max angular velocity capped).
   - **Hazards**: Komets/asteroids with probability; collisions reduce hull; proximity to stars causes heat damage.
   - **Deaths/Lives**: flying into stars destroys the ship → respawn at last safe position, decrement lives.

4. **Landing & Planet LOD**
   - Approach planet → **atmosphere entry** shader; once below altitude threshold, **planet surface mode**:
     - Fractal heightmap (FBM/simplex) via deterministic seed.
     - Triplanar texturing look using solid colors & bands (no external images).
     - Simple scattering sky dome; day/night cycle synced to planet rotation.
   - Takeoff with `X`. Preserve orbit frame & position on re‑entry to space.

5. **Stars & Nebulae Aesthetics**
   - Background starfield: parallax layers + chromatic variance + twinkle; keep cost ≤ 1.5 ms on mid devices.
   - Nebulae: low‑frequency FBM billboards; alpha‑dithered to avoid banding. Deterministic per sector.

6. **HUD, UI & Resolution‑Agnostic Layout**
   - Scale all HUD elements via CSS pixels independent of DPR.
   - Add FPS governor/target (adaptive): target 60; drop detail tiers (stars/nebula/galaxies) to keep ≥ 30.
   - Show coordinates, velocity, throttle, FTL status, hull, heat, lives. Toggle HUD with `H`.
   - Mobile: virtual joystick + throttle slider; same bindings where feasible.

7. **Testing hooks & invariants**
   - Determinism: navigating out and back into a sector must produce byte‑identical JSON of generated entities.
   - No allocations per frame in hot paths (avoid GC spikes). Use pools.
   - WebGL 2 only; no external libs. Fallback to Canvas2D starfield when WebGL not available.

---

## Acceptance Criteria

- Stable FPS ≥ 30 on mid laptop (integrated GPU); ≥ 120 on high‑end.
- FTL warp effect matches v4e aesthetic, with smooth sector fades.
- Planets remain reachable; motion rates scaled.
- Landing cycle works end‑to‑end and returns to space at same orbital position.
- Deterministic streaming validated with debug hash overlay (`F3`).

---

## Implementation Notes

- RNG: dual sfc32 streams; `rand3(i,j,k)` hash for sector seeding.
- Sector cache LRU with limit (e.g. 512 sectors). Entities: stars, planets, moons, belts, debris, nebulae.
- Shader modules inline: common.glsl, tonemap.glsl, noise.glsl (value/simplex), atmosphere.glsl, warp.glsl.
- Draw order: skybox → distant stars → nebulae → stars → planets/moons → debris → cockpit HUD.
- Use unsigned integer textures only if absolutely necessary; prefer vec4 packing in float textures.

---

## Deliverables

- Updated `SearchForLife_v10_infinite.html` implementing the above.
- New `docs/perf/PROFILE_NOTES.md` capturing frame timings and tier thresholds.
- Demo recordings (optional) under `docs/demos/` (GIF/MP4).

---

## Out of Scope (for this task)

- Multiplayer, persistence to chain, on‑chain mint flows.  
- PWA install; asset caching.

---

## Kickoff Checklist

- [ ] Add sector RNG + streaming window.
- [ ] Replace current warp with FTL module; fade in/out sectors.
- [ ] Implement accelerometer + throttle + FTL thresholds.
- [ ] Fix pointer‑lock & invert‑Y toggle.
- [ ] Rework stars → varied spectral colors.
- [ ] Add solar system spawning & orbital scaling with caps.
- [ ] Add hazard & hull/heat damage model.
- [ ] Implement landing + surface mode + takeoff.
- [ ] Add FPS governor & tiered detail.
- [ ] Harden determinism tests and debug overlays.