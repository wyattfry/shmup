# Enemy Explosion Scale Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Render standard plane explosions at 2x and flagship explosions at 5x while preserving all default explosion sizes.

**Architecture:** Enemy classes expose optional `explosionScale` metadata. The shared game explosion factory multiplies its existing pixel-ratio scale by that value, defaulting to one.

**Tech Stack:** Phaser 2.2, JavaScript, Node VM assertion tests, Gulp.

---

### Task 1: Add and verify explosion scaling

**Files:**
- Create: `test/explosion-scale-test.js`
- Modify: `src/js/class/flying_mobs.js`
- Modify: `src/js/game.js`

**Step 1:** Write a failing VM test that calls `Game.explode()` with scale values `2`, `5`, and no value, then verifies the created sprite scales.

**Step 2:** Run `node test/explosion-scale-test.js` and verify custom scales fail.

**Step 3:** Set `Plane.explosionScale = 2`, set `Flagship.explosionScale = 5`, and apply `thing.explosionScale || 1` in `Game.explode()`.

**Step 4:** Run the explosion test, all existing regression tests, `npm run lint`, and `npm run build`.
