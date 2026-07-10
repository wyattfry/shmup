# Player Turning And Enemy Health Design

## Goal

Rotate the player soldier when movement direction changes and make enemy soldiers require two AK-47 hits.

## Player Turning

- Update the player sprite angle only when WASD produces a non-zero movement direction.
- Preserve that angle while the player is stationary.
- Keep the logical facing vector synchronized with the visual direction.
- Fire AK-47 bullets and rockets in the same last movement direction.
- Keep enemy soldier sprites visually facing upward.

## Enemy Health

- Give every spawned enemy soldier 2 HP.
- AK-47 bullets deal 1 damage.
- The first hit briefly flashes the enemy and does not increment the kill counter.
- The second hit defeats the enemy and increments the kill counter once.
- Ground rocket explosions continue to defeat enemies instantly.
- Reset pooled enemy health and tint on every spawn.

## Verification

- Verify diagonal movement rotates the player and updates logical facing.
- Verify stopping preserves the last angle.
- Verify enemy sprite angle remains zero.
- Verify first rifle hit leaves an enemy alive at 1 HP.
- Verify second rifle hit kills and counts once.
- Verify spawned pooled enemies reset to 2 HP.
