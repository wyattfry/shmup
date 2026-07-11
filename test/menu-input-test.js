'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

var context = {
	CONFIG: {},
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
console.log('menu input regression test passed');
