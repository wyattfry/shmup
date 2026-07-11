# Upright Soldiers Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep player and enemy soldier sprites upright while retaining directional projectiles and stable player visibility after nonfatal hits.

**Architecture:** Movement and AI continue calculating logical direction vectors. Sprite angle writes are removed from those paths, while projectile velocity calculations remain unchanged.

**Tech Stack:** Phaser 2.2, JavaScript, Node VM assertion tests, Gulp.

---

### Task 1: Lock soldier orientation

**Files:**
- Modify: `test/ground-combat-test.js`
- Modify: `src/js/ground.js`

**Steps:**
1. Add failing assertions that player and enemy angles remain zero after directional movement/aiming.
2. Verify projectile vectors still use logical facing.
3. Remove soldier rotation writes and rerun the ground test.

### Task 2: Preserve player visibility after damage

**Files:**
- Modify: `test/ground-combat-test.js`
- Modify: `src/js/ground.js`

**Steps:**
1. Assert one valid hit leaves the player visible, existing, alive, and at 9 HP.
2. Preserve those sprite flags after nonfatal damage.
3. Run all regression tests, `npm run lint`, and `npm run build`.
4. Reproduce a real enemy hit in the browser and inspect sprite state.
