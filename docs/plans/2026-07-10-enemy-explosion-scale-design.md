# Enemy Explosion Scale Design

## Goal

Make standard mob plane explosions twice their current size and flagship explosions five times their current size.

## Design

- Add an `explosionScale` property to enemy types that need custom sizing.
- Set standard `Plane` enemies to `2`.
- Set `Flagship` enemies to `5`.
- Keep vessels, turrets, and the player at the existing default scale of `1`.
- Have the shared `explode()` function multiply `CONFIG.PIXEL_RATIO` by the object's explosion scale.
- Apply the same sizing whether a plane is destroyed by a projectile or by colliding with the player.

## Verification

- Verify a plane creates a `2 * PIXEL_RATIO` explosion.
- Verify a flagship creates a `5 * PIXEL_RATIO` explosion.
- Verify an object without custom scaling remains at `PIXEL_RATIO`.
- Run all regression tests, lint, and the full build.
