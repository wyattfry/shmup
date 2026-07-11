'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var bootSource = fs.readFileSync('src/js/boot.js', 'utf8');
var groundPlayerHealth = Number(/GROUND_PLAYER_HEALTH:\s*(\d+)/.exec(bootSource)[1]);

var context = {
	CONFIG: {
		PIXEL_RATIO: 1,
		GROUND_PLAYER_SPEED: 140,
		GROUND_ENEMY_SPEED: 65,
		GROUND_RIFLE_DELAY: 180,
		GROUND_ROCKET_DELAY: 1000,
		GROUND_BULLET_SPEED: 360,
		GROUND_ROCKET_SPEED: 220,
		GROUND_ENEMY_KILLS: 50,
		GROUND_PLAYER_HEALTH: groundPlayerHealth,
		GROUND_HIT_IMMUNITY: 700,
		GROUND_ACTIVE_ENEMIES: 3,
		GROUND_ENEMY_SPAWN_DELAY: 1500,
		GROUND_ENEMY_HEALTH: 2
	},
	Phaser: {},
	window: {}
};

vm.runInNewContext(fs.readFileSync('src/js/ground.js', 'utf8'), context);

var GroundGame = context.window.firsttry.GroundGame;
var state = new GroundGame();
var bullets = [];
var rockets = [];

function projectile() {
	return {
		body: { velocity: { x: 0, y: 0 } },
		reset: function (x, y) {
			this.x = x;
			this.y = y;
			this.alive = true;
		}
	};
}

state.player = {
	x: 100,
	y: 100,
	angle: 0,
	body: { velocity: { x: 0, y: 0 } }
};
state.keys = {
	w: { isDown: true },
	a: { isDown: false },
	s: { isDown: false },
	d: { isDown: true }
};
state.facing = { x: 0, y: -1 };
state.updatePlayerMovement();

assert.ok(Math.abs(state.player.body.velocity.x - 98.9949) < 0.01, 'diagonal ground movement must be normalized');
assert.ok(Math.abs(state.player.body.velocity.y + 98.9949) < 0.01, 'WASD must move in all directions');
assert.ok(state.facing.x > 0 && state.facing.y < 0, 'the soldier must face the last movement direction');
assert.strictEqual(state.player.angle, 45, 'the player soldier must turn toward diagonal movement');

state.keys.w.isDown = false;
state.keys.d.isDown = false;
state.updatePlayerMovement();
assert.strictEqual(state.player.angle, 45, 'the player soldier must keep facing the last movement direction while idle');

state.game = { time: { now: 1000 } };
state.playerBulletPool = {
	getFirstExists: function () {
		var bullet = projectile();
		bullets.push(bullet);
		return bullet;
	}
};
state.groundRocketPool = {
	getFirstExists: function () {
		var rocket = projectile();
		rockets.push(rocket);
		return rocket;
	}
};
state.nextRifleAt = 0;
state.nextRocketAt = 0;
state.fireRifle();
state.fireGroundRocket();

assert.strictEqual(bullets.length, 1, 'Space must fire one rifle bullet');
assert.ok(bullets[0].body.velocity.x > 0 && bullets[0].body.velocity.y < 0,
	'rifle bullets must use the last movement direction');
assert.strictEqual(rockets.length, 1, 'E must launch one ground rocket');
assert.strictEqual(state.nextRocketAt, 2000, 'ground rockets must have a one-second cooldown');

state.game.time.now = 1500;
state.fireGroundRocket();
assert.strictEqual(rockets.length, 1, 'ground rockets must not launch during cooldown');

state.updateHUD = function () {};
state.messageText = { setText: function () {} };
state.parkedPlane = { exists: false, visible: false, alive: false };
for (var i = 0; i < context.CONFIG.GROUND_ENEMY_KILLS; i++) {
	state.defeatGroundEnemy({
		alive: true,
		kill: function () { this.alive = false; }
	});
}
assert.strictEqual(state.kills, 50, 'the ground objective must require 50 enemy kills');
assert.strictEqual(state.parkedPlane.exists, true, 'the plane must appear after 50 enemy kills');

var startedState = null;
state.game.runData = {};
state.game.state = { start: function (name) { startedState = name; } };
state.finishBoarding();
assert.strictEqual(state.game.runData.groundComplete, true, 'boarding must complete the ground encounter');
assert.strictEqual(state.game.runData.resumeFlight, true, 'boarding must request a return to flight');
assert.strictEqual(startedState, 'game', 'the takeoff cutscene must return to the flight state');

