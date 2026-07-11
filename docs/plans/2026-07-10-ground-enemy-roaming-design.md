# Ground Enemy Roaming Design

## Goal

Increase ground-map tree density and support up to ten independently moving enemy soldiers without clustered spawns.

## Terrain

Add 150 trees across the large map. Most new trees belong in the forest biome, with smaller additions to grassland and swamp. Existing obstacle collision keeps routes navigable around individual trees.

## Spawning

Raise the active enemy cap to ten. Each spawn candidate must be at least 80 logical pixels from every living enemy. The spawner tries up to ten candidates in the existing player-relative spawn ring; if none are valid, it skips that cycle.

## Enemy Behavior

New enemies begin in a roaming state with a random normalized direction and a timed direction change. When the player enters detection range, an enemy switches to chase behavior, moves toward the player, and shoots at the existing attack distance. Enemies outside detection range resume roaming.

Enemy sprites face left or right based on horizontal velocity while preserving their last facing during vertical movement or idle time.

## Verification

Regression tests cover the ten-enemy cap, 80-pixel spawn spacing, failed crowded spawns, roaming, detection-based chasing, and sprite turning. Full tests, lint, build, browser verification, and Pages deployment must pass.
