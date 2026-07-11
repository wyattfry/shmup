'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

function Flagship() {}

var context = {
	CONFIG: { PIXEL_RATIO: 1 },
	Phaser: {},
	window: {
		firsttry: {
			Flagship: Flagship
		}
	}
};

vm.runInNewContext(fs.readFileSync('src/js/game.js', 'utf8'), context);

var Game = context.window.firsttry.Game;
var gameState = new Game();
var mob = {
	health: 10,
	points: 100,
	coinReward: 2,
	takeDamage: function () {
		this.health = 0;
	},
	die: function () {}
};

gameState.player = { strength: 10 };
gameState.coins = 0;
gameState.score = 0;
gameState.explode = function () {};
gameState.updateGUI = function () {};

gameState.bulletVSmob({
	kill: function () {}
}, mob);

assert.strictEqual(gameState.coins, 2, 'destroying a plane must award two coins');

var coinLabel = {
	text: '',
	textWidth: 80,
	scale: { x: 0.5 },
	cameraOffset: { x: 0 },
	setText: function (text) {
		this.text = text;
	}
};

gameState.game = { width: 720 };
gameState.player = {
	health: 100,
	playerStats: { strength: 1, rate: 1, speed: 1, accel: 1 },
	isInvulnerable: false
};
gameState.guiText1 = { setText: function () {} };
gameState.guiText2 = { setText: function () {} };
gameState.guiCoinText = coinLabel;
gameState.updateGUI = Game.prototype.updateGUI;
gameState.updateGUI();

assert.strictEqual(coinLabel.text, 'COINS 2', 'coin HUD must show the current total');
assert.strictEqual(coinLabel.x, 672, 'coin HUD must be aligned to the top-right with an eight-pixel margin');
assert.strictEqual(coinLabel.cameraOffset.x, 672, 'fixed coin HUD must use the top-right camera offset');
console.log('plane coin reward regression test passed');
