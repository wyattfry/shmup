/*globals CONFIG */

(function() {
	'use strict';

	function GroundGame() {
		this.player = null;
		this.facing = { x: 0, y: -1 };
		this.keys = null;
		this.health = 0;
		this.kills = 0;
		this.nextRifleAt = 0;
		this.nextRocketAt = 0;
		this.nextPlayerHitAt = 0;
		this.nextEnemySpawnAt = 0;
		this.mode = 'play';
	}

	GroundGame.prototype = {

		create: function () {

			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.world.setBounds(
				0, 0,
				CONFIG.GROUND_WORLD_WIDTH * CONFIG.PIXEL_RATIO,
				CONFIG.GROUND_WORLD_HEIGHT * CONFIG.PIXEL_RATIO
			);
			this.stage.backgroundColor = '#426b3a';
			this.health = CONFIG.GROUND_PLAYER_HEALTH;
			this.kills = 0;
			this.mode = 'intro';
			this.createTextures();
			this.createArena();
			this.createProjectilePools();
			this.createEnemies();
			this.createPlayer();
			this.createPlane();
			this.createControls();
			this.createHUD();
			this.createAudio();
			this.createIntroCutscene();
			this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
		},

		createTextures: function () {

			this.biomeTextures = {};
			this.biomeTextures.grassland = this.makeTexture(32, 32, function (ctx) {
				ctx.fillStyle = '#426b3a';
				ctx.fillRect(0, 0, 32, 32);
				ctx.fillStyle = '#355c31';
				ctx.fillRect(3, 5, 2, 2);
				ctx.fillRect(22, 12, 2, 2);
				ctx.fillRect(12, 25, 2, 2);
			});
			this.biomeTextures.forest = this.makeTexture(32, 32, function (ctx) {
				ctx.fillStyle = '#263f28';
				ctx.fillRect(0, 0, 32, 32);
				ctx.fillStyle = '#172c1c';
				ctx.fillRect(4, 7, 5, 4);
				ctx.fillRect(21, 20, 6, 5);
			});
			this.biomeTextures.swamp = this.makeTexture(32, 32, function (ctx) {
				ctx.fillStyle = '#45543a';
				ctx.fillRect(0, 0, 32, 32);
				ctx.fillStyle = '#283f3b';
				ctx.fillRect(2, 5, 12, 5);
				ctx.fillRect(18, 22, 11, 6);
			});
			this.biomeTextures.battlefield = this.makeTexture(32, 32, function (ctx) {
				ctx.fillStyle = '#665d4b';
				ctx.fillRect(0, 0, 32, 32);
				ctx.fillStyle = '#39362f';
				ctx.fillRect(3, 15, 12, 3);
				ctx.fillRect(22, 4, 5, 5);
			});
			this.playerTexture = this.makeSoldierTexture('#315f9b', '#d8b48a', true);
			this.enemyTexture = this.makeSoldierTexture('#8b3131', '#c99a72', false);
			this.treeTexture = this.makeTexture(24, 28, function (ctx) {
				ctx.fillStyle = '#151d12';
				ctx.fillRect(8, 14, 8, 14);
				ctx.fillStyle = '#243f21';
				ctx.fillRect(2, 4, 20, 17);
				ctx.fillStyle = '#365d30';
				ctx.fillRect(5, 1, 14, 17);
			});
			this.swampObstacleTexture = this.makeTexture(28, 20, function (ctx) {
				ctx.fillStyle = '#172a2a';
				ctx.fillRect(1, 5, 26, 12);
				ctx.fillStyle = '#36544b';
				ctx.fillRect(5, 8, 18, 6);
			});
			this.rubbleTexture = this.makeTexture(26, 24, function (ctx) {
				ctx.fillStyle = '#24231f';
				ctx.fillRect(2, 14, 22, 7);
				ctx.fillStyle = '#777064';
				ctx.fillRect(4, 8, 8, 10);
				ctx.fillRect(14, 4, 9, 14);
			});
			this.bulletTexture = this.makeTexture(4, 4, function (ctx) {
				ctx.fillStyle = '#fff18a';
				ctx.fillRect(0, 0, 4, 4);
			});
			this.enemyBulletTexture = this.makeTexture(4, 4, function (ctx) {
				ctx.fillStyle = '#ff6b57';
				ctx.fillRect(0, 0, 4, 4);
			});
			this.rocketTexture = this.makeTexture(6, 12, function (ctx) {
				ctx.fillStyle = '#161616';
				ctx.fillRect(1, 0, 4, 10);
				ctx.fillStyle = '#d8d8d8';
				ctx.fillRect(2, 1, 2, 8);
				ctx.fillStyle = '#ff9b32';
				ctx.fillRect(2, 9, 2, 3);
			});
		},

		makeTexture: function (width, height, draw) {

			var texture = this.add.bitmapData(width, height);
			draw(texture.ctx);
			texture.dirty = true;
			return texture;
		},

		makeSoldierTexture: function (uniform, skin, playerLoadout) {

			return this.makeTexture(16, 18, function (ctx) {
				ctx.fillStyle = '#111111';
				ctx.fillRect(4, 1, 8, 16);
				ctx.fillRect(7, 0, 2, 5);
				ctx.fillStyle = skin;
				ctx.fillRect(5, 2, 6, 5);
				ctx.fillStyle = uniform;
				ctx.fillRect(4, 7, 8, 8);
				if (playerLoadout) {
					ctx.fillStyle = '#30442a';
					ctx.fillRect(2, 2, 3, 14);
					ctx.fillStyle = '#171717';
					ctx.fillRect(9, 0, 2, 11);
					ctx.fillRect(8, 7, 4, 2);
					ctx.fillStyle = '#7a4f28';
					ctx.fillRect(9, 8, 3, 5);
					ctx.fillRect(7, 10, 3, 3);
				} else {
					ctx.fillStyle = '#202020';
					ctx.fillRect(8, 0, 2, 11);
					ctx.fillStyle = '#634b2d';
					ctx.fillRect(8, 7, 3, 6);
				}
			});
		},

		createArena: function () {

			var width = CONFIG.GROUND_WORLD_WIDTH * CONFIG.PIXEL_RATIO,
					height = CONFIG.GROUND_WORLD_HEIGHT * CONFIG.PIXEL_RATIO,
					halfWidth = width / 2,
					halfHeight = height / 2;

			this.add.tileSprite(0, 0, halfWidth, halfHeight, this.biomeTextures.grassland);
			this.add.tileSprite(halfWidth, 0, halfWidth, halfHeight, this.biomeTextures.forest);
			this.add.tileSprite(0, halfHeight, halfWidth, halfHeight, this.biomeTextures.swamp);
			this.add.tileSprite(halfWidth, halfHeight, halfWidth, halfHeight, this.biomeTextures.battlefield);
			this.obstacles = this.add.group();
			this.obstacles.enableBody = true;
			this.obstacles.physicsBodyType = Phaser.Physics.ARCADE;

			this.addBiomeObstacles(50, 0, halfWidth, 0, halfHeight, this.treeTexture);
			this.addBiomeObstacles(190, halfWidth, width, 0, halfHeight, this.treeTexture);
			this.addBiomeObstacles(20, 0, halfWidth, halfHeight, height, this.treeTexture);
			this.addBiomeObstacles(35, 0, halfWidth, halfHeight, height, this.swampObstacleTexture);
			this.addBiomeObstacles(50, halfWidth, width, halfHeight, height, this.rubbleTexture);
		},

		addBiomeObstacles: function (count, minX, maxX, minY, maxY, texture) {

			var i, obstacle, margin = 50 * CONFIG.PIXEL_RATIO;
			for (i = 0; i < count; i++) {
				obstacle = this.obstacles.create(
					this.rnd.integerInRange(minX + margin, maxX - margin),
					this.rnd.integerInRange(minY + margin, maxY - margin),
					texture
				);
				obstacle.anchor.setTo(0.5, 0.5);
				obstacle.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
				obstacle.body.immovable = true;
			}
		},

		getBiomeAt: function (x, y) {

			var right = x >= CONFIG.GROUND_WORLD_WIDTH * CONFIG.PIXEL_RATIO / 2,
					bottom = y >= CONFIG.GROUND_WORLD_HEIGHT * CONFIG.PIXEL_RATIO / 2;

			if (bottom) {
				return right ? 'battlefield' : 'swamp';
			}
			return right ? 'forest' : 'grassland';
		},

		createPlayer: function () {

			this.player = this.add.sprite(
				this.game.world.centerX,
				this.game.world.height - 100 * CONFIG.PIXEL_RATIO,
				this.playerTexture
			);
			this.player.anchor.setTo(0.5, 0.5);
			this.player.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
			this.player.body.collideWorldBounds = true;
			this.player.body.setSize(12, 12, 2, 4);
		},

		createProjectilePools: function () {

			this.playerBulletPool = this.createProjectilePool(this.bulletTexture, 40);
			this.groundRocketPool = this.createProjectilePool(this.rocketTexture, 8);
			this.enemyBulletPool = this.createProjectilePool(this.enemyBulletTexture, 80);
		},

		createProjectilePool: function (texture, count) {

			var group = this.add.group();
			group.enableBody = true;
			group.physicsBodyType = Phaser.Physics.ARCADE;
			group.createMultiple(count, texture);
			group.setAll('anchor.x', 0.5);
			group.setAll('anchor.y', 0.5);
			group.setAll('scale.x', CONFIG.PIXEL_RATIO);
			group.setAll('scale.y', CONFIG.PIXEL_RATIO);
			group.setAll('checkWorldBounds', true);
			group.setAll('outOfBoundsKill', true);
			return group;
		},

		createEnemies: function () {

			var i, enemy;

			this.enemyPool = this.add.group();
			this.enemyPool.enableBody = true;
			this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;

			for (i = 0; i < CONFIG.GROUND_ENEMY_POOL_SIZE; i++) {
				enemy = this.enemyPool.create(0, 0, this.enemyTexture);
				enemy.anchor.setTo(0.5, 0.5);
				enemy.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
				enemy.body.collideWorldBounds = true;
				enemy.exists = false;
				enemy.alive = false;
			}

		},

		createPlane: function () {

			var playerClass = this.game.selectedPlayerClass || 1;
			this.parkedPlane = this.add.sprite(this.game.world.centerX, 80 * CONFIG.PIXEL_RATIO, 'player_' + playerClass);
			this.parkedPlane.frame = 2;
			this.parkedPlane.anchor.setTo(0.5, 0.5);
			this.parkedPlane.scale.setTo(CONFIG.PIXEL_RATIO * 2, CONFIG.PIXEL_RATIO * 2);
			this.parkedPlane.tint = this.game.selectedPlayerColor || 0xffffff;
			this.game.physics.enable(this.parkedPlane, Phaser.Physics.ARCADE);
			this.parkedPlane.exists = false;
			this.parkedPlane.visible = false;
		},

		createControls: function () {

			this.keys = {
				w: this.input.keyboard.addKey(Phaser.Keyboard.W),
				a: this.input.keyboard.addKey(Phaser.Keyboard.A),
				s: this.input.keyboard.addKey(Phaser.Keyboard.S),
				d: this.input.keyboard.addKey(Phaser.Keyboard.D),
				space: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
				e: this.input.keyboard.addKey(Phaser.Keyboard.E)
			};
		},

		createHUD: function () {

			this.hudText = this.add.bitmapText(8, 8, 'minecraftia', '');
			this.hudText.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			this.hudText.fixedToCamera = true;
			this.messageText = this.add.bitmapText(0, 45, 'minecraftia', '');
			this.messageText.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			this.messageText.fixedToCamera = true;
			this.updateHUD();
		},

		createAudio: function () {

			this.rifleSound = this.add.audio('shoot_player_1', CONFIG.AUDIO_LEVEL);
			this.rocketSound = this.add.audio('shoot_player_5', CONFIG.AUDIO_LEVEL);
		},

		createIntroCutscene: function () {

			var playerClass = this.game.selectedPlayerClass || 1;

			this.player.visible = false;
			this.introPlane = this.add.sprite(this.player.x, this.player.y - 180 * CONFIG.PIXEL_RATIO, 'player_' + playerClass);
			this.introPlane.frame = 2;
			this.introPlane.anchor.setTo(0.5, 0.5);
			this.introPlane.scale.setTo(CONFIG.PIXEL_RATIO * 2, CONFIG.PIXEL_RATIO * 2);
			this.introPlane.tint = this.game.selectedPlayerColor || 0xffffff;
			this.messageText.setText('LANDING');
			this.add.tween(this.introPlane).to({
				y: this.player.y
			}, 900, Phaser.Easing.Quadratic.Out, true).onComplete.add(this.completeGroundIntro, this);
		},

		completeGroundIntro: function () {

			this.introPlane.kill();
			this.player.visible = true;
			this.mode = 'play';
			this.nextEnemySpawnAt = this.game.time.now;
			this.messageText.setText('FIGHT');
		},

		update: function () {

			if (this.mode !== 'play') {
				return;
			}

			this.ensurePlayerVisible();
			this.updatePlayerMovement();
			if (this.keys.space.isDown) {
				this.fireRifle();
			}
			if (this.keys.e.isDown) {
				this.fireGroundRocket();
			}
			this.updateEnemies();
			this.updateCollisions();
			this.maintainEnemyCount();
			this.updateHUD();
		},

		updatePlayerMovement: function () {

			var x = 0,
					y = 0,
					length,
					speed = CONFIG.GROUND_PLAYER_SPEED * CONFIG.PIXEL_RATIO;

			if (this.keys.a.isDown) { x -= 1; }
			if (this.keys.d.isDown) { x += 1; }
			if (this.keys.w.isDown) { y -= 1; }
			if (this.keys.s.isDown) { y += 1; }

			if (x !== 0 || y !== 0) {
				length = Math.sqrt(x * x + y * y);
				x /= length;
				y /= length;
				this.facing.x = x;
				this.facing.y = y;
				if (x > 0) {
					this.player.angle = 90;
				} else if (x < 0) {
					this.player.angle = -90;
				}
			}
			if (this.getBiomeAt(this.player.x, this.player.y) === 'swamp') {
				speed *= CONFIG.GROUND_SWAMP_SPEED_FACTOR;
			}

			this.player.body.velocity.x = x * speed;
			this.player.body.velocity.y = y * speed;
		},

		fireRifle: function () {

			var bullet;
			if (this.game.time.now < this.nextRifleAt) {
				return;
			}
			bullet = this.playerBulletPool.getFirstExists(false);
			if (!bullet) {
				return;
			}
			this.nextRifleAt = this.game.time.now + CONFIG.GROUND_RIFLE_DELAY;
			this.launchGroundProjectile(bullet, CONFIG.GROUND_BULLET_SPEED);
			this.rifleSound.play();
		},

		fireGroundRocket: function () {

			var rocket;
			if (this.game.time.now < this.nextRocketAt) {
				return;
			}
			rocket = this.groundRocketPool.getFirstExists(false);
			if (!rocket) {
				return;
			}
			this.nextRocketAt = this.game.time.now + CONFIG.GROUND_ROCKET_DELAY;
			this.launchGroundProjectile(rocket, CONFIG.GROUND_ROCKET_SPEED);
			rocket.angle = Math.atan2(this.facing.y, this.facing.x) * 180 / Math.PI + 90;
			this.rocketSound.play();
		},

		launchGroundProjectile: function (projectile, speed) {

			projectile.reset(
				this.player.x + this.facing.x * 16 * CONFIG.PIXEL_RATIO,
				this.player.y + this.facing.y * 16 * CONFIG.PIXEL_RATIO
			);
			projectile.body.velocity.x = this.facing.x * speed * CONFIG.PIXEL_RATIO;
			projectile.body.velocity.y = this.facing.y * speed * CONFIG.PIXEL_RATIO;
		},

		maintainEnemyCount: function () {

			if (this.mode !== 'play' ||
					this.kills + this.enemyPool.countLiving() >= CONFIG.GROUND_ENEMY_KILLS ||
					this.enemyPool.countLiving() >= CONFIG.GROUND_ACTIVE_ENEMIES ||
					this.enemyPool.countDead() === 0 ||
					this.game.time.now < this.nextEnemySpawnAt) {
				return;
			}

			this.spawnEnemy();
			this.nextEnemySpawnAt = this.game.time.now + CONFIG.GROUND_ENEMY_SPAWN_DELAY;
		},

		spawnEnemy: function () {

			var enemy = this.enemyPool.getFirstExists(false),
					margin = 35 * CONFIG.PIXEL_RATIO,
					angle,
					distance,
					attempt,
					x,
					y;

			if (!enemy) { return; }
			for (attempt = 0; attempt < CONFIG.GROUND_SPAWN_ATTEMPTS; attempt++) {
				angle = this.rnd.integerInRange(0, 359) * Math.PI / 180;
				distance = this.rnd.integerInRange(
					CONFIG.GROUND_SPAWN_MIN_DISTANCE,
					CONFIG.GROUND_SPAWN_MAX_DISTANCE
				) * CONFIG.PIXEL_RATIO;
				x = this.player.x + Math.cos(angle) * distance;
				y = this.player.y + Math.sin(angle) * distance;
				x = Math.max(margin, Math.min(this.game.world.width - margin, x));
				y = Math.max(margin, Math.min(this.game.world.height - margin, y));
				if (this.isEnemySpawnClear(x, y)) { break; }
			}
			if (attempt >= CONFIG.GROUND_SPAWN_ATTEMPTS) { return; }
			enemy.reset(x, y);
			enemy.health = CONFIG.GROUND_ENEMY_HEALTH;
			enemy.tint = 0xffffff;
			enemy.roamX = Math.cos(angle);
			enemy.roamY = Math.sin(angle);
			enemy.nextRoamAt = this.game.time.now + CONFIG.GROUND_ENEMY_ROAM_DELAY;
			enemy.nextShotAt = this.game.time.now + this.rnd.integerInRange(500, 1200);
		},

		isEnemySpawnClear: function (x, y) {

			var clear = true,
					separation = CONFIG.GROUND_ENEMY_SEPARATION * CONFIG.PIXEL_RATIO,
					separationSquared = separation * separation;

			this.enemyPool.forEachAlive(function (enemy) {
				if (Math.pow(enemy.x - x, 2) + Math.pow(enemy.y - y, 2) < separationSquared) {
					clear = false;
				}
			}, this);
			return clear;
		},

		updateEnemies: function () {

			this.enemyPool.forEachAlive(function (enemy) {
				var dx = this.player.x - enemy.x,
						dy = this.player.y - enemy.y,
						distance = Math.sqrt(dx * dx + dy * dy),
						speed = CONFIG.GROUND_ENEMY_SPEED * CONFIG.PIXEL_RATIO,
						detectionDistance = CONFIG.GROUND_ENEMY_DETECTION_DISTANCE * CONFIG.PIXEL_RATIO,
						roamAngle;

				if (distance > detectionDistance) {
					if (this.game.time.now >= enemy.nextRoamAt) {
						roamAngle = this.rnd.integerInRange(0, 359) * Math.PI / 180;
						enemy.roamX = Math.cos(roamAngle);
						enemy.roamY = Math.sin(roamAngle);
						enemy.nextRoamAt = this.game.time.now + CONFIG.GROUND_ENEMY_ROAM_DELAY;
					}
					enemy.body.velocity.x = enemy.roamX * CONFIG.GROUND_ENEMY_ROAM_SPEED * CONFIG.PIXEL_RATIO;
					enemy.body.velocity.y = enemy.roamY * CONFIG.GROUND_ENEMY_ROAM_SPEED * CONFIG.PIXEL_RATIO;
				} else if (distance > 170 * CONFIG.PIXEL_RATIO) {
					enemy.body.velocity.x = dx / distance * speed;
					enemy.body.velocity.y = dy / distance * speed;
				} else {
					enemy.body.velocity.setTo(0, 0);
					if (this.game.time.now >= enemy.nextShotAt) {
						this.enemyFire(enemy, dx, dy, distance);
					}
				}
				this.updateEnemyFacing(enemy);
			}, this);
		},

		updateEnemyFacing: function (enemy) {

			if (enemy.body.velocity.x > 0.01) {
				enemy.angle = 90;
			} else if (enemy.body.velocity.x < -0.01) {
				enemy.angle = -90;
			}
		},

		enemyFire: function (enemy, dx, dy, distance) {

			var bullet = this.enemyBulletPool.getFirstExists(false),
					speed = CONFIG.GROUND_ENEMY_BULLET_SPEED * CONFIG.PIXEL_RATIO;

			if (!bullet || distance === 0) { return; }
			bullet.reset(enemy.x, enemy.y);
			bullet.body.velocity.x = dx / distance * speed;
			bullet.body.velocity.y = dy / distance * speed;
			enemy.nextShotAt = this.game.time.now + this.rnd.integerInRange(850, 1350);
		},

		updateCollisions: function () {

			this.physics.arcade.collide(this.player, this.obstacles);
			this.physics.arcade.collide(this.enemyPool, this.obstacles);
			this.physics.arcade.collide(this.playerBulletPool, this.obstacles, this.killProjectile, null, this);
			this.physics.arcade.collide(this.enemyBulletPool, this.obstacles, this.killProjectile, null, this);
			this.physics.arcade.collide(this.groundRocketPool, this.obstacles, this.rocketVSobstacle, null, this);
			this.physics.arcade.overlap(this.playerBulletPool, this.enemyPool, this.bulletVSenemy, null, this);
			this.physics.arcade.overlap(this.groundRocketPool, this.enemyPool, this.rocketVSenemy, null, this);
			this.physics.arcade.overlap(this.enemyBulletPool, this.player, this.enemyBulletVSplayer, null, this);
			if (this.parkedPlane.exists) {
				this.physics.arcade.overlap(this.player, this.parkedPlane, this.beginBoarding, null, this);
			}
		},

		killProjectile: function (projectile) {
			projectile.kill();
		},

		bulletVSenemy: function (bullet, enemy) {
			bullet.kill();
			enemy.health -= 1;
			if (enemy.health <= 0) {
				this.defeatGroundEnemy(enemy);
				return;
			}
			this.flashGroundEnemy(enemy);
		},

		flashGroundEnemy: function (enemy) {
			enemy.tint = 0xff7777;
			this.game.time.events.add(100, function () {
				if (enemy.alive) {
					enemy.tint = 0xffffff;
				}
			}, this);
		},

		rocketVSenemy: function (rocket) {
			this.explodeGroundRocket(rocket);
		},

		rocketVSobstacle: function (rocket) {
			this.explodeGroundRocket(rocket);
		},

		explodeGroundRocket: function (rocket) {

			var x = rocket.x,
					y = rocket.y,
					radius = CONFIG.GROUND_ROCKET_RADIUS * CONFIG.PIXEL_RATIO,
					radiusSquared = radius * radius;

			rocket.kill();
			this.enemyPool.forEachAlive(function (enemy) {
				if (Math.pow(enemy.x - x, 2) + Math.pow(enemy.y - y, 2) <= radiusSquared) {
					this.defeatGroundEnemy(enemy);
				}
			}, this);
			this.showGroundExplosion(x, y);
		},

		showGroundExplosion: function (x, y) {

			var explosion = this.add.sprite(x, y, 'explosion_1');
			explosion.anchor.setTo(0.5, 0.5);
			explosion.scale.setTo(CONFIG.PIXEL_RATIO * 2, CONFIG.PIXEL_RATIO * 2);
			explosion.animations.add('boom', [0, 1, 2, 3, 4], 30, false);
			explosion.play('boom', 15, false, true);
		},

		defeatGroundEnemy: function (enemy) {

			if (!enemy.alive) { return; }
			enemy.kill();
			this.kills += 1;
			if (this.kills >= CONFIG.GROUND_ENEMY_KILLS) {
				this.revealPlane();
			}
			this.updateHUD();
		},

		enemyBulletVSplayer: function (bullet) {

			bullet.kill();
			if (this.game.time.now < this.nextPlayerHitAt) { return; }
			this.nextPlayerHitAt = this.game.time.now + CONFIG.GROUND_HIT_IMMUNITY;
			this.health -= 1;
			if (this.health <= 0) {
				this.endGroundGame();
			} else {
				this.ensurePlayerVisible();
			}
			this.updateHUD();
		},

		ensurePlayerVisible: function () {

			if (this.mode !== 'play' || this.health <= 0) { return; }
			if (!this.player.visible || !this.player.exists || !this.player.alive ||
					!this.player.renderable || this.player.alpha <= 0) {
				this.player.revive();
				this.player.visible = true;
				this.player.renderable = true;
				this.player.alpha = 1;
			}
		},

		revealPlane: function () {

			var distance = CONFIG.GROUND_PLANE_REVEAL_DISTANCE * CONFIG.PIXEL_RATIO,
					margin = 50 * CONFIG.PIXEL_RATIO,
					x;

			if (this.parkedPlane.exists) { return; }
			x = this.player.x + distance;
			if (x > this.game.world.width - margin) {
				x = this.player.x - distance;
			}
			this.parkedPlane.x = Math.max(margin, Math.min(this.game.world.width - margin, x));
			this.parkedPlane.y = Math.max(
				margin,
				Math.min(this.game.world.height - margin, this.player.y)
			);
			this.parkedPlane.exists = true;
			this.parkedPlane.visible = true;
			this.parkedPlane.alive = true;
			this.messageText.setText('PLANE FOUND - REACH IT');
		},

		beginBoarding: function () {

			if (this.mode !== 'play' || this.kills < CONFIG.GROUND_ENEMY_KILLS) { return; }
			this.mode = 'boarding';
			this.player.body.velocity.setTo(0, 0);
			this.enemyPool.setAll('body.velocity.x', 0);
			this.enemyPool.setAll('body.velocity.y', 0);
			this.messageText.setText('BOARDING');
			this.add.tween(this.player).to({
				x: this.parkedPlane.x,
				y: this.parkedPlane.y
			}, 700, Phaser.Easing.Linear.None, true).onComplete.add(function () {
				this.player.visible = false;
				this.add.tween(this.parkedPlane).to({
					y: -120 * CONFIG.PIXEL_RATIO
				}, 1200, Phaser.Easing.Quadratic.In, true).onComplete.add(this.finishBoarding, this);
			}, this);
		},

		finishBoarding: function () {

			this.game.runData = this.game.runData || {};
			this.game.runData.groundComplete = true;
			this.game.runData.groundKills = this.kills;
			this.game.runData.resumeFlight = false;
			this.game.state.start('carrier');
		},

		endGroundGame: function () {

			this.mode = 'gameover';
			this.player.body.velocity.setTo(0, 0);
			this.messageText.setText('GAME OVER');
			this.game.runData = null;
			this.game.time.events.add(1200, function () {
				this.game.state.start('menu');
			}, this);
		},

		updateHUD: function () {

			var rocketStatus = this.game.time.now >= this.nextRocketAt ? 'READY' :
				Math.ceil((this.nextRocketAt - this.game.time.now) / 1000) + 's';
			this.hudText.setText(
				'HP ' + this.health + '/' + CONFIG.GROUND_PLAYER_HEALTH +
				'  KILLS ' + this.kills + '/' + CONFIG.GROUND_ENEMY_KILLS +
				'  ROCKET ' + rocketStatus
			);
		}
	};

	window['firsttry'] = window['firsttry'] || {};
	window['firsttry'].GroundGame = GroundGame;

}());
