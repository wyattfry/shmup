# Missile AOE Design

## Goal

Give homing missiles an area explosion that can instantly kill nearby mobs and damage the player.

## Behavior

- A missile direct hit keeps its existing 120 damage.
- On impact, scan a radius equal to four standard plane widths.
- Instantly kill up to four additional living mobs within that radius.
- Search flying and ground enemy pools.
- Do not count the direct-hit mob as one of the four additional AOE victims.
- Award normal score and coins for AOE kills.
- Show normal death explosions and flagship pilot text for AOE kills.
- Deal 4 damage to the player when inside the same radius.
- Respect the player's temporary invulnerability power-up.
- AOE deaths do not create another AOE detonation.

## Architecture

- Mark pooled rocket projectiles with `isRocket`.
- Route rocket impacts through a dedicated detonation method from the existing projectile collision callback.
- Extract shared enemy death rewards and effects so direct and AOE kills behave consistently.
- Use squared-distance checks and cap additional victims at four.

## Verification

- Verify nearby mobs are killed and distant mobs survive.
- Verify the direct target is excluded from the four additional victims.
- Verify no more than four additional mobs die.
- Verify nearby player damage is 4 and invulnerability blocks it.
- Verify score and coins include AOE victims.
- Run all regression tests, lint, and the full build.
