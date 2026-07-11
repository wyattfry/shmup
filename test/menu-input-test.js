'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

var context = {
	CONFIG: {
		PLAYER_COLORS: [
			{ tint: 0xffffff },
			{ tint: 0xff6666 }
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
console.log('menu input regression test passed');
