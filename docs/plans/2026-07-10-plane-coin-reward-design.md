# Plane Coin Reward Design

## Goal

Award two coins whenever the player destroys a standard mob plane and show the current coin total at the top-right of the game screen.

## Design

- Add a `coinReward` property to standard `Plane` enemies with a value of `2`.
- Keep coins separate from the existing score.
- Initialize the game's coin count to zero at the start of each game.
- When a player projectile kills an enemy, add its `coinReward` when present.
- Add a fixed-camera bitmap text label at the top-right and refresh it through the existing GUI update path.
- Vessels, flagships, and ground enemies award no coins unless given a reward later.

## Verification

- A regression test verifies that killing a plane adds exactly two coins.
- A regression test verifies that enemies without a coin reward add no coins.
- Lint and the full distribution build must pass.
