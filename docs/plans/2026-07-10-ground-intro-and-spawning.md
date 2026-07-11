# Ground Intro And Spawning Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a player-plane landing transformation, visibly armed soldier art, and one-at-a-time enemy spawning capped at three.

**Architecture:** Ground mode starts in `intro`, transitions to `play` through a tween callback, and initializes its spawn timer there. `maintainEnemyCount()` becomes a single-spawn gate based on mode, total kills, living count, and `nextEnemySpawnAt`.

**Tech Stack:** Phaser 2.2, JavaScript, generated BitmapData pixel art, Node VM assertion tests, Gulp.

---

### Task 1: Timed capped spawning

**Files:**
- Modify: `test/ground-combat-test.js`
- Modify: `src/js/boot.js`
- Modify: `src/js/ground.js`

**Steps:**
1. Add failing tests requiring one spawn per eligible update, a 1.5-second delay, and a maximum of three living enemies.
2. Replace the immediate fill loop with a timed single-spawn gate.
3. Run the ground combat test until it passes.

### Task 2: Landing transformation and weapon art

**Files:**
- Modify: `test/ground-combat-test.js`
- Modify: `src/js/ground.js`

**Steps:**
1. Add a failing test requiring intro completion to reveal the soldier, set play mode, and initialize enemy timing.
2. Add the selected-plane descent tween and touchdown swap.
3. Expand generated player art with an AK-47 and back-mounted launcher; retain visible enemy rifles.
4. Run all Node regression tests, `npm run lint`, and `npm run build`.
5. Verify intro and spawn pacing in the running browser.
