/*globals CONFIG */

(function() {
	'use strict';

	/************************************************************************************************
	 * MOB CLASS
	 * 
	 * Have health, can take damage and die
	 * Dies if below the screen
	 * Parent of both player and enemies
	 *
	 ************************************************************************************************/

	function Mob(state, image) {

		// Call parent constructor
		window['firsttry'].Actor.call(this, state, image);
	
		// Mob properties
		this.alive = true;
		this.health = 100;
		this.maxHealth = this.health;
		this.isDamaged = false;
		this.damageBlinkLast = 0;
		this.baseTint = 0xffffff;
		this.tint = 0xffffff;
		this.healthBarBack = null;
		this.healthBarFront = null;

		// this.speed = 160 * CONFIG.PIXEL_RATIO;
	}

	Mob.prototype = Object.create(window['firsttry'].Actor.prototype);
	Mob.prototype.constructor = Mob;

	Mob.prototype.update = function () {

		// Call parent update function
		window['firsttry'].Actor.prototype.update.call(this);

		// Kill mob if below the screen
		if (this.y > CONFIG.GAME_HEIGHT * CONFIG.PIXEL_RATIO + 200) {
			this.kill();
			return;
		}

		this.updateTint();
		this.updateHealthBar();
	};

	Mob.prototype.createHealthBar = function () {

		if (this.healthBarBack || this instanceof window['firsttry'].Player) {
			return;
		}

		this.healthBarBack = this.game.add.graphics(0, 0);
		this.healthBarBack.beginFill(0x000000);
		this.healthBarBack.drawRect(0, 0, 24 * CONFIG.PIXEL_RATIO, 3 * CONFIG.PIXEL_RATIO);
		this.healthBarBack.endFill();

		this.healthBarFront = this.game.add.graphics(0, 0);
		this.healthBarFront.beginFill(0x00ff00);
		this.healthBarFront.drawRect(0, 0, 24 * CONFIG.PIXEL_RATIO, 3 * CONFIG.PIXEL_RATIO);
		this.healthBarFront.endFill();
	};

	Mob.prototype.updateHealthBar = function () {

		var barWidth = 24 * CONFIG.PIXEL_RATIO,
				barX = this.x - barWidth / 2,
				barY = this.y - this.height / 2 - 6 * CONFIG.PIXEL_RATIO,
				healthRatio = this.health / this.maxHealth;

		if (!this.healthBarBack) {
			return;
		}

		if (!this.exists || !this.alive || healthRatio >= 1) {
			this.healthBarBack.visible = false;
			this.healthBarFront.visible = false;
			return;
		}

		if (healthRatio < 0) {
			healthRatio = 0;
		}

		this.healthBarBack.visible = true;
		this.healthBarFront.visible = true;
		this.healthBarBack.x = barX;
		this.healthBarBack.y = barY;
		this.healthBarFront.x = barX;
		this.healthBarFront.y = barY;
		this.healthBarFront.scale.x = healthRatio;
	};

	Mob.prototype.hideHealthBar = function () {

		if (this.healthBarBack) {
			this.healthBarBack.visible = false;
			this.healthBarFront.visible = false;
		}
	};

	Mob.prototype.updateTint = function () {

		// Mob hit
		if (this.isDamaged) {
			this.damageBlinkLast -= 2;

			if (this.damageBlinkLast < 0) {

				this.isDamaged = false;
			}
		}

		if (this.isDamaged) {
			this.tint = 0xff0000;
		} else {
			this.tint = this.baseTint;
		}
	};

	Mob.prototype.takeDamage = function (damage) {

		this.health -= damage;

		if (this.health <= 0) {
			this.hideHealthBar();
			this.kill();

		} else {
			this.blink();
		}
	};

	Mob.prototype.blink = function () {

		this.isDamaged = true;
		this.damageBlinkLast = CONFIG.BLINK_DAMAGE_TIME;
	};

	Mob.prototype.revive = function () {

		// replenish health (dunno why, but it's always set to 1 when calling a dead sprite from a pool)
		this.health = this.maxHealth;
		this.createHealthBar();
		this.updateHealthBar();
	};

	Mob.prototype.die = function () {

		this.hideHealthBar();

		this.kill();
	};


	// Export the object
	window['firsttry'] = window['firsttry'] || {};
	window['firsttry'].Mob = Mob;
}());
