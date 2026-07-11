# Unique Homing Missiles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `E` launch up to three homing missiles with a unique standard-plane target for every missile.

**Architecture:** The player selects targets from `state.mobPools[0]`, excluding planes referenced by active rockets and targets already selected for the current volley. Each rocket stores its target and updates its velocity and angle every frame until the target becomes invalid.

**Tech Stack:** Phaser 2.2, JavaScript, Node VM assertion tests, Gulp.

---

### Task 1: Unique target selection and volley launch

**Files:**
- Create: `test/homing-missile-test.js`
- Modify: `src/js/class/player.js`

**Step 1: Write the failing test**

Load the player class in a VM with lightweight Phaser stubs. Verify `fireRocket()` launches three rockets with three distinct targets, skips a plane targeted by an existing rocket, and launches fewer rockets when fewer targets are free.

**Step 2: Run test to verify it fails**

Run: `node test/homing-missile-test.js`
Expected: FAIL because the current method launches one untargeted straight rocket.

**Step 3: Implement target selection and volley launch**

Add helpers that gather active rocket targets, sort valid planes by squared distance to the player, and launch one pooled rocket for each of the first three available targets. Store the selected plane in `rocket.target` and only start cooldown and sound when at least one missile launches.

**Step 4: Run test to verify it passes**

Run: `node test/homing-missile-test.js`
Expected: PASS.

### Task 2: Homing motion and invalid-target cleanup

**Files:**
- Modify: `test/homing-missile-test.js`
- Modify: `src/js/class/player.js`

**Step 1: Add failing movement tests**

Verify an active missile points and moves toward its target, and verify it is killed and clears its target when that target is no longer alive or visible.

**Step 2: Implement missile steering**

During `updateBullets()`, calculate the target angle with `Math.atan2`, set velocity using sine/cosine at the configured speed, and rotate the missile sprite. Kill missiles whose target is invalid.

**Step 3: Verify all checks**

Run the homing test, all existing regression tests, `npm run lint`, and `npm run build`.
