# Main Menu And Shop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `START`/`SHOP` main menu with permanent coins, global upgrades, and purchasable colors.

**Architecture:** A shared `Progress` helper owns guarded local-storage data and atomic purchases. New `Home` and `Shop` Phaser states use that helper, while flight rewards, player stats, and color selection consume the same progress record.

**Tech Stack:** JavaScript, Phaser 2.2, localStorage JSON, Node assertion tests, Gulp

---

### Task 1: Build persistent progress

**Files:**
- Create: `src/js/progress.js`
- Create: `test/progress-test.js`
- Modify: `src/index.html`
- Modify: `gulpfile.js`

1. Add failing tests for defaults, save/load, malformed storage, coin awards, and atomic purchases.
2. Implement versioned progress data with guarded storage and in-memory fallback.
3. Register the helper before game states and run focused tests.

### Task 2: Add home and shop states

**Files:**
- Create: `src/js/home.js`
- Create: `src/js/shop.js`
- Create: `test/home-shop-test.js`
- Modify: `src/js/main.js`
- Modify: `src/js/preloader.js`
- Modify: `src/js/carrier.js`
- Modify: `src/js/ground.js`
- Modify: `gulpfile.js`
- Modify: `src/index.html`

1. Add failing navigation tests for home→menu, home→shop, shop→home, mission→home, and game-over→home.
2. Build input-enabled home controls and wallet display.
3. Build shop item rows, purchase feedback, and back navigation.
4. Register states and route all terminal flows through home.
5. Run focused tests.

### Task 3: Persist coin rewards

**Files:**
- Modify: `src/js/game.js`
- Modify: `test/plane-coin-reward-test.js`

1. Add failing tests that plane kills award the persistent wallet exactly once.
2. Load wallet balance for HUD display and save rewards immediately.
3. Prevent run-data restoration from duplicating rewards.
4. Run focused tests.

### Task 4: Apply global upgrades

**Files:**
- Modify: `src/js/class/player.js`
- Modify: `src/js/menu.js`
- Modify: `test/player-class-five-test.js`
- Modify: `test/menu-input-test.js`

1. Add failing tests for armor, engine, weapons, and fire-control bonuses on multiple classes.
2. Apply saved upgrades to runtime player stats.
3. Show upgraded values on class profiles.
4. Run focused tests.

### Task 5: Add premium cosmetics

**Files:**
- Modify: `src/js/boot.js`
- Modify: `src/js/menu.js`
- Modify: `src/js/shop.js`
- Modify: `test/menu-input-test.js`
- Modify: `test/home-shop-test.js`

1. Add premium color definitions and failing lock/unlock tests.
2. Sell gold, cyan, and shadow colors in the shop.
3. Render premium swatches with lock/price state and reject locked selection.
4. Run focused and complete tests.

### Task 6: Verify and deploy

1. Run `npm test`, lint, and build.
2. Browser-verify home/shop layout, purchases, insufficient funds, wallet persistence after reload, upgraded stats, premium color gating, and all return flows.
3. Commit source, tests, plan, and source assets.
4. Rebase on remote changes if needed, push `gh-pages`, and confirm GitHub Pages deployment.
