# Missile Cooldown Design

## Goal

Set the homing missile volley cooldown to 0.5 seconds.

## Behavior

- A successful missile volley starts a 500-millisecond cooldown.
- Pressing or holding `E` during the cooldown launches nothing.
- A new volley may launch once 500 milliseconds have elapsed.
- Attempts with no available targets do not consume the cooldown.
- Volley size, unique targeting, launch phase, turning, and damage remain unchanged.

## Verification

Test that a second volley is blocked before 500 milliseconds and allowed at the 500-millisecond boundary.
