'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

var context = {
	CONFIG: {},
	Phaser: {},
	window: {}
};

vm.runInNewContext(fs.readFileSync('src/js/game.js', 'utf8'), context);

var Game = context.window.firsttry.Game;
var gameState = new Game();
var removedHandler = null;
var removedContext = null;

gameState.input = {
	onDown: {
		remove: function (handler, handlerContext) {
			removedHandler = handler;
			removedContext = handlerContext;
		}
	}
};

assert.strictEqual(typeof gameState.shutdown, 'function', 'game state must clean up its pointer listener');
gameState.shutdown();
assert.strictEqual(removedHandler, gameState.onInputDown, 'shutdown must remove the game pointer handler');
assert.strictEqual(removedContext, gameState, 'shutdown must remove the handler with the original context');
console.log('game input cleanup regression test passed');
