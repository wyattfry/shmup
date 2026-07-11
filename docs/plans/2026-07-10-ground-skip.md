# Ground Skip Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a clickable `SKIP` control to the plane-selection screen that starts ground combat directly.

**Architecture:** The menu owns an input-enabled bitmap text object and a `skipToGround` transition method. The transition persists the highlighted appearance using the same fields as normal game start, clears stale run data, and starts Phaser's `ground` state.

**Tech Stack:** JavaScript, Phaser 2.2, Node assertion tests, Gulp

---

### Task 1: Add the tested ground transition

**Files:**
- Modify: `test/menu-input-test.js`
- Modify: `src/js/menu.js`

**Step 1: Write the failing test**

Instantiate the menu, set a selected class and color, invoke `skipToGround`, and assert that appearance fields are saved, run data is cleared, and `ground` is started.

**Step 2: Run test to verify it fails**

Run: `node test/menu-input-test.js`
Expected: FAIL because `skipToGround` is undefined.

**Step 3: Write minimal implementation**

Add the top-right input-enabled `SKIP` bitmap text in `create`, hide it in `showColorScreen`, and add `skipToGround` to persist selection and start `ground`.

**Step 4: Run test to verify it passes**

Run: `node test/menu-input-test.js`
Expected: PASS.

### Task 2: Verify and publish

**Files:**
- Modify: `dist/main.min.js`

**Step 1: Run complete verification**

Run: `for test_file in test/*.js; do node "$test_file" || exit 1; done && npm run lint && npm run build`
Expected: all tests, lint, and build pass.

**Step 2: Commit and push**

Commit the menu, test, plan, and rebuilt bundle to `gh-pages`, push to `wyattfry/shmup`, and confirm the Pages workflow succeeds.