var damageState = new GroundGame();
damageState.health = groundPlayerHealth;
damageState.mode = 'play';
damageState.nextPlayerHitAt = 0;
damageState.updateHUD = function () {};
damageState.messageText = { setText: function () {} };
damageState.player = {
	visible: true,
	exists: true,
	alive: true,
	body: { velocity: { setTo: function () {} } }
};
damageState.game = {
	time: { now: 1000, events: { add: function () {} } },
	runData: {},
	state: { start: function () {} }
};
function hitPlayerAt(time) {
	damageState.game.time.now = time;
	damageState.enemyBulletVSplayer({ kill: function () {} });
}
hitPlayerAt(1000);
assert.strictEqual(damageState.health, 9, 'one bullet hit must remove exactly one HP');
assert.strictEqual(damageState.player.visible, true, 'one bullet hit must not hide the player');
assert.strictEqual(damageState.player.exists, true, 'one bullet hit must not remove the player');
assert.strictEqual(damageState.player.alive, true, 'one bullet hit must not kill the player');
for (var hit = 1; hit < 9; hit++) {
	hitPlayerAt(1000 + hit * 800);
}
assert.strictEqual(damageState.health, 1, 'the ground player must survive nine bullet hits with one HP');
assert.strictEqual(damageState.mode, 'play', 'nine bullet hits must not end the run');
hitPlayerAt(8200);
assert.strictEqual(damageState.health, 0, 'the ground player must die after 10 bullet hits');
assert.strictEqual(damageState.mode, 'gameover', 'the 10th bullet hit must end the run');

var spawnState = new GroundGame();
var livingEnemies = 0;
spawnState.mode = 'play';
spawnState.kills = 0;
spawnState.nextEnemySpawnAt = 0;
spawnState.game = { time: { now: 0 } };
spawnState.enemyPool = {
	countLiving: function () { return livingEnemies; },
	countDead: function () { return 10 - livingEnemies; }
};
spawnState.spawnEnemy = function () { livingEnemies += 1; };
spawnState.maintainEnemyCount();
spawnState.maintainEnemyCount();
assert.strictEqual(livingEnemies, 1, 'only one hostile may spawn in an eligible update window');
spawnState.game.time.now = 1499;
spawnState.maintainEnemyCount();
assert.strictEqual(livingEnemies, 1, 'the next hostile must wait 1.5 seconds');
spawnState.game.time.now = 1500;
spawnState.maintainEnemyCount();
spawnState.game.time.now = 3000;
spawnState.maintainEnemyCount();
spawnState.game.time.now = 4500;
spawnState.maintainEnemyCount();
assert.strictEqual(livingEnemies, 3, 'no more than three hostile soldiers may be alive');

var enemyHealthState = new GroundGame();
var enemy = {
	alive: true,
	health: context.CONFIG.GROUND_ENEMY_HEALTH,
	tint: 0xffffff,
	kill: function () { this.alive = false; }
};
var rifleBullet = { kill: function () {} };
enemyHealthState.kills = 0;
enemyHealthState.updateHUD = function () {};
enemyHealthState.game = {
	time: {
		now: 0,
		events: { add: function () {} }
	}
};
enemyHealthState.bulletVSenemy(rifleBullet, enemy);
assert.strictEqual(enemy.health, 1, 'the first rifle hit must remove one enemy HP');
assert.strictEqual(enemy.alive, true, 'an enemy soldier must survive the first rifle hit');
assert.strictEqual(enemyHealthState.kills, 0, 'the first rifle hit must not count as a kill');
enemyHealthState.bulletVSenemy(rifleBullet, enemy);
assert.strictEqual(enemy.alive, false, 'the second rifle hit must defeat an enemy soldier');
assert.strictEqual(enemyHealthState.kills, 1, 'the second rifle hit must count exactly one kill');

var introState = new GroundGame();
introState.mode = 'intro';
introState.player = { visible: false };
introState.introPlane = { kill: function () { this.visible = false; } };
introState.messageText = { setText: function (text) { this.text = text; } };
introState.game = { time: { now: 250 } };
introState.completeGroundIntro();
assert.strictEqual(introState.mode, 'play', 'touchdown must begin ground combat');
assert.strictEqual(introState.player.visible, true, 'the soldier must replace the landed plane');
assert.strictEqual(introState.nextEnemySpawnAt, 250, 'enemy arrival timing must start after touchdown');

var aimingEnemy = {
	x: 0,
	y: 0,
	angle: 0,
	nextShotAt: 9999,
	body: { velocity: { x: 0, y: 0, setTo: function () {} } }
};
var aimState = new GroundGame();
aimState.player = { x: 100, y: 0 };
aimState.game = { time: { now: 0 } };
aimState.enemyPool = {
	forEachAlive: function (callback, callbackContext) {
		callback.call(callbackContext, aimingEnemy);
	}
};
aimState.updateEnemies();
assert.strictEqual(aimingEnemy.angle, 0, 'enemy soldier sprites must always face upward');
console.log('ground combat controls regression test passed');
