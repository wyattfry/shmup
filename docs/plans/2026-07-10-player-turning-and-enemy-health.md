# Player Turning And Enemy Health Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rotate the player on movement changes and require two rifle hits per enemy soldier.

**Architecture:** Restore player angle updates inside the non-zero movement branch so idle frames preserve orientation. Add configured enemy health, reset it during pooled spawn, and route rifle collisions through damage before the existing defeat method.

**Tech Stack:** Phaser 2.2, JavaScript, Node VM assertion tests, Gulp.

---

### Task 1: Player turn persistence

**Files:**
- Modify: `test/ground-combat-test.js`
- Modify: `src/js/ground.js`

**Steps:**
1. Change the orientation regression to require the diagonal movement angle.
2. Add an idle update and require the angle to remain unchanged.
3. Restore player rotation only in the non-zero movement branch.

### Task 2: Two-hit enemies

**Files:**
- Modify: `test/ground-combat-test.js`
- Modify: `src/js/boot.js`
- Modify: `src/js/ground.js`

**Steps:**
1. Add failing assertions for first-hit survival, second-hit defeat, one kill increment, and health reset.
2. Add `GROUND_ENEMY_HEALTH: 2`, reset spawned enemies, and damage enemies in rifle collisions.
3. Add a brief first-hit tint flash while preserving rocket instant kills.
4. Run all regression tests, `npm run lint`, and `npm run build`.
5. Verify turning and two-hit behavior in the running browser.
