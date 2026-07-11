# Missile Straight Launch Phase Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a 0.2-second straight launch and frame-rate-independent limited turning to homing missiles.

**Architecture:** Each launched rocket records its homing start time, current heading, and last steering update. The rocket update keeps the initial heading during launch, then advances the heading toward the target by no more than the configured turn rate multiplied by elapsed time.

**Tech Stack:** Phaser 2.2, JavaScript, Node VM assertion tests, Gulp.

---

### Task 1: Straight launch timing

**Files:**
- Modify: `test/homing-missile-test.js`
- Modify: `src/js/boot.js`
- Modify: `src/js/class/player.js`

**Step 1: Write a failing test**

Verify a newly launched missile keeps zero horizontal velocity before 200 milliseconds have elapsed.

**Step 2: Run test to verify it fails**

Run `node test/homing-missile-test.js`; expect the missile to steer too early.

**Step 3: Implement the launch timestamp**

Add `ROCKET_HOMING_DELAY: 200`, initialize rocket timing state at launch, and skip steering until `homingStartsAt`.

**Step 4: Run test to verify it passes**

Run `node test/homing-missile-test.js`; expect PASS for straight launch behavior.

### Task 2: Limited homing turns

**Files:**
- Modify: `test/homing-missile-test.js`
- Modify: `src/js/boot.js`
- Modify: `src/js/class/player.js`

**Step 1: Write a failing turn-limit test**

Verify steering begins after the delay but cannot rotate farther than the configured degrees-per-second limit for one update.

**Step 2: Implement angle normalization and capped turning**

Add `ROCKET_TURN_RATE`, calculate the shortest signed angle difference, clamp it to `turnRate * delta`, then rebuild velocity from the new heading.

**Step 3: Verify all checks**

Run all Node regression tests, `npm run lint`, and `npm run build`.
