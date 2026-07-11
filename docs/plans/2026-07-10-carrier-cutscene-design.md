# Carrier Cutscene Design

## Goal

Finish the ground mission with a cinematic takeoff, aircraft-carrier landing, soldier deplaning, general dialogue, and mission-complete screen.

## State Flow

Boarding the recovered plane starts a dedicated `carrier` Phaser state instead of returning to flight. The separate state owns all cinematic objects and timing, keeping active ground enemies, camera bounds, and controls out of the sequence.

## Sequence

1. The selected plane flies over an ocean toward a large pixel-art carrier.
2. The carrier deck enters frame and the plane descends to a marked landing area.
3. The plane stops and the blue soldier exits onto the deck.
4. The soldier walks to a uniformed general.
5. A dialogue panel presents several short lines. Clicks advance the conversation.
6. The final click opens a mission-complete view with enemy kills and coins plus a return-to-menu control.

The general's exact dialogue remains intentionally undocumented in user-facing updates so it is a surprise.

## Visuals

The carrier, ocean, deck markings, soldier, and general use generated pixel textures consistent with the existing ground mode. The carrier fills most of the play area rather than appearing as a small decorative object.

## Input And Data

Input is locked during flight, landing, and walking. Pointer input is enabled only for dialogue progression and the mission-complete return control. Existing `game.runData`, selected plane class, selected color, ground kills, and coins provide scene appearance and summary data.

## Verification

Regression tests cover the ground-to-carrier transition, cinematic phase progression, dialogue completion, mission summary, and menu return. Full tests, lint, build, browser animation checks, and Pages deployment must pass.
