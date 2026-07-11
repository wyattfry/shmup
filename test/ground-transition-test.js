'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

function Plane() {}
function Flagship() {}

var context = {
	CONFIG: { GROUND_TRIGGER_PLANE_KILLS: 20 },
	Phaser: {},
	window: { firsttry: { Plane: Plane, Flagship: Flagship } }
};

vm.runInNewContext(fs.readFileSync('src/js/game.js', 'utf8'), context);

var Game = context.window.firsttry.Game;
var state = new Game();
state.game = { runData: null };
state.score = 1200;
state.coins = 8;
state.player = {
	health: 70,
	playerStats: { health: 100, speed: 140, accel: 8, strength: 100, rate: 8 }
};

for (var i = 0; i < 19; i++) {
	state.recordPlaneKill();
}

assert.strictEqual(state.pendingGroundTransition, false, 'ground mode must not start before 20 plane kills');

state.recordPlaneKill();
assert.strictEqual(state.pendingGroundTransition, true, 'the 20th plane kill must request ground mode');
assert.strictEqual(state.game.runData.score, 1200, 'flight score must be saved for ground mode');
assert.strictEqual(state.game.runData.coins, 8, 'flight coins must be saved for ground mode');
assert.strictEqual(state.game.runData.flightHealth, 70, 'flight health must be saved for return');

state.pendingGroundTransition = false;
state.game.runData.groundComplete = true;
state.recordPlaneKill();
assert.strictEqual(state.pendingGroundTransition, false, 'completed ground mode must not trigger again');
console.log('ground transition regression test passed');
