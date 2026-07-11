'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

function Flagship() {}

var context = {
	CONFIG: {
		PIXEL_RATIO: 1,
		ROCKET_AOE_RADIUS: 128,
		ROCKET_AOE_MAX_TARGETS: 4,
		ROCKET_PLAYER_DAMAGE: 4
	},
	Phaser: {},
	window: { firsttry: { Flagship: Flagship } }
};

vm.runInNewContext(fs.readFileSync('src/js/game.js', 'utf8'), context);

var Game = context.window.firsttry.Game;
var gameState = new Game();
var directTarget = { x: 0, y: 0, alive: true, exists: true };
var nearby = [10, 20, 30, 40, 50].map(function (x) {
	return { x: x, y: 0, alive: true, exists: true };
});
var distant = { x: 200, y: 0, alive: true, exists: true };
var defeated = [];

function group(mobs) {
	return {
		forEachAlive: function (callback, callbackContext) {
			mobs.forEach(function (mob) {
				if (mob.alive) {
					callback.call(callbackContext, mob);
				}
			});
		}
	};
}

gameState.mobPools = [group([directTarget].concat(nearby).concat([distant]))];
gameState.mobPoolsGround = [];
gameState.defeatMob = function (mob) {
	mob.alive = false;
	defeated.push(mob);
};
gameState.updateGUI = function () {};
gameState.sound = { hurt_1: { play: function () {} } };
gameState.player = {
	x: 50,
	y: 0,
	health: 10,
	isInvulnerable: false,
	takeDamage: function (damage) {
		if (!this.isInvulnerable) {
			this.health -= damage;
		}
	}
};

gameState.detonateRocket({ x: 0, y: 0 }, directTarget);

assert.strictEqual(defeated.length, 4, 'missile AOE must kill at most four additional mobs');
assert.strictEqual(defeated.indexOf(directTarget), -1, 'missile AOE must exclude its direct-hit target');
assert.strictEqual(distant.alive, true, 'mobs outside the four-plane-width radius must survive');
assert.strictEqual(gameState.player.health, 6, 'a nearby player must take four missile AOE damage');

gameState.player.health = 10;
gameState.player.isInvulnerable = true;
gameState.detonateRocket({ x: 0, y: 0 }, directTarget);
assert.strictEqual(gameState.player.health, 10, 'an invulnerable player must ignore missile AOE damage');
console.log('missile AOE regression test passed');
