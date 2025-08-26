# PROFILE_NOTES

Frame time sampling on a mid laptop (Intel Iris Xe, 1920×1080):

| Scene                  | Frame ms | FPS |
|-----------------------|---------:|----:|
| Empty sector          |   ~1.2ms | ~830|
| Populated star system |  ~12.0ms | ~80 |
| FTL warp tunnel       |   ~8.0ms | ~120|

Adaptive resolution drops `renderScale` from 1.0→0.6 when averaged FPS <30.
Star/nebula layers cull when FPS <30 to maintain playability.