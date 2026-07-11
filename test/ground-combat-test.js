'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var bootSource = fs.readFileSync('src/js/boot.js', 'utf8');
var groundPlayerHealth = Number(/GROUND_PLAYER_HEALTH:\s*(\d+)/.exec(bootSource)[1]);
var groundEnemyKills = Number(/GROUND_ENEMY_KILLS:\s*(\d+)/.exec(bootSource)[1]);
var activeGroundEnemies = Number(/GROUND_ACTIVE_ENEMIES:\s*(\d+)/.exec(bootSource)[1]);
var extraGroundTreesMatch = /GROUND_EXTRA_TREES:\s*(\d+)/.exec(bootSource);

assert.strictEqual(activeGroundEnemies, 10, 'ground combat must allow ten active enemies');
assert.strictEqual(groundEnemyKills, 20, 'the recovered plane must require 20 enemy kills');
assert.ok(extraGroundTreesMatch && Number(extraGroundTreesMatch[1]) === 150,
	'the large ground map must add 150 trees');

var context = {
	CONFIG: {
		PIXEL_RATIO: 1,
		GROUND_PLAYER_SPEED: 140,
		GROUND_ENEMY_SPEED: 65,
		GROUND_RIFLE_DELAY: 180,
		GROUND_ROCKET_DELAY: 1000,
		GROUND_BULLET_SPEED: 360,
		GROUND_ROCKET_SPEED: 220,
		GROUND_ENEMY_KILLS: groundEnemyKills,
		GROUND_PLAYER_HEALTH: groundPlayerHealth,
		GROUND_HIT_IMMUNITY: 700,
		GROUND_ACTIVE_ENEMIES: 10,
		GROUND_ENEMY_SPAWN_DELAY: 1500,
		GROUND_ENEMY_HEALTH: 2,
		GROUND_EXTRA_TREES: 150,
		GROUND_ENEMY_SEPARATION: 80,
		GROUND_SPAWN_ATTEMPTS: 10,
		GROUND_ENEMY_DETECTION_DISTANCE: 500,
		GROUND_ENEMY_ROAM_SPEED: 45,
		GROUND_ENEMY_ROAM_DELAY: 1800,
		GROUND_WORLD_WIDTH: 3840,
		GROUND_WORLD_HEIGHT: 4160,
		GROUND_SWAMP_SPEED_FACTOR: 0.6,
		GROUND_SPAWN_MIN_DISTANCE: 260,
		GROUND_SPAWN_MAX_DISTANCE: 380,
		GROUND_PLANE_REVEAL_DISTANCE: 300
	},
	Phaser: {},
	window: {}
};

vm.runInNewContext(fs.readFileSync('src/js/ground.js', 'utf8'), context);

var GroundGame = context.window.firsttry.GroundGame;
var state = new GroundGame();
var bullets = [];
var rockets = [];

assert.strictEqual(state.getBiomeAt(100, 100), 'grassland', 'top-left ground region must be grassland');
assert.strictEqual(state.getBiomeAt(3000, 100), 'forest', 'top-right ground region must be forest');
assert.strictEqual(state.getBiomeAt(100, 3000), 'swamp', 'bottom-left ground region must be swamp');
assert.strictEqual(state.getBiomeAt(3000, 3000), 'battlefield', 'bottom-right ground region must be battlefield');

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
assert.strictEqual(state.player.angle, 90, 'pressing D must turn the player soldier fully right');

state.keys.w.isDown = false;
state.keys.d.isDown = false;
state.updatePlayerMovement();
assert.strictEqual(state.player.angle, 90, 'the player soldier must keep facing right while idle');

state.keys.a.isDown = true;
state.updatePlayerMovement();
assert.strictEqual(state.player.angle, -90, 'pressing A must turn the player soldier fully left');
state.keys.a.isDown = false;
state.keys.s.isDown = true;
state.updatePlayerMovement();
assert.strictEqual(state.player.angle, -90, 'vertical movement must keep the last horizontal facing');
state.keys.s.isDown = false;
state.keys.w.isDown = true;
state.keys.d.isDown = true;
state.updatePlayerMovement();

var swampState = new GroundGame();
swampState.player = {
	x: 100,
	y: 3000,
	angle: 0,
	body: { velocity: { x: 0, y: 0 } }
};
swampState.keys = {
	w: { isDown: false },
	a: { isDown: false },
	s: { isDown: false },
	d: { isDown: true }
};
swampState.facing = { x: 0, y: -1 };
swampState.updatePlayerMovement();
assert.strictEqual(swampState.player.body.velocity.x, 84, 'swamp terrain must slow ground movement');

