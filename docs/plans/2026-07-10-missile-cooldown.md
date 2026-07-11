# Missile Cooldown Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Change the homing missile volley cooldown to 500 milliseconds.

**Architecture:** Keep the existing `nextRocketAt` timestamp and per-volley cooldown path. Change the configured delay and verify the exact blocked and allowed timing boundaries.

**Tech Stack:** Phaser 2.2, JavaScript, Node VM assertion tests, Gulp.

---

### Task 1: Set and verify the cooldown

**Files:**
- Modify: `test/homing-missile-test.js`
- Modify: `src/js/boot.js`

**Step 1:** Add a failing assertion that a successful volley sets `nextRocketAt` to current time plus 500 milliseconds.

**Step 2:** Run `node test/homing-missile-test.js` and verify it fails with the current 800-millisecond value.

**Step 3:** Change `CONFIG.ROCKET_DELAY` to `500`.

**Step 4:** Run all Node regression tests, `npm run lint`, and `npm run build`.
