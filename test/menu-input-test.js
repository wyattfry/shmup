'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var bootSource = fs.readFileSync('src/js/boot.js', 'utf8');
var preloaderSource = fs.readFileSync('src/js/preloader.js', 'utf8');
var menuSource = fs.readFileSync('src/js/menu.js', 'utf8');
var indexSource = fs.readFileSync('src/index.html', 'utf8');

assert.ok(/'GUNNER'/.test(menuSource), 'the plane-selection screen must use the GUNNER title');
assert.ok(/<title>GUNNER<\/title>/.test(indexSource), 'the browser tab must use the GUNNER title');

assert.strictEqual((bootSource.match(/className:/g) || []).length, 5,
	'the game must define five player class profiles');
assert.ok(/load\.spritesheet\('player_5',\s*'assets\/player_ship_5\.png',\s*24,\s*28\)/.test(preloaderSource),
	'the preloader must register the fifth plane sprite sheet');

var context = {
	CONFIG: {
		CLASS_STATS: [{}, {}, {}, {}, {}],
		PLAYER_COLORS: [
			{ tint: 0xffffff },
			{ tint: 0xff6666 },
			{ id: 'gold', tint: 0xffcc33, price: 25, premium: true }
		]
	},
	Phaser: { Keyboard: { W: 87 } },
	window: {}
};

vm.runInNewContext(fs.readFileSync('src/js/menu.js', 'utf8'), context);

var Menu = context.window.firsttry.Menu;
var menu = new Menu();
var confirmations = 0;

menu.menuMode = 'color';
menu.input = {
	keyboard: {
		isDown: function () {
			return true;
		}
	}
};
menu.updateColorInput = function () {};
menu.confirmMenu = function () {
	confirmations += 1;
};

menu.update();

assert.strictEqual(confirmations, 0, 'holding W must not start the game from the color screen');

var skippedState = null;
menu.selectedPlayerClass = 3;
menu.selectedPlayerColorIndex = 1;
menu.game = {
	runData: { stale: true },
	state: {
		start: function (stateName) {
			skippedState = stateName;
		}
	}
};
menu.skipToGround();
assert.strictEqual(menu.game.selectedPlayerClass, 3, 'skip must preserve the highlighted plane class');
assert.strictEqual(menu.game.selectedPlayerColorIndex, 1, 'skip must preserve the selected color index');
assert.strictEqual(menu.game.selectedPlayerColor, 0xff6666, 'skip must preserve the selected plane color');
assert.strictEqual(menu.game.runData, null, 'skip must clear stale run data');
assert.strictEqual(skippedState, 'ground', 'skip must start ground combat directly');

menu.game = { selectedPlayerClass: 4, plane5Unlocked: false };
menu.selectedPlayerClass = 4;
menu.plane5Unlocked = false;
menu.updateProfileList = function () {};
assert.strictEqual(menu.selectPlayerClass(5), false, 'the fifth plane must reject selection while locked');
assert.strictEqual(menu.selectedPlayerClass, 4, 'locked selection must preserve the current plane');

menu.game.plane5Unlocked = true;
menu.plane5Unlocked = true;
assert.strictEqual(menu.selectPlayerClass(5), true, 'the fifth plane must be selectable after unlock');
assert.strictEqual(menu.selectedPlayerClass, 5, 'unlocked selection must choose the fifth plane');

context.window.localStorage = {
	getItem: function () { return 'unlocked'; }
};
menu.game = {};
assert.strictEqual(menu.loadPlaneUnlock(), true, 'the menu must restore the permanent browser unlock');
assert.strictEqual(menu.game.plane5Unlocked, true, 'the browser unlock must be mirrored in game memory');

menu.progress = { colors: [] };
menu.selectedPlayerColorIndex = 0;
menu.updateColorTabs = function () {};
menu.updateProfileList = function () {};
assert.strictEqual(menu.selectPlayerColor(2), false, 'locked premium colors must reject selection');
assert.strictEqual(menu.selectedPlayerColorIndex, 0, 'locked color selection must preserve the current color');
menu.progress.colors.push('gold');
assert.strictEqual(menu.selectPlayerColor(2), true, 'purchased premium colors must be selectable');
assert.strictEqual(menu.selectedPlayerColorIndex, 2, 'purchased color selection must update the color index');
console.log('menu input regression test passed');
