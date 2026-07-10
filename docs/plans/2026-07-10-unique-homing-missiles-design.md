# Unique Homing Missiles Design

## Goal

Pressing `E` launches up to three homing missiles, with every missile assigned to a different standard mob plane.

## Behavior

- Select the nearest living, visible standard planes that are not already targeted by active missiles.
- Launch at most three missiles per volley.
- If fewer than three untargeted planes exist, do not launch the extra missiles.
- If no target exists, launch nothing and do not consume the rocket cooldown.
- Each missile continually steers toward its assigned target and rotates to face its travel direction.
- If the assigned target dies or leaves play, remove the missile rather than retargeting it.
- Keep the existing rocket damage, collision behavior, pool, sound, and cooldown.

## Target Ownership

Each active missile stores a `target` reference. Target availability is derived by scanning active missiles, avoiding reservation state on pooled enemies and the cleanup risks that would create.

## Verification

- Verify one `E` volley assigns three different targets when three are available.
- Verify fewer missiles launch when fewer unique targets are available.
- Verify already-targeted planes are skipped.
- Verify missiles steer toward their targets and disappear when targets become invalid.
- Run all regression tests, lint, and the full distribution build.
