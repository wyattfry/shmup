'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var stored = null;

var context = {
	window: {
		localStorage: {
			getItem: function () { return stored; },
			setItem: function (key, value) { stored = value; }
		}
	}
};

vm.runInNewContext(fs.readFileSync('src/js/progress.js', 'utf8'), context);

var Progress = context.window.firsttry.Progress;
var game = {};
var data = Progress.load(game);
assert.strictEqual(data.coins, 0, 'new progress must start with zero coins');
assert.strictEqual(data.upgrades.armor, 0, 'new progress must start without upgrades');
assert.strictEqual(data.colors.length, 0, 'new progress must start without premium colors');

Progress.addCoins(game, 100);
assert.strictEqual(game.progressData.coins, 100, 'coin awards must update the wallet');
assert.ok(/"coins":100/.test(stored), 'coin awards must persist immediately');

var armorPrice = Progress.getUpgradePrice('armor', 0);
assert.strictEqual(Progress.buyUpgrade(game, 'armor'), true, 'affordable upgrades must be purchased');
assert.strictEqual(game.progressData.upgrades.armor, 1, 'purchases must increase upgrade level');
assert.strictEqual(game.progressData.coins, 100 - armorPrice, 'upgrade purchases must subtract their price');
assert.ok(Progress.getUpgradePrice('armor', 1) > armorPrice, 'upgrade prices must increase by level');

game.progressData.coins = 0;
assert.strictEqual(Progress.buyUpgrade(game, 'engine'), false, 'unaffordable upgrades must be rejected');
assert.strictEqual(game.progressData.upgrades.engine, 0, 'rejected purchases must not grant upgrades');

game.progressData.coins = 100;
assert.strictEqual(Progress.buyColor(game, 'gold', 25), true, 'affordable cosmetics must be purchased');
assert.strictEqual(Progress.ownsColor(game, 'gold'), true, 'purchased cosmetics must remain owned');
assert.strictEqual(Progress.buyColor(game, 'gold', 25), false, 'owned cosmetics must not charge twice');

stored = '{broken json';
game = {};
data = Progress.load(game);
assert.strictEqual(data.coins, 0, 'malformed storage must recover to safe defaults');

console.log('persistent progress regression test passed');
