# Ground Enemy Roaming Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 150 trees and support ten spaced enemy soldiers that roam, detect, chase, shoot, and turn.

**Architecture:** Ground enemies gain a small state machine stored directly on each pooled sprite. Spawning remains player-relative but validates candidates against all living enemies before revival, while biome obstacle counts provide the requested tree increase.

**Tech Stack:** JavaScript, Phaser 2.2 Arcade Physics, Node assertion tests, Gulp

---

### Task 1: Increase tree density and enemy capacity

**Files:**
- Modify: `src/js/boot.js`
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

1. Add failing assertions for a ten-enemy cap and 150 additional tree obstacles.
2. Update configuration and biome obstacle counts.
3. Run the focused regression test.

### Task 2: Enforce spawn spacing

**Files:**
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

1. Add failing tests for 80-pixel minimum spacing and crowded-spawn rejection.
2. Add candidate generation and living-enemy distance validation with ten attempts.
3. Initialize roaming state only after a valid spawn.
4. Run the focused regression test.

### Task 3: Add roaming, detection, chasing, and turning

**Files:**
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

1. Add failing tests for roaming velocity outside detection range.
2. Add failing tests for chase velocity inside detection range.
3. Add timed random roam directions and detection-state transitions.
4. Rotate enemy sprites left/right from horizontal movement.
5. Run the focused and complete regression suites.

### Task 4: Verify and deploy

**Files:**
- Modify: `dist/main.min.js`

1. Run all tests, `npm run lint`, and `npm run build`.
2. Browser-verify ten separated enemies, roaming/chasing, turning, trees, and runtime errors.
3. Commit source, tests, plan, and generated bundle.
4. Push `gh-pages` and confirm GitHub Pages deployment succeeds.
