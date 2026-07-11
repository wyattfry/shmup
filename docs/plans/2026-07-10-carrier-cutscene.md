# Carrier Cutscene Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a carrier landing and general debrief cutscene after the player recovers the plane.

**Architecture:** A new `CarrierCutscene` Phaser state owns generated pixel textures, tweens, dialogue, and mission completion. Ground boarding persists summary data and starts this state, which eventually returns to `menu`.

**Tech Stack:** JavaScript, Phaser 2.2 tweens/input, generated bitmap textures, Node assertion tests, Gulp

---

### Task 1: Register and enter the carrier state

**Files:**
- Create: `src/js/carrier.js`
- Modify: `src/js/main.js`
- Modify: `gulpfile.js`
- Modify: `src/js/ground.js`
- Modify: `test/ground-combat-test.js`
- Create: `test/carrier-cutscene-test.js`

1. Add failing tests for ground boarding starting `carrier` with summary data.
2. Add the new state constructor and register/build it.
3. Update `finishBoarding` to start `carrier`.
4. Run focused tests.

### Task 2: Build the takeoff and landing sequence

**Files:**
- Modify: `src/js/carrier.js`
- Modify: `test/carrier-cutscene-test.js`

1. Add failing phase-progression tests.
2. Generate ocean, carrier, deck, plane, soldier, and general visuals.
3. Implement approach, descent, landing, soldier exit, and walk tweens.
4. Run focused tests.

### Task 3: Add dialogue and mission completion

**Files:**
- Modify: `src/js/carrier.js`
- Modify: `test/carrier-cutscene-test.js`

1. Add failing tests for click-advanced dialogue and mission completion.
2. Add the surprise general dialogue.
3. Show kills and coins on the mission-complete view.
4. Add a return-to-menu input control and input cleanup.
5. Run focused and complete tests.

### Task 4: Verify and deploy

**Files:**
- Modify: `dist/main.min.js`

1. Run all tests, lint, and build.
2. Browser-verify nonblank ocean/carrier visuals, tween phases, dialogue, mission completion, menu return, and runtime errors.
3. Commit source, tests, plan, and generated bundle.
4. Push `gh-pages` and confirm Pages deployment.
