# Missile AOE Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add capped instant-kill splash damage to missile impacts and four damage to a nearby non-invulnerable player.

**Architecture:** Rockets carry an `isRocket` marker. The projectile collision path applies direct damage, then calls a detonation method that scans all enemy pools by squared distance, excludes the direct target, and sends up to four victims through one shared enemy death method.

**Tech Stack:** Phaser 2.2, JavaScript, Node VM assertion tests, Gulp.

---

### Task 1: Enemy AOE and rewards

**Files:**
- Create: `test/missile-aoe-test.js`
- Modify: `src/js/boot.js`
- Modify: `src/js/class/player.js`
- Modify: `src/js/game.js`

**Step 1:** Write a failing test with a direct target, five nearby mobs, and one distant mob; require exactly four additional kills, normal rewards, and survival of the direct and distant exclusions during AOE selection.

**Step 2:** Run `node test/missile-aoe-test.js` and verify the detonation method is missing.

**Step 3:** Add radius/victim constants, mark rockets, extract shared enemy death handling, and implement capped pool scanning.

**Step 4:** Run the AOE test and verify enemy behavior passes.

### Task 2: Player splash damage

**Files:**
- Modify: `test/missile-aoe-test.js`
- Modify: `src/js/game.js`

**Step 1:** Add failing assertions for four nearby player damage, no distant damage, and no damage while invulnerable.

**Step 2:** Implement the player distance check through `player.takeDamage(4)` and refresh the GUI.

**Step 3:** Run all Node regression tests, `npm run lint`, and `npm run build`.
