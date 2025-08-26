# TASK_001_Universe_Core_Stabilization.md

## Objective
Replace v10 prototype's ad‑hoc sector system & camera with a robust,
deterministic **Universe Core** that supports smooth navigation,
sector persistence, scalable LOD, and FTL warp matching the classic
"Search for Life" wormhole aesthetic.

## Key Problems to Fix (from user feedback r1‑r10)
1) **Visible sector seams** during warp; content pops / re‑rolls.
2) **Planets & moons orbit too fast**; impossible to intercept.
3) **Controls**: Missing acceleration ladder (cruise→boost→FTL);
   mouse invert toggle; resolution‑agnostic HUD.
4) **FPS**: ~3.8 fps on some runs; need governor + dynamic tiering.
5) **Starfield**: monochrome & flat; add temperature‑based colours, twinkle, parallax.
6) **System growth**: stars gain systems as player approaches; star collision = death.
7) **Persistence**: deterministic across [seed, sector(x,y,z)], no changes when returning.

## Design
- **Hash Grid**: cubic sectors of size `S = 1e6` units. Player at `(x,y,z)` maps to
  `(sx,sy,sz)=floor(x/S)`. Sector seed `h = mix32(seed, sx,sy,sz)`. Use `Random(h)`.
- **System Gen** (per sector):
  - `Nstars ∈ [0..2]` via Poisson‑like RNG. Star class distribution OBAFGKM.
  - For each star: temperature→colour (black‑body approx), radius, mass.
  - **Solar system shell**: log‑mapping to render scale; orbital periods scaled with
    Kepler‑like `T ~ a^(3/2)` but damped for playability.
  - Planets: 0–12 with types (rock/gas/ice), rings, moons (0–4), belts, debris.
- **LOD**:
  - Far: billboard impostors (shaded discs), analytic halo & glare.
  - Near: sphere mesh from unit icosahedron (subdivided), triplanar noise texture.
- **Flight Model**:
  - Velocity `v` with acceleration ladder: cruise/boost/warp.
  - Warp engages spline‑based tunnel shader in screen‑space; time‑dilated orbits.
- **Governor**:
  - Maintain `targetDelta` (16.6/33.3 ms). If frame time spikes, reduce renderScale,
    impostor detail, and sector draw radius; ramp back up when stable.
- **HUD**: Canvas2D, DPR aware, anchored margins in CSS pixels; flexible layout grid.

## Acceptance Criteria
- [ ] Deterministic sector content; revisiting a sector shows identical systems.
- [ ] Seamless transition across sector borders (no re‑roll pop); use overlap buffer.
- [ ] FTL warp visuals match classic wormhole style; no 2D "corny" look.
- [ ] Planets interceptable: max orbital angular velocity capped; time‑dilation at warp.
- [ ] Non‑inverted mouse by default; `I` toggles inversion; sensitivity slider in HUD.
- [ ] Frame‑time governor holds ≥58 FPS on desktop test; ≥28 FPS on mid mobile.
- [ ] Star colours reflect spectral class; twinkle and Doppler shift at high speed.
- [ ] Collision with star reduces lives to 0 (death & respawn); debris impacts reduce hull.

## Constraints
- Pure HTML + JS; inline; CSP `default-src 'none'`.
- WebGL2; no third‑party libs.
- Keep code lint‑clean; no console errors.

## Deliverables
- **One** updated file: `SearchForLife_v10_infinite.html` (full).
- Any new helper docs linked from HUD (embedded, not external).
- An updated **controls reference** in the HUD.

## Hints
- Use a **fixed‑timestep accumulator** for physics: 60 Hz; interpolate for rendering.
- Use a **reseedable Random** (`sfc32` pair); provide `nextFloat`, `nextInt`, `choice`.
- Implement a **murmur3/xxhash‑like 32‑bit mixer** for `(sx,sy,sz)`.
- For planet noise: fBm (simplex/value); triplanar approx: project noise on xyz and blend.
- Star colour: map temperature (K) to RGB via approximate black‑body function.
