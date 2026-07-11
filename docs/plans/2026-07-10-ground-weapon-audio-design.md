# Ground Weapon Audio And Objective Design

## Goal

Add launch sounds to ground weapons and reduce the ground objective from 50 enemy kills to 20.

## Audio

Ground combat creates two local audio objects from existing preloaded assets. The rifle uses `shoot_player_1`, while the rocket launcher uses the heavier `shoot_player_5`. A sound plays only after a projectile is successfully obtained from its pool and launched, so cooldown attempts and exhausted pools remain silent.

## Objective

Set `GROUND_ENEMY_KILLS` to 20. The shared constant already controls enemy spawning, HUD progress, plane reveal, and boarding eligibility, keeping all objective behavior synchronized.

## Verification

Regression tests verify the 20-kill threshold and exactly one sound per successful rifle or rocket launch. Full tests, lint, build, browser audio-object checks, and Pages deployment must pass.
