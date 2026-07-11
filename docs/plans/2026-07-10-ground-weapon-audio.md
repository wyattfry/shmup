# Ground Weapon Audio And Objective Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Play ground rifle/rocket launch sounds and reveal the plane after 20 enemy kills.

**Architecture:** GroundGame will own two Phaser audio objects created during state setup. Existing fire methods play them only after successful projectile launch, while the existing shared kill constant changes from 50 to 20.

**Tech Stack:** JavaScript, Phaser 2.2 audio, Node assertion tests, Gulp

---

### Task 1: Reduce the objective

**Files:**
- Modify: `src/js/boot.js`
- Modify: `test/ground-combat-test.js`

1. Add a failing assertion for a 20-kill objective.
2. Change `GROUND_ENEMY_KILLS` to 20 and update the test fixture.
3. Run the focused regression test.

### Task 2: Add successful-launch audio

**Files:**
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`

1. Add failing tests for one rifle sound and one rocket sound per successful launch.
2. Create ground audio objects during state setup.
3. Play sounds after successful launch, not on cooldown or pool exhaustion.
4. Run focused and complete tests.

### Task 3: Verify and deploy

**Files:**
- Modify: `dist/main.min.js`

1. Run all tests, lint, and build.
2. Browser-verify audio objects, 20-kill HUD/plane reveal, and runtime errors.
3. Commit, push `gh-pages`, and confirm Pages deployment.
