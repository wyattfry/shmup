'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var bootSource = fs.readFileSync('src/js/boot.js', 'utf8');
var rocketDelay = Number(/ROCKET_DELAY:\s*(\d+)/.exec(bootSource)[1]);

function Mob() {}

var context = {
	CONFIG: {
		PIXEL_RATIO: 1,
		ROCKET_DELAY: rocketDelay,
		ROCKET_DAMAGE: 120,
		ROCKET_HOMING_DELAY: 200,
		ROCKET_TURN_RATE: 180
	},
	Phaser: {
		Keyboard: {},
		Physics: { ARCADE: 0 }
	},
	window: {
		firsttry: { Mob: Mob }
	}
};

vm.runInNewContext(fs.readFileSync('src/js/class/player.js', 'utf8'), context);

var Player = context.window.firsttry.Player;
var player = Object.create(Player.prototype);
var planes = [
	{ x: 100, y: 100, alive: true, exists: true },
	{ x: 110, y: 90, alive: true, exists: true },
	{ x: 130, y: 80, alive: true, exists: true },
	{ x: 150, y: 70, alive: true, exists: true }
];

function makeRocket(alive, target) {
	return {
		alive: alive,
		exists: alive,
		target: target || null,
		body: { velocity: { x: 0, y: 0 } },
		reset: function (x, y) {
			this.x = x;
			this.y = y;
			this.alive = true;
			this.exists = true;
		},
		kill: function () {
			this.alive = false;
			this.exists = false;
		}
	};
}

var rockets = [
	makeRocket(true, planes[0]),
	makeRocket(false),
	makeRocket(false),
	makeRocket(false)
];

player.x = 120;
player.y = 500;
player.alive = true;
player.nextRocketAt = 0;
player.state = {
	mobPools: [{
		forEachAlive: function (callback, callbackContext) {
			planes.forEach(function (plane) {
				if (plane.alive) {
					callback.call(callbackContext, plane);
				}
			});
		}
	}]
};
player.rocketPool = {
	forEachAlive: function (callback, callbackContext) {
		rockets.forEach(function (rocket) {
			if (rocket.alive) {
				callback.call(callbackContext, rocket);
			}
		});
	},
	getFirstExists: function () {
		return rockets.filter(function (rocket) {
			return !rocket.exists;
		})[0] || null;
	}
};
player.game = {
	time: { now: 1000 },
	physics: { enable: function () {} },
	sound: {
		shoot_player_5: { play: function () {} }
	}
};

player.fireRocket();

assert.strictEqual(player.nextRocketAt, 1500, 'a missile volley must start a 0.5-second cooldown');

var launched = rockets.filter(function (rocket) {
	return rocket.alive && rocket !== rockets[0];
});
var assignedTargets = launched.map(function (rocket) {
	return rocket.target;
});

assert.strictEqual(launched.length, 3, 'one E volley must launch three missiles when three targets are free');
assert.strictEqual(assignedTargets.indexOf(planes[0]), -1, 'a plane targeted by an active missile must be skipped');
assert.strictEqual(new Set(assignedTargets).size, 3, 'every missile in a volley must receive a unique target');

player.bulletPool = { forEachAlive: function () {} };
launched[0].x = 120;
launched[0].y = 480;
player.game.time.now = 1100;
player.updateBullets();

assert.strictEqual(launched[0].body.velocity.x, 0, 'a missile must launch straight for its first 0.2 seconds');
assert.ok(launched[0].body.velocity.y < 0, 'a launched missile must move straight upward');

player.game.time.now = 1300;
player.updateBullets();

assert.ok(launched[0].body.velocity.x !== 0, 'a homing missile must steer horizontally after its launch phase');
assert.strictEqual(typeof launched[0].angle, 'number', 'a homing missile must rotate toward its target');
assert.ok(Math.abs(launched[0].heading + Math.PI / 2) <= Math.PI / 10 + 0.0001,
	'a homing missile must not turn more than 18 degrees in 0.1 seconds');

launched[0].target.alive = false;
player.updateBullets();

assert.strictEqual(launched[0].alive, false, 'a missile must disappear when its target is gone');
assert.strictEqual(launched[0].target, null, 'a dead missile must release its target');
console.log('homing missile target regression test passed');
