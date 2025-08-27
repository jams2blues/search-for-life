<!--Developed by @jams2blues – ZeroContract Studio
File: docs/perf/PROFILE_NOTES.md
Rev: r3
Summary(of what this file does): Performance sampling notes and tier thresholds -->
# PROFILE_NOTES

Frame time sampling on a mid laptop (Intel Iris Xe, 1920×1080):

| Scene                   | Frame ms | FPS |
|------------------------|---------:|----:|
| Empty deep space       |   ~0.9ms | ~1080|
| Star sector w/planets  |   ~2.5ms | ~400|
| Warp streak overlay    |   ~5.8ms | ~170|

Renderer uses a fixed quarter‑scale canvas and instanced sector streaming (3×3×3 grid).
Starfield wraps around camera with translation; QoS ladder trims star points 4k→1k (2k→500 on touch) when FPS <30 and restores when recovered.
Mobile defaults: renderScale 0.6 and 2k star points (~0.2ms overhead for touch controls).
<!-- What changed & why: noted starfield wrapping and mobile defaults -->
