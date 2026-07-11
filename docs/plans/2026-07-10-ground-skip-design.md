# Ground Skip Design

## Goal

Let players skip flight mode from the plane-selection screen and begin ground combat immediately.

## Interface

Add a `SKIP` bitmap-text control at the top-right of the class-selection screen. The text uses Phaser's input event system rather than sharing the menu's broad pointer-coordinate handler. It is hidden when the color-selection screen opens.

## Behavior

Selecting `SKIP` stores the currently highlighted plane class and color, clears stale run data, and starts the `ground` state. It does not award flight kills, score, or coins.

## Verification

Add a menu regression test that confirms the selected appearance is preserved and the ground state starts directly. Run all regression tests, lint, and the production build.
