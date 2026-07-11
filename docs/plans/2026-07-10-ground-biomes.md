# Large Ground Biomes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand ground combat into an eight-times-larger world containing grassland, forest, swamp, and ruined battlefield biomes.

**Architecture:** `GroundGame` will generate four biome textures and render them as a fixed two-by-two set of tile sprites. Biome lookup will drive swamp movement speed and decoration, while enemy and plane placement will become player-relative to fit the larger world.

**Tech Stack:** JavaScript, Phaser 2.2 Arcade Physics, Node assertion tests, Gulp

---

### Task 1: Expand and partition the world

**Files:**
- Modify: `src/js/boot.js`
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

1. Add failing assertions for eight-times dimensions and four biome identifiers.
2. Run `node test/ground-combat-test.js` and confirm failure.
3. Add world scale and biome constants, generate four textures, and render a two-by-two biome layout.
4. Add `getBiomeAt(x, y)` with deterministic quadrant lookup.
5. Run the focused test and confirm it passes.

### Task 2: Add biome terrain and movement

**Files:**
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

1. Add failing tests for normal movement speed and reduced swamp speed.
2. Add biome-specific decoration textures and obstacle placement rules.
3. Apply the swamp speed multiplier from the player's current biome.
4. Run the focused test and confirm it passes.

### Task 3: Keep combat and the objective nearby

**Files:**
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

1. Add failing tests that enemy spawns are within the configured annulus around the player and inside world bounds.
2. Replace global-edge spawning with player-relative spawn candidates.
3. Add a failing test that the revealed plane is nearby and inside world bounds.
4. Place the plane relative to the player when the objective completes.
5. Run the focused test and confirm it passes.

### Task 4: Verify, build, and deploy

**Files:**
- Modify: `dist/main.min.js`

1. Run `for test_file in test/*.js; do node "$test_file" || exit 1; done`.
2. Run `npm run lint` and `npm run build`.
3. Verify all four biomes, camera travel, combat spawning, swamp speed, and plane reveal in a browser.
4. Commit the source, tests, plan, and generated bundle.
5. Push `gh-pages` to `wyattfry/shmup` and confirm the Pages workflow succeeds.
