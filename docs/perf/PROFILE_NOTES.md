# PROFILE_NOTES

Frame time sampling on a mid laptop (Intel Iris Xe, 1920×1080):

| Scene                   | Frame ms | FPS |
|------------------------|---------:|----:|
| Empty deep space       |   ~0.9ms | ~1080|
| Star sector w/planets  |   ~2.5ms | ~400|
| Warp streak overlay    |   ~5.8ms | ~170|

Renderer uses a fixed quarter‑scale canvas and instanced sector streaming (3×3×3 grid).
Starfield anchored to camera orientation; QoS ladder trims star points 4k→1k when FPS <30 and restores when recovered.
Mobile touch controls add ~0.2ms frame cost; hidden on desktop.
