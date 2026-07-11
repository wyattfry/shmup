'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

var context = {
	CONFIG: { PIXEL_RATIO: 2 },
	Phaser: {},
	window: {}
};

vm.runInNewContext(fs.readFileSync('src/js/game.js', 'utf8'), context);

var Game = context.window.firsttry.Game;
var gameState = new Game();
var scales = [];

gameState.add = {
	sprite: function () {
		return {
			anchor: { setTo: function () {} },
			scale: {
				setTo: function (x, y) {
					scales.push([x, y]);
				}
			},
			animations: { add: function () {} },
			play: function () {}
		};
	}
};

gameState.explode({ x: 10, y: 20, explosionScale: 2 });
gameState.explode({ x: 10, y: 20, explosionScale: 5 });
gameState.explode({ x: 10, y: 20 });

assert.deepStrictEqual(scales[0], [4, 4], 'standard plane explosion must be twice the default size');
assert.deepStrictEqual(scales[1], [10, 10], 'flagship explosion must be five times the default size');
assert.deepStrictEqual(scales[2], [2, 2], 'objects without a custom scale must keep the default size');
console.log('explosion scale regression test passed');
