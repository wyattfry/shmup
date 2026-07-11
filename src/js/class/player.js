/*globals CONFIG */

(function() {
	'use strict';

	/************************************************************************************************
	 * PLAYER CLASS
	 * 
	 * Like a Mob, plus :
	 *   - handles user inputs
	 *   - can move with inertia
	 *   - can fire (and has its own bullet pool)
	 *
	 ************************************************************************************************/

	function Player(state) {

		this.state = state;
		this.game = state.game;

		this.playerClass = this.game.selectedPlayerClass || 1;
		if (this.playerClass < 1 || this.playerClass > CONFIG.CLASS_STATS.length) {
			this.playerClass = 1;
		}

		this.classStats = CONFIG.CLASS_STATS[this.playerClass - 1];
		this.playerStats = {
			className: this.classStats.className,
			health: this.classStats.health,
			speed: this.classStats.speed,
			accel: this.classStats.accel,
			strength: this.classStats.strength,
			rate: this.classStats.rate
		};

		// Phaser.Sprite.call(this, this.game, 0, 0, 'player_' + this.playerClass);
		window['firsttry'].Mob.call(this, state, 'player_' + this.playerClass);
		this.baseTint = this.game.selectedPlayerColor || CONFIG.PLAYER_COLORS[0].tint;
		this.tint = this.baseTint;

		this.body.setSize(7 * CONFIG.PIXEL_RATIO, 7 * CONFIG.PIXEL_RATIO, 0, 3 * CONFIG.PIXEL_RATIO);

		this.spawn();

		this.animations.add('left_full', [ 0 ], 5, true);
		this.animations.add('left', [ 1 ], 5, true);
		this.animations.add('idle', [ 2 ], 5, true);
		this.animations.add('right', [ 3 ], 5, true);
		this.animations.add('right_full', [ 4 ], 5, true);
		this.play('idle');

		this.health = this.playerStats.health;
		this.powerupExpiresAt = 0;
		this.isInvulnerable = false;

		this.updateStats();

		this.nextShotAt = 0;
		this.nextRocketAt = 0;
		this.lastUpdate = 0;

		this.game.add.existing(this);

		// PLAYER BULLETS

		this.createBulletPool();
		this.createRocketPool();
	}

	Player.prototype = Object.create(window['firsttry'].Mob.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.spawn = function() {

		this.x = this.game.width / 2;
		this.y = this.game.height / 4 * 3;
	};

	Player.prototype.createBulletPool = function() {
	
		this.bulletPool = this.game.add.group();
		this.bulletPool.enableBody = true;
		this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.bulletPool.createMultiple(100, 'player_bullet');
		this.bulletPool.setAll('anchor.x', 0.5);
		this.bulletPool.setAll('anchor.y', 0.5);
		this.bulletPool.setAll('scale.x', CONFIG.PIXEL_RATIO);
		this.bulletPool.setAll('scale.y', CONFIG.PIXEL_RATIO);
		this.bulletPool.setAll('outOfBoundsKill', true);
		this.bulletPool.setAll('checkWorldBounds', true);

		this.updateBulletPool();
	};

	Player.prototype.createRocketPool = function() {

		var i,
				rocket;

		this.rocketTexture = this.createRocketTexture();
		this.rocketPool = this.game.add.group();
		this.rocketPool.enableBody = true;
		this.rocketPool.physicsBodyType = Phaser.Physics.ARCADE;

		for (i = 0; i < CONFIG.ROCKETPOOL_SIZE; i++) {
			rocket = this.rocketPool.create(0, 0, this.rocketTexture);
			rocket.anchor.setTo(0.5, 0.5);
			rocket.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			rocket.outOfBoundsKill = true;
			rocket.checkWorldBounds = true;
			rocket.exists = false;
			rocket.alive = false;
			rocket.projectileDamage = CONFIG.ROCKET_DAMAGE;
			rocket.isRocket = true;
			rocket.target = null;
			rocket.heading = -Math.PI / 2;
			rocket.homingStartsAt = 0;
			rocket.lastSteeringAt = 0;
		}
	};

	Player.prototype.createRocketTexture = function() {

		var bmd = this.game.add.bitmapData(8, 18),
				ctx = bmd.ctx;

		ctx.fillStyle = '#111111';
		ctx.fillRect(2, 0, 4, 2);
		ctx.fillRect(1, 2, 6, 11);
		ctx.fillRect(0, 11, 8, 3);
		ctx.fillStyle = '#dddddd';
		ctx.fillRect(3, 1, 2, 2);
		ctx.fillRect(2, 3, 4, 9);
		ctx.fillStyle = '#cc2222';
		ctx.fillRect(1, 10, 2, 4);
		ctx.fillRect(5, 10, 2, 4);
		ctx.fillStyle = '#ffaa00';
		ctx.fillRect(2, 14, 4, 3);
		ctx.fillStyle = '#ffff66';
		ctx.fillRect(3, 15, 2, 3);
		bmd.dirty = true;

		return bmd;
	};

	Player.prototype.update = function() {

		// Call the parent update function
		window['firsttry'].Mob.prototype.update.call(this);

		this.updatePowerup();
		this.updateInputs();
		this.updateSprite();
		this.updateBullets();
	};

	Player.prototype.updateStats = function () {

		var speedFactor = this.isPowerupActive() ? CONFIG.POWERUP_SPEED_FACTOR : 1;

		this.speed = this.playerStats.speed * CONFIG.PIXEL_RATIO * speedFactor;
		this.accel = this.speed * this.playerStats.accel;
		this.strength = this.playerStats.strength;
		this.shootDelay = 1000 / this.playerStats.rate;
	};

	Player.prototype.isPowerupActive = function () {

		return this.powerupExpiresAt > this.game.time.now;
	};

	Player.prototype.updatePowerup = function () {

		var wasInvulnerable = this.isInvulnerable;

		this.isInvulnerable = this.isPowerupActive();

		if (wasInvulnerable !== this.isInvulnerable) {
			if (!this.isInvulnerable) {
				this.powerupExpiresAt = 0;
			}

			this.updateStats();
		}

		if (this.isInvulnerable) {
			this.tint = 0x66ccff;
		}

		return wasInvulnerable !== this.isInvulnerable;
	};

	Player.prototype.activatePowerup = function () {

		this.powerupExpiresAt = this.game.time.now + CONFIG.POWERUP_DURATION;
		this.isInvulnerable = true;
		this.updateStats();
	};

	Player.prototype.takeDamage = function (damage) {

		if (this.isInvulnerable) {
			return;
		}

		window['firsttry'].Mob.prototype.takeDamage.call(this, damage);
	};

	Player.prototype.updateInputs = function () {
		// USER INPUTS

		var cursors = this.state.cursors;
		var keyboard = this.state.input.keyboard;

		if (this.state.gameState === 0) {	// Pre-play

			if (keyboard.isDown(Phaser.Keyboard.W)) {
				this.state.statePreplay2Play();
			}

		} else if (this.state.gameState === 2) {	// Post-play (game over)

			if (keyboard.isDown(Phaser.Keyboard.W)) {
				this.game.state.start('menu');
			}

		} else { // Play
			var delta = (this.game.time.now - this.lastUpdate) / 1000; //in seconds
			this.lastUpdate = this.game.time.now;

			// Move

			if (cursors.left.isDown && this.x > 20 * CONFIG.PIXEL_RATIO) {
				this.moveLeft(delta);
			} else if (cursors.right.isDown && this.x < (CONFIG.WORLD_WIDTH * 24 - 20) * CONFIG.PIXEL_RATIO) {
				this.moveRight(delta);
			} else {
				this.floatH(delta);
			}

			if (cursors.up.isDown && this.y > 30 * CONFIG.PIXEL_RATIO) {
				this.moveUp(delta);
			} else if (cursors.down.isDown && this.y < (CONFIG.GAME_HEIGHT - 20) * CONFIG.PIXEL_RATIO) {
				this.moveDown(delta);
			} else {
				this.floatV(delta);
			}

			// Fire

			if (keyboard.isDown(Phaser.Keyboard.W)) {
				this.fire();
			}

			if (keyboard.isDown(Phaser.Keyboard.E)) {
				this.fireRocket();
			}
		}
	};

	Player.prototype.updateSprite = function () {
		var spd = this.body.velocity.x;

		if (spd < - this.speed / 4 * 3) {
			this.play('left_full');
		} else if (spd > this.speed / 4 * 3) {
			this.play('right_full');
		} else if (spd < - this.speed / 5) {
			this.play('left');
		} else if (spd > this.speed / 5) {
			this.play('right');
		} else {
			this.play('idle');
		}
	};

	Player.prototype.moveLeft = function (delta) {
		this.body.velocity.x -= this.accel * delta;
		if (this.body.velocity.x < - this.speed) {
			this.body.velocity.x = - this.speed;
		}
	};

	Player.prototype.moveRight = function (delta) {
		this.body.velocity.x += this.accel * delta;
		if (this.body.velocity.x > this.speed) {
			this.body.velocity.x = this.speed;
		}
	};

	Player.prototype.moveUp = function (delta) {
		this.body.velocity.y -= this.accel * delta;
		if (this.body.velocity.y < - this.speed) {
			this.body.velocity.y = - this.speed;
		}
	};

	Player.prototype.moveDown = function (delta) {
		this.body.velocity.y += this.accel * delta;
		if (this.body.velocity.y > this.speed) {
			this.body.velocity.y = this.speed;
		}
	};

	Player.prototype.floatH = function (delta) {

		if (this.body.velocity.x > 0) {
			this.body.velocity.x -= this.accel * delta;
			if (this.body.velocity.x < 0) {
				this.body.velocity.x = 0;
			}
		} else {
			this.body.velocity.x += this.accel * delta;
			if (this.body.velocity.x > 0) {
				this.body.velocity.x = 0;
			}
		}
	};

	Player.prototype.floatV = function (delta) {
		
		if (this.body.velocity.y > 0) {
			this.body.velocity.y -= this.accel * delta;
			if (this.body.velocity.y < 0) {
				this.body.velocity.y = 0;
			}
		} else {
			this.body.velocity.y += this.accel * delta;
			if (this.body.velocity.y > 0) {
				this.body.velocity.y = 0;
			}
		}
	};

	Player.prototype.fire = function() {

		if (this.alive) {
			if (this.nextShotAt > this.game.time.now) {
				return;
			}

			this.nextShotAt = this.game.time.now + this.shootDelay;

			var bullet = this.bulletPool.getFirstExists(false);
			bullet.reset(this.x, this.y - 20);

			bullet.body.velocity.y = -500 * CONFIG.PIXEL_RATIO;


			// TODO in updateBulletPool instead !!!
			var s = this.strength,
					f;

			if (s < 100 ) { f = 1; }
				else if (s < 120 ) { f = 2; }
				else if (s < 140 ) { f = 3; }
				else if (s < 160 ) { f = 4; }
				else { f = 5; }

			this.game.sound['shoot_player_' + f].play('', 0, 0.25);
		}
	};

	Player.prototype.fireRocket = function() {

		if (this.alive) {
			if (this.nextRocketAt > this.game.time.now) {
				return;
			}

			var targets = this.getAvailableRocketTargets(),
					volleySize = CONFIG.ROCKET_VOLLEY_SIZE || 3,
					launched = 0,
					i,
					rocket;

			for (i = 0; i < targets.length && i < volleySize; i++) {
				rocket = this.rocketPool.getFirstExists(false);
				if (!rocket) {
					break;
				}

				this.launchRocketAt(rocket, targets[i]);
				launched += 1;
			}

			if (launched > 0) {
				this.nextRocketAt = this.game.time.now + CONFIG.ROCKET_DELAY;
				this.game.sound['shoot_player_5'].play('', 0, 0.35);
			}
		}
	};

	Player.prototype.getAvailableRocketTargets = function() {

		var reservedTargets = [],
				targets = [];

		this.rocketPool.forEachAlive(function (rocket) {
			if (rocket.target) {
				reservedTargets.push(rocket.target);
			}
		}, this);

		this.state.mobPools[0].forEachAlive(function (plane) {
			if (plane.exists && reservedTargets.indexOf(plane) === -1) {
				targets.push(plane);
			}
		}, this);

		targets.sort(function (a, b) {
			var distanceA = Math.pow(a.x - this.x, 2) + Math.pow(a.y - this.y, 2),
					distanceB = Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2);

			return distanceA - distanceB;
		}.bind(this));

		return targets;
	};

	Player.prototype.launchRocketAt = function(rocket, target) {

		rocket.reset(this.x, this.y - 24 * CONFIG.PIXEL_RATIO);
		if (!rocket.body) {
			this.game.physics.enable(rocket, Phaser.Physics.ARCADE);
		}

		rocket.body.velocity.y = -(CONFIG.ROCKET_SPEED || 330) * CONFIG.PIXEL_RATIO;
		rocket.body.velocity.x = 0;
		rocket.projectileDamage = CONFIG.ROCKET_DAMAGE;
		rocket.target = target;
		rocket.heading = -Math.PI / 2;
		rocket.angle = 0;
		rocket.homingStartsAt = this.game.time.now + (CONFIG.ROCKET_HOMING_DELAY || 200);
		rocket.lastSteeringAt = rocket.homingStartsAt;
	};

	Player.prototype.updateBullets = function() {

		// PLAYER BULLETS
		// (dunno why some hi-speed bullets stay alive outside of the screen / world)

		this.bulletPool.forEachAlive(function (bullet) {
			if (bullet.y < -200) {
				bullet.kill();
				return;
			}
		}, this);

		this.rocketPool.forEachAlive(function (rocket) {
			var target = rocket.target,
					speed,
					desiredHeading,
					headingDifference,
					maxTurn,
					delta;

			if (!target || !target.alive || !target.exists) {
				rocket.target = null;
				rocket.kill();
				return;
			}

			if (this.game.time.now >= rocket.homingStartsAt) {
				speed = (CONFIG.ROCKET_SPEED || 330) * CONFIG.PIXEL_RATIO;
				desiredHeading = Math.atan2(target.y - rocket.y, target.x - rocket.x);
				headingDifference = desiredHeading - rocket.heading;

				while (headingDifference > Math.PI) {
					headingDifference -= Math.PI * 2;
				}
				while (headingDifference < -Math.PI) {
					headingDifference += Math.PI * 2;
				}

				delta = (this.game.time.now - rocket.lastSteeringAt) / 1000;
				maxTurn = (CONFIG.ROCKET_TURN_RATE || 180) * Math.PI / 180 * delta;
				headingDifference = Math.max(-maxTurn, Math.min(maxTurn, headingDifference));
				rocket.heading += headingDifference;
				rocket.lastSteeringAt = this.game.time.now;
				rocket.body.velocity.x = Math.cos(rocket.heading) * speed;
				rocket.body.velocity.y = Math.sin(rocket.heading) * speed;
				rocket.angle = rocket.heading * 180 / Math.PI + 90;
			}

			if (rocket.y < -200) {
				rocket.target = null;
				rocket.kill();
				return;
			}
		}, this);
	};

	Player.prototype.updateBulletPool = function() {

		var s = this.strength,
				f;

		if (s < 100 ) { f = 0; }
			else if (s < 120 ) { f = 1; }
			else if (s < 160 ) { f = 2; }
			else { f = 3; }

		this.bulletPool.forEach(function(bullet) {
			bullet.animations.add('idle', [ f ], 5, true);
			bullet.play('idle');
		}, null);
	};

	Player.prototype.collectUpgrade = function(upgrade) {

		// TODO : relative upgrades
		// var nSteps = 7; // Number of upgrades needed for max level
		// var maxFactor = 2; // How many times the base (read class) level

		// var nParts = 0;

		// for (var i = 1; i < nSteps; i++) {
		// 	nParts += i;
		// };

		// var strengthPart = this.classStats.strength * (maxFactor - 1);

		if (upgrade === 0) {
			this.playerStats.strength += 10;

		} else if (upgrade === 1) {
			this.playerStats.rate += 1;

		} else if (upgrade === 2) {
			this.playerStats.speed += 10;

		} else {
			this.activatePowerup();
		}

		this.updateStats();
		this.updateBulletPool();

		this.state.sound['collect_1'].play();
	};	


	// Export the object
	window['firsttry'] = window['firsttry'] || {};
	window['firsttry'].Player = Player;
}());
