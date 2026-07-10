# Missile Straight Launch Phase Design

## Goal

Make homing missiles launch straight upward for 0.2 seconds and then turn gradually, allowing moving planes to evade them.

## Behavior

- Every missile starts with straight upward velocity.
- Homing begins 200 milliseconds after launch.
- Once homing begins, the heading changes by a limited number of degrees per second instead of snapping directly toward the target.
- Missile speed remains constant while turning.
- Unique target assignment, volley size, damage, cooldown, and invalid-target cleanup remain unchanged.

## State

Each missile stores `homingStartsAt` and `heading`. The update loop preserves the launch heading until the delay expires, then moves the heading toward the desired target angle by at most the configured turn rate for that frame.

## Verification

- Verify velocity remains straight before 200 milliseconds.
- Verify horizontal steering begins after 200 milliseconds.
- Verify a single update cannot rotate farther than the configured turn-rate limit.
- Run all regression tests, lint, and the full build.
