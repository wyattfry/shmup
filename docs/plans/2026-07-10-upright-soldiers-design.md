# Upright Soldiers Design

## Goal

Keep every ground soldier visually facing upward while preserving directional weapon fire, and guarantee nonfatal player hits do not hide the player sprite.

## Design

- Keep the player soldier sprite angle fixed at zero.
- Continue updating the player's logical facing vector from the last WASD movement direction.
- Continue firing AK-47 bullets and rockets along that logical direction.
- Keep enemy soldier sprite angles fixed at zero.
- Continue aiming enemy bullets toward the player with velocity vectors.
- After nonfatal player damage, preserve the player's visible, existing, and alive state.
- Keep the player hidden only during landing and boarding transitions.

## Verification

- Verify diagonal movement updates logical facing while player angle remains zero.
- Verify player projectiles still travel diagonally.
- Verify enemy aim updates bullets without rotating the enemy sprite.
- Verify one hit changes health from 10 to 9 without hiding or killing the player.
