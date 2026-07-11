# Ground Combat Mode Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a complete top-down ground battle between the 20th plane kill and a cutscene-driven return to flight after 50 soldier kills.

**Architecture:** A new `GroundGame` Phaser state owns generated arena art, player/enemy entities, projectiles, AI, HUD, and cutscene. `game.runData` persists flight totals and player stats across state recreation, while the flight game tracks standard plane kills and triggers the ground state once.

**Tech Stack:** Phaser 2.2, JavaScript, generated BitmapData pixel art, Arcade Physics, Node VM assertion tests, Gulp.

---

### Task 1: Flight progress and state registration

**Files:**
- Create: `test/ground-transition-test.js`
- Modify: `src/js/boot.js`
- Modify: `src/js/game.js`
- Modify: `src/js/class/player.js`
- Modify: `src/js/main.js`
- Modify: `src/index.html`
- Modify: `gulpfile.js`

**Steps:**
1. Write a failing test requiring the 20th standard-plane defeat to save run data and start `ground` only once.
2. Run the test and verify the transition behavior is missing.
3. Add ground-mode constants, run-data save/restore helpers, plane-kill tracking, and state/script registration.
4. Run the transition test until it passes.

### Task 2: Ground arena and player combat

**Files:**
- Create: `src/js/ground.js`
- Create: `test/ground-combat-test.js`

**Steps:**
1. Write failing tests for normalized eight-direction movement, last-direction facing, rifle direction/rate, and one-second rocket cooldown.
2. Implement the `GroundGame` constructor, generated textures, arena, obstacles, player, projectile pools, controls, camera, and HUD.
3. Run the ground combat tests until they pass.

### Task 3: Enemy AI, damage, and victory

**Files:**
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

**Steps:**
1. Add failing tests for enemy spawning, ranged pursuit, rifle/rocket kills, three-hit player death, and the 50-kill objective.
2. Implement enemy pools, movement/firing AI, enemy bullet collisions, player hit immunity, kill accounting, and parked-plane reveal.
3. Run the ground combat tests until they pass.

### Task 4: Boarding cutscene and full verification

**Files:**
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

**Steps:**
1. Add a failing test that reaching the revealed plane disables combat and returns to `game` with `groundComplete` after takeoff.
2. Implement boarding movement, soldier hide, plane takeoff tween, and return-to-flight persistence.
3. Run all Node regression tests, `npm run lint`, and `npm run build`.
4. Start or retain the live server and verify the built mode in a browser.
