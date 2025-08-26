# PROFILE_NOTES

Frame time sampling on a mid laptop (Intel Iris Xe, 1920×1080):

| Scene                  | Frame ms | FPS |
|-----------------------|---------:|----:|
| Empty space           |   ~0.8ms | ~1250|
| Nearby star sector    |   ~2.5ms | ~400 |
| Warp overlay active   |   ~6.0ms | ~160 |

Pixel renderer uses a fixed 1/4‑scale logical canvas and keeps star sprites ≤1 px for a retro aesthetic.
No dynamic resolution; sector streaming holds a 3×3 grid (~9 sectors).