state.game = {
	time: { now: 1000 },
	world: {
		width: context.CONFIG.GROUND_WORLD_WIDTH,
		height: context.CONFIG.GROUND_WORLD_HEIGHT
	}
};
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
var rifleSounds = 0;
var rocketSounds = 0;
state.rifleSound = { play: function () { rifleSounds += 1; } };
state.rocketSound = { play: function () { rocketSounds += 1; } };
state.fireRifle();
state.fireGroundRocket();

assert.strictEqual(bullets.length, 1, 'Space must fire one rifle bullet');
assert.ok(bullets[0].body.velocity.x > 0 && bullets[0].body.velocity.y < 0,
	'rifle bullets must use the last movement direction');
assert.strictEqual(rockets.length, 1, 'E must launch one ground rocket');
assert.strictEqual(state.nextRocketAt, 2000, 'ground rockets must have a one-second cooldown');
assert.strictEqual(rifleSounds, 1, 'a successful ground rifle shot must play one sound');
assert.strictEqual(rocketSounds, 1, 'a successful ground rocket launch must play one sound');

state.fireRifle();
state.fireGroundRocket();
assert.strictEqual(rifleSounds, 1, 'ground rifle cooldown attempts must remain silent');
assert.strictEqual(rocketSounds, 1, 'ground rocket cooldown attempts must remain silent');

state.game.time.now = 1500;
state.fireGroundRocket();
assert.strictEqual(rockets.length, 1, 'ground rockets must not launch during cooldown');
assert.strictEqual(rocketSounds, 1, 'later ground rocket cooldown attempts must remain silent');

state.updateHUD = function () {};
state.messageText = { setText: function () {} };
state.parkedPlane = { exists: false, visible: false, alive: false };
for (var i = 0; i < context.CONFIG.GROUND_ENEMY_KILLS; i++) {
	state.defeatGroundEnemy({
		alive: true,
		kill: function () { this.alive = false; }
	});
}
assert.strictEqual(state.kills, 20, 'the ground objective must require 20 enemy kills');
assert.strictEqual(state.parkedPlane.exists, true, 'the plane must appear after 20 enemy kills');

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
	reviveCount: 0,
	revive: function () {
		this.reviveCount += 1;
		this.visible = true;
		this.exists = true;
		this.alive = true;
	},
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
assert.strictEqual(damageState.player.reviveCount, 1, 'a surviving player must be restored through Phaser revive');

damageState.player.visible = false;
damageState.player.exists = false;
damageState.player.alive = false;
damageState.player.renderable = false;
damageState.player.alpha = 0;
damageState.ensurePlayerVisible();
assert.strictEqual(damageState.player.visible, true, 'an active player hidden after damage must be restored');
assert.strictEqual(damageState.player.exists, true, 'an active player removed after damage must exist again');
assert.strictEqual(damageState.player.alive, true, 'an active player removed after damage must be alive again');
assert.strictEqual(damageState.player.renderable, true, 'an active player must remain renderable');
assert.strictEqual(damageState.player.alpha, 1, 'an active player must remain opaque');
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
for (var spawnTick = 2; spawnTick <= 10; spawnTick++) {
	spawnState.game.time.now = spawnTick * context.CONFIG.GROUND_ENEMY_SPAWN_DELAY;
	spawnState.maintainEnemyCount();
}
assert.strictEqual(livingEnemies, 10, 'no more than ten hostile soldiers may be alive');
spawnState.game.time.now = 20000;
spawnState.maintainEnemyCount();
assert.strictEqual(livingEnemies, 10, 'the active hostile cap must remain ten');

var spawnedEnemy = {
	reset: function (x, y) {
		this.x = x;
		this.y = y;
		this.alive = true;
	}
};
var occupiedEnemy = { alive: true, x: 1300, y: 1000 };
var randomValues = [0, 300, 180, 300, 800];
var localSpawnState = new GroundGame();
localSpawnState.player = { x: 1000, y: 1000 };
localSpawnState.game = {
	world: { width: 3840, height: 4160 },
	time: { now: 0 }
};
localSpawnState.enemyPool = {
	getFirstExists: function () { return spawnedEnemy; },
	forEachAlive: function (callback, callbackContext) {
		callback.call(callbackContext, occupiedEnemy);
	}
};
localSpawnState.rnd = { integerInRange: function () { return randomValues.shift(); } };
localSpawnState.spawnEnemy();
var spawnDistance = Math.sqrt(
	Math.pow(spawnedEnemy.x - localSpawnState.player.x, 2) +
	Math.pow(spawnedEnemy.y - localSpawnState.player.y, 2)
);
assert.ok(spawnDistance >= context.CONFIG.GROUND_SPAWN_MIN_DISTANCE,
	'enemies must not spawn directly beside the player');
