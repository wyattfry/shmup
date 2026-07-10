# Ground Combat Mode Design

## Goal

After destroying 20 standard planes, transition into a top-down pixel ground fight. The player must defeat 50 armed enemy soldiers, survive with three-hit health, find their plane, and board it through a takeoff cutscene before returning to flight.

## State Architecture

- Add a separate Phaser `ground` state in `src/js/ground.js`.
- Keep flight and ground physics, controls, entities, and cameras isolated.
- Store run progress on `game.runData` before changing states.
- Preserve selected plane class/color, score, coins, player upgrades, and flight health.
- Mark the ground encounter complete so the 20-kill trigger occurs only once per run.

## Flight Transition

- Track standard plane kills separately from score and coins.
- Direct, bullet, rocket, and missile-AOE plane kills all count.
- On the 20th plane kill, save run data and transition to `ground` after the current collision callback completes.
- Returning from ground recreates flight using the saved player stats and run totals.

## Ground Arena

- Use a full-screen top-down arena with generated pixel-art grass, paths, trees, player soldier, enemy soldiers, bullets, rockets, and a parked plane.
- Trees act as obstacles for soldiers and projectiles.
- Maintain a bounded arena larger than the viewport with a following camera.

## Player Controls

- `WASD`: move in eight directions.
- The last non-zero movement direction becomes the facing and firing direction.
- `Space`: fire a rifle bullet.
- `E`: launch a rocket in the facing direction.
- Ground rockets have a one-second cooldown and explode on the first enemy or obstacle hit.
- Ground rocket explosions instantly kill nearby enemy soldiers.

## Enemy Combat

- Keep a manageable active group of enemy soldiers until 50 total are defeated.
- Enemies approach the player, stop at firing distance, and shoot toward the player.
- Enemy bullets remove one of the player's three hit points.
- Brief hit invulnerability prevents one overlapping volley from consuming multiple hit points immediately.
- At zero health, show Game Over and return to the plane-selection menu.

## Win And Cutscene

- At 50 enemy kills, stop spawning enemies and reveal the parked plane.
- The player must walk into the plane.
- Boarding disables controls and combat, moves the soldier into the plane, hides the soldier, and animates the plane taking off.
- When takeoff completes, mark the encounter complete and return to the flight state with saved run data.

## HUD

- Show three-hit health.
- Show `KILLS n/50`.
- Show rocket readiness/cooldown.
- During the boarding phase, show the objective to reach the plane.

## Verification

- Test the 20-plane transition and one-time encounter flag.
- Test eight-direction movement and facing.
- Test rifle and rocket cooldowns/directions.
- Test enemy kill count, three-hit player death, and 50-kill plane reveal.
- Test boarding and return-to-flight state changes.
- Run all existing regression tests, lint, and the full build.
