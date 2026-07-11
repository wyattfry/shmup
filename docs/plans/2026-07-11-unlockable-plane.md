# Unlockable Fifth Plane Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a permanent mission-unlocked fifth plane class with unique visuals and gameplay.

**Architecture:** A shared unlock helper reads/writes a guarded local-storage flag and mirrors it on the game object. Menu selection gates class five, while the existing selected-class pipeline carries its config and sprite through flight, ground, and carrier states.

**Tech Stack:** JavaScript, Phaser 2.2, localStorage, PNG sprite sheet, Node assertion tests, Gulp

---

### Task 1: Create and preload the fifth plane asset

**Files:**
- Create: `src/assets/player_ship_5.png`
- Modify: `src/js/preloader.js`
- Modify: `src/js/boot.js`
- Modify: `test/menu-input-test.js`

1. Add failing tests for fifth-class stats and preload registration.
2. Create a 120×32 transparent five-frame pixel sprite sheet.
3. Register `player_5` and add the balanced class profile.
4. Inspect all five frames and run focused tests.

### Task 2: Add persistence and locked menu behavior

**Files:**
- Modify: `src/js/menu.js`
- Modify: `test/menu-input-test.js`

1. Add failing tests for locked display, class-five rejection, storage fallback, and unlocked selection.
2. Add guarded unlock reads and a locked fifth profile row.
3. Support arrow, click, and `5` selection only when unlocked.
4. Run focused tests.

### Task 3: Award the plane after the carrier mission

**Files:**
- Modify: `src/js/carrier.js`
- Modify: `test/carrier-cutscene-test.js`

1. Add failing tests for unlock persistence at mission completion.
2. Write the versioned unlock flag with in-memory fallback.
3. Add the unlock announcement to mission completion.
4. Run focused and complete tests.

### Task 4: Add the surprise gameplay specialty

**Files:**
- Modify: `src/js/class/player.js`
- Add or modify focused player test coverage.

1. Add failing tests for the fifth class's specialty.
2. Implement the specialty using existing projectile and cooldown systems.
3. Run focused and complete tests.

### Task 5: Verify and deploy

**Files:**
- Modify: `dist/main.min.js`
- Add generated asset under `dist/assets/` through the build.

1. Run all tests, lint, and build.
2. Browser-verify locked row, mission unlock, permanent reload, selection, animation, color, flight specialty, ground recovery, and carrier rendering.
3. Commit source, tests, asset, plan, and generated bundle.
4. Push `gh-pages` and confirm Pages deployment.
