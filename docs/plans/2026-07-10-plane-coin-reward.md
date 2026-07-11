# Plane Coin Reward Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Award two coins for each standard mob plane destroyed and display the coin count at the top-right.

**Architecture:** Plane enemies expose reward metadata. The game state owns the per-run coin total, applies rewards in the existing projectile kill path, and renders the total through the existing GUI update method.

**Tech Stack:** Phaser 2.2, JavaScript, Node assertion tests, Gulp.

---

### Task 1: Add plane coin rewards

**Files:**
- Create: `test/plane-coin-reward-test.js`
- Modify: `src/js/class/flying_mobs.js`
- Modify: `src/js/game.js`

**Step 1: Write the failing test**

Create a Node VM test that invokes the projectile kill path with a plane-like mob carrying `coinReward: 2` and verifies the game coin total becomes two.

**Step 2: Run test to verify it fails**

Run: `node test/plane-coin-reward-test.js`
Expected: FAIL because the kill path does not apply coin rewards.

**Step 3: Write minimal implementation**

Set `Plane.coinReward` to `2`, initialize `Game.coins` to `0`, and add `mob.coinReward || 0` when a projectile kills a mob.

**Step 4: Run test to verify it passes**

Run: `node test/plane-coin-reward-test.js`
Expected: PASS.

### Task 2: Display and verify the counter

**Files:**
- Modify: `src/js/game.js`
- Test: `test/plane-coin-reward-test.js`

**Step 1: Add a failing HUD assertion**

Verify the GUI writes `COINS 2` and right-aligns the fixed-camera label.

**Step 2: Implement the HUD label**

Create `guiCoinText` in `createGUI()` and update its text and x coordinate in `updateGUI()`.

**Step 3: Verify all checks**

Run `node test/plane-coin-reward-test.js`, both existing regression tests, `npm run lint`, and `npm run build`.
