# Ground Player Health Design

## Goal

Give the ground-mode player 10 HP and end the run after 10 valid enemy bullet hits.

## Design

- Change the configured ground player maximum health from 3 to 10.
- Keep enemy bullet damage at one HP per valid hit.
- Keep the existing hit-immunity interval to prevent overlapping bullets from removing multiple HP simultaneously.
- Display `HP 10/10` at the start of ground combat.
- Trigger the existing ground Game Over path when the 10th hit reduces health to zero.

## Verification

- Verify nine spaced hits leave one HP and keep the game active.
- Verify the 10th spaced hit sets health to zero and ends the run.
- Verify the HUD maximum uses 10.
