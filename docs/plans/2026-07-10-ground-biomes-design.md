# Large Ground Biomes Design

## Goal

Expand ground combat to an eight-times-larger world with grassland, forest, swamp, and ruined battlefield regions.

## World Layout

Use a fixed two-by-two arrangement of large connected biome regions. Each region uses a distinct generated tile texture and biome-specific decoration. The fixed layout guarantees every biome appears and avoids impassable random maps.

## Biomes

- Grassland uses the current green field with sparse trees.
- Forest uses darker ground, dense trees, and navigable gaps.
- Swamp uses muddy ground and dark pools; swamp ground slows the player.
- Ruined battlefield uses dirt, rubble, trenches, and broken structures.

## Combat Flow

Because the world edges are much farther away, enemies spawn at a bounded distance around the player rather than at global edges. Spawn positions are clamped to world bounds and avoid appearing directly on the player. After 50 kills, the plane appears in a nearby reachable position rather than at a distant fixed corner.

## Rendering And Performance

Each biome is rendered as one tile sprite with lightweight generated textures. Obstacles remain pooled Phaser sprites with arcade bodies. This avoids constructing a full per-tile map and keeps the implementation compatible with Phaser 2.

## Verification

Tests cover expanded dimensions, all four biome regions, local enemy spawn distance, swamp speed, and nearby plane placement. The full regression suite, lint, production build, and deployed Pages workflow must pass.
