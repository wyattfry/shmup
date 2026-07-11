# Unlockable Fifth Plane Design

## Goal

Reward mission completion with a permanent fifth plane class that has a unique sprite, animation, stats, and weapon behavior.

## Unlock Flow

The class-selection screen always shows a fifth row. Before unlock, it uses a dark silhouette and hides the class identity and stats behind a mission-completion message. Locked input cannot select or confirm the fifth class.

The carrier mission-complete phase writes an unlock flag to browser `localStorage` and mirrors it on the Phaser game object. If storage throws or is unavailable, the in-memory flag preserves the unlock for the current session. The completion screen announces the reward without requiring another action.

On the next menu state, the fifth row reveals the actual sprite, name, and stats. Arrow navigation, pointer selection, and the `5` key support it after unlock. Existing color selection, flight, ground recovery, and carrier landing use the same `player_5` asset key and selected-class data flow.

## Plane Identity

The fifth plane uses a new 120×32 transparent sprite sheet containing five 24×28 movement frames. Its name, visual design, stat balance, and weapon specialty are intentionally omitted from user-facing progress updates so discovery remains a surprise.

## Persistence

Use a versioned local-storage key dedicated to the unlock. Reading and writing are wrapped in `try/catch` so privacy settings or storage quotas cannot break the menu or cutscene.

## Verification

Tests cover locked display and selection rejection, mission unlock persistence, unlocked selection through key/pointer/navigation paths, fifth-class stats, and asset preload registration. Full tests, lint, build, sprite-sheet visual inspection, browser unlock flow, and Pages deployment must pass.
