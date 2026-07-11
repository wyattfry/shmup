'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

function Mob() {}
Mob.prototype = {};

var context = {
	CONFIG: { PIXEL_RATIO: 1 },
	Phaser: { Physics: { ARCADE: 0 } },
	window: { firsttry: { Mob: Mob } }
};

vm.runInNewContext(fs.readFileSync('src/js/class/player.js', 'utf8'), context);

var Player = context.window.firsttry.Player;

function fireAs(playerClass) {
	var player = Object.create(Player.prototype);
	var bullets = [];
	player.alive = true;
	player.playerClass = playerClass;
	player.nextShotAt = 0;
	player.shootDelay = 100;
	player.x = 100;
	player.y = 200;
	player.strength = 110;
	player.game = {
		time: { now: 1000 },
		sound: {
			shoot_player_2: { play: function () {} }
		}
	};
	player.bulletPool = {
		getFirstExists: function () {
			var bullet = {
				body: { velocity: {} },
				reset: function (x, y) {
					this.x = x;
					this.y = y;
				}
			};
			bullets.push(bullet);
			return bullet;
		}
	};
	player.fire();
	return bullets;
}

var normalBullets = fireAs(1);
assert.strictEqual(normalBullets.length, 1, 'standard plane classes must fire one bullet');

var phantomBullets = fireAs(5);
assert.strictEqual(phantomBullets.length, 2, 'the fifth plane must fire a twin-cannon burst');
assert.ok(phantomBullets[0].x < 100 && phantomBullets[1].x > 100,
	'the fifth plane cannons must fire from opposite wings');
assert.strictEqual(phantomBullets[0].y, phantomBullets[1].y,
	'the fifth plane twin cannons must fire in sync');

var upgradedPlayer = Object.create(Player.prototype);
upgradedPlayer.playerStats = { health: 100, speed: 140, strength: 100, rate: 5 };
upgradedPlayer.applyPermanentUpgrades({
	upgrades: { armor: 2, engine: 3, weapons: 1, fireControl: 4 }
});
assert.deepStrictEqual(upgradedPlayer.playerStats,
	{ health: 120, speed: 155, strength: 110, rate: 9 },
	'all four permanent upgrades must apply to every plane profile');

console.log('fifth plane specialty regression test passed');