assert.ok(spawnDistance <= context.CONFIG.GROUND_SPAWN_MAX_DISTANCE,
	'enemies must spawn near enough to keep combat active');
assert.ok(spawnedEnemy.x > 0 && spawnedEnemy.x < localSpawnState.game.world.width,
	'enemy spawn must stay inside horizontal world bounds');
assert.ok(spawnedEnemy.y > 0 && spawnedEnemy.y < localSpawnState.game.world.height,
	'enemy spawn must stay inside vertical world bounds');
assert.ok(Math.sqrt(Math.pow(spawnedEnemy.x - occupiedEnemy.x, 2) +
	Math.pow(spawnedEnemy.y - occupiedEnemy.y, 2)) >= context.CONFIG.GROUND_ENEMY_SEPARATION,
	'enemy soldiers must spawn at least 80 pixels apart');

var crowdedSpawned = false;
var crowdedState = new GroundGame();
crowdedState.player = { x: 1000, y: 1000 };
crowdedState.game = {
	world: { width: 3840, height: 4160 },
	time: { now: 0 }
};
crowdedState.enemyPool = {
	getFirstExists: function () {
		return { reset: function () { crowdedSpawned = true; } };
	},
	forEachAlive: function (callback, callbackContext) {
		callback.call(callbackContext, occupiedEnemy);
	}
};
crowdedState.rnd = { integerInRange: function (min) { return min === 0 ? 0 : 300; } };
crowdedState.spawnEnemy();
assert.strictEqual(crowdedSpawned, false, 'a crowded spawn cycle must wait instead of overlapping enemies');

var revealState = new GroundGame();
revealState.player = { x: 1000, y: 1000 };
revealState.game = { world: { width: 3840, height: 4160 } };
revealState.parkedPlane = { exists: false, visible: false, alive: false };
revealState.messageText = { setText: function () {} };
revealState.revealPlane();
var planeDistance = Math.sqrt(
	Math.pow(revealState.parkedPlane.x - revealState.player.x, 2) +
	Math.pow(revealState.parkedPlane.y - revealState.player.y, 2)
);
assert.ok(planeDistance <= context.CONFIG.GROUND_PLANE_REVEAL_DISTANCE,
	'the recovered plane must appear near the player');
assert.ok(revealState.parkedPlane.x > 0 && revealState.parkedPlane.x < revealState.game.world.width,
	'the recovered plane must stay inside world bounds');

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
	roamX: 0,
	roamY: 1,
	nextRoamAt: 9999,
	nextShotAt: 9999,
	body: { velocity: { x: 0, y: 0, setTo: function () {} } }
};
var aimState = new GroundGame();
aimState.player = { x: 300, y: 0 };
aimState.game = { time: { now: 0 } };
aimState.rnd = { integerInRange: function () { return 0; } };
aimState.enemyPool = {
	forEachAlive: function (callback, callbackContext) {
		callback.call(callbackContext, aimingEnemy);
	}
};
aimState.updateEnemies();
assert.ok(aimingEnemy.body.velocity.x > 0 && aimingEnemy.body.velocity.y === 0,
	'a detected enemy must chase the player');
assert.strictEqual(aimingEnemy.angle, 90, 'an enemy chasing right must turn right');

aimState.player.x = 1000;
aimingEnemy.body.velocity.x = 0;
aimingEnemy.body.velocity.y = 0;
aimingEnemy.angle = 0;
aimState.updateEnemies();
assert.strictEqual(aimingEnemy.body.velocity.x, 0, 'a distant enemy must not chase the player');
assert.strictEqual(aimingEnemy.body.velocity.y, context.CONFIG.GROUND_ENEMY_ROAM_SPEED,
	'a distant enemy must move along its roam direction');
assert.strictEqual(aimingEnemy.angle, 0, 'vertical roaming must preserve enemy facing');
console.log('ground combat controls regression test passed');
