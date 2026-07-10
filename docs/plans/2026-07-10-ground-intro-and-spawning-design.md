# Ground Intro And Spawning Design

## Goal

Show the player's plane becoming an armed ground soldier and pace hostile soldiers one at a time with at most three alive.

## Intro Cutscene

- Ground mode begins in an `intro` phase with controls and combat disabled.
- The selected, tinted player plane descends into the arena.
- At touchdown the plane hides and the player soldier appears in the same position.
- Ground combat then enters the normal `play` phase.

## Soldier Weapons

- Redraw the player soldier texture with a visible pixel AK-47 and a rocket launcher carried on the back.
- Keep `Space` as automatic AK-47 fire while held.
- Keep `E` as the rocket launcher with a one-second cooldown.
- Draw hostile soldiers with visible rifles.

## Enemy Pacing

- Set the active hostile limit to three.
- Spawn one hostile every 1.5 seconds.
- Never fill multiple open slots in one update.
- Pause spawning at 50 total kills and during intro, boarding, or game over.
- When a hostile dies, the replacement still obeys the spawn timer.

## Verification

- Verify intro mode prevents combat and changes to play after touchdown.
- Verify the player appears where the plane landed.
- Verify only one enemy spawns per eligible update.
- Verify the 1.5-second interval and three-enemy cap.
- Verify all existing controls and objectives still pass.
