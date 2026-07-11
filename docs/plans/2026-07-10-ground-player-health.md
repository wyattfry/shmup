# Ground Player Health Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the ground player survive nine valid bullet hits and end the run on the 10th.

**Architecture:** Continue using `CONFIG.GROUND_PLAYER_HEALTH` as the single source for initialization and HUD maximum. Change it to 10 and extend the existing hit-immunity-aware regression.

**Tech Stack:** Phaser 2.2, JavaScript, Node VM assertion tests, Gulp.

---

### Task 1: Ten-hit health boundary

**Files:**
- Modify: `test/ground-combat-test.js`
- Modify: `src/js/boot.js`

**Steps:**
1. Update the test fixture to use the real configured health and assert nine spaced hits leave one HP without Game Over.
2. Assert the 10th spaced hit produces zero HP and Game Over.
3. Run the test and verify it fails with the current three-HP configuration.
4. Set `GROUND_PLAYER_HEALTH` to `10`.
5. Run all regression tests, `npm run lint`, and `npm run build`.
