# Main Menu And Shop Design

## Goal

Add a main menu with `START` and `SHOP`, plus a permanent coin wallet that purchases global plane upgrades and cosmetic colors.

## Navigation

The game opens in a new `home` Phaser state showing the `GUNNER` title, saved coin balance, `START`, and `SHOP`. `START` opens the existing plane-selection state. `SHOP` opens a dedicated shop state. The shop has an explicit `BACK` command that returns home. Mission completion and game-over flows return home rather than bypassing it.

## Persistent Progress

A shared progress helper stores one versioned JSON record in browser `localStorage`. The record contains wallet coins, four global upgrade levels, and purchased cosmetic identifiers. Reads, writes, malformed data, and unavailable storage are guarded; an in-memory copy keeps the current session usable.

Coins awarded for defeated enemy planes are added immediately to the permanent wallet. Shop purchases atomically check funds, subtract price, grant the item, and save. Existing run data carries the wallet value only for display and never duplicates coin awards.

## Upgrade Shop

Four global upgrades apply to every plane class:

- Armor adds maximum health.
- Engine adds movement speed.
- Weapons adds bullet strength.
- Fire Control improves firing rate.

Each item supports multiple levels. Prices increase by level, purchased items display their current level, and capped items display `MAX`.

## Cosmetic Shop

The shop sells permanent gold, cyan, and shadow colors. Existing five colors remain free. Purchased colors join the color-selection screen; locked premium colors display a lock/price indicator and reject selection until purchased.

## Interaction And Feedback

Home and shop commands use input-enabled bitmap text with stable hit areas. Mouse input is primary, with arrow navigation and confirm/back keyboard controls. Failed purchases display `NOT ENOUGH COINS`; successful purchases update the wallet and item state immediately.

## Verification

Tests cover progress defaults and malformed storage, immediate coin persistence, purchase accounting, upgrade application to all classes, cosmetic gating, home/shop navigation, and return-flow routing. Full tests, lint, build, browser purchase/reload checks, responsive text-bound checks, and Pages deployment must pass.
