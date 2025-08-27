# PROFILE_NOTES

Frame time sampling on a mid laptop (Intel Iris Xe, 1920×1080):

| Scene                   | Frame ms | FPS |
|------------------------|---------:|----:|
| Empty deep space       |   ~1.2ms | ~830|
| Star sector w/planets  |   ~3.8ms | ~260|
| Warp streak overlay    |   ~7.0ms | ~140|

Renderer uses a fixed quarter‑scale canvas and instanced sector streaming (3×3×3 grid).
Starfield anchored to camera orientation; QoS ladder trims star points 8k→2k when FPS <30 and restores when recovered.