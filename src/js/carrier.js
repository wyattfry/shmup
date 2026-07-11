/*globals CONFIG, Phaser */

(function() {
	'use strict';

	function CarrierCutscene() {
		this.phase = 'approach';
		this.dialogueLines = [];
		this.dialogueIndex = 0;
	}

	CarrierCutscene.prototype = {

		create: function () {

			this.createTextures();
			this.createScene();
			this.input.onDown.add(this.onDown, this);
			this.beginApproach();
		},

		makeTexture: function (width, height, draw) {

			var texture = this.add.bitmapData(width, height);
			draw(texture.ctx);
			texture.dirty = true;
			return texture;
		},

		createTextures: function () {

			this.oceanTexture = this.makeTexture(32, 32, function (ctx) {
				ctx.fillStyle = '#174b68';
				ctx.fillRect(0, 0, 32, 32);
				ctx.fillStyle = '#2d7894';
				ctx.fillRect(2, 7, 13, 2);
				ctx.fillRect(18, 23, 11, 2);
			});
			this.carrierTexture = this.makeTexture(260, 330, function (ctx) {
				ctx.fillStyle = '#18242b';
				ctx.fillRect(18, 8, 224, 314);
				ctx.fillStyle = '#606b70';
				ctx.fillRect(28, 12, 204, 300);
				ctx.fillStyle = '#353f43';
				ctx.fillRect(118, 18, 8, 282);
				ctx.fillStyle = '#e3d66b';
				ctx.fillRect(124, 28, 3, 42);
				ctx.fillRect(124, 92, 3, 42);
				ctx.fillRect(124, 156, 3, 42);
				ctx.fillRect(124, 220, 3, 42);
				ctx.fillStyle = '#f4f4ed';
				ctx.fillRect(74, 205, 112, 4);
				ctx.fillRect(74, 265, 112, 4);
				ctx.fillRect(74, 205, 4, 64);
				ctx.fillRect(182, 205, 4, 64);
				ctx.fillStyle = '#263238';
				ctx.fillRect(176, 72, 42, 72);
				ctx.fillStyle = '#9ba6aa';
				ctx.fillRect(183, 79, 28, 16);
			});
			this.soldierTexture = this.makePersonTexture('#315f9b', '#d8b48a', false);
			this.generalTexture = this.makePersonTexture('#485a32', '#d8b48a', true);
		},

		makePersonTexture: function (uniform, skin, general) {

			return this.makeTexture(16, 18, function (ctx) {
				ctx.fillStyle = '#111111';
				ctx.fillRect(4, 1, 8, 16);
				ctx.fillStyle = skin;
				ctx.fillRect(5, 2, 6, 5);
				ctx.fillStyle = uniform;
				ctx.fillRect(4, 7, 8, 8);
				if (general) {
					ctx.fillStyle = '#d7b64a';
					ctx.fillRect(4, 0, 8, 2);
					ctx.fillRect(5, 8, 2, 2);
					ctx.fillRect(9, 8, 2, 2);
				}
			});
		},

		createScene: function () {

			var playerClass = this.game.selectedPlayerClass || 1;
			this.ocean = this.add.tileSprite(0, 0, this.game.width, this.game.height, this.oceanTexture);
			this.carrier = this.add.sprite(this.game.width / 2, this.game.height + 220, this.carrierTexture);
			this.carrier.anchor.setTo(0.5, 0.5);
			this.plane = this.add.sprite(this.game.width / 2, -90, 'player_' + playerClass);
			this.plane.frame = 2;
			this.plane.anchor.setTo(0.5, 0.5);
			this.plane.scale.setTo(CONFIG.PIXEL_RATIO * 2, CONFIG.PIXEL_RATIO * 2);
			this.plane.tint = this.game.selectedPlayerColor || 0xffffff;
			this.soldier = this.add.sprite(this.game.width / 2, this.game.height / 2, this.soldierTexture);
			this.soldier.anchor.setTo(0.5, 0.5);
			this.soldier.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			this.soldier.visible = false;
			this.general = this.add.sprite(this.game.width / 2 + 82, this.game.height / 2 + 112, this.generalTexture);
			this.general.anchor.setTo(0.5, 0.5);
			this.general.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			this.general.visible = false;
			this.titleText = this.add.bitmapText(0, 28, 'minecraftia', 'RETURNING TO THE FLEET');
			this.titleText.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			this.centerText(this.titleText);
		},

		centerText: function (text) {

			text.x = (this.game.width - text.textWidth * text.scale.x) / 2;
		},

		beginApproach: function () {

			this.phase = 'approach';
			this.add.tween(this.carrier).to({
				y: this.game.height / 2 + 105
			}, 1400, Phaser.Easing.Quadratic.Out, true).onComplete.add(this.beginLanding, this);
		},

		beginLanding: function () {

			this.phase = 'landing';
			this.titleText.setText('FINAL APPROACH');
			this.centerText(this.titleText);
			this.add.tween(this.plane).to({
				y: this.game.height / 2 + 52
			}, 1700, Phaser.Easing.Quadratic.Out, true).onComplete.add(this.beginDeboard, this);
		},

		beginDeboard: function () {

			this.phase = 'deboarding';
			this.titleText.setText('DECK SECURE');
			this.centerText(this.titleText);
			this.general.visible = true;
			this.soldier.x = this.plane.x;
			this.soldier.y = this.plane.y + 34;
			this.soldier.visible = true;
			this.add.tween(this.soldier).to({
				x: this.general.x - 38,
				y: this.general.y
			}, 1100, Phaser.Easing.Linear.None, true).onComplete.add(this.beginDialogue, this);
		},

		beginDialogue: function () {

			this.phase = 'dialogue';
			this.dialogueLines = this.getDialogueLines();
			this.dialogueIndex = 0;
			this.dialoguePanel = this.add.graphics(24, this.game.height - 180);
			this.dialoguePanel.beginFill(0x050505, 0.92);
			this.dialoguePanel.lineStyle(3, 0xffffff, 1);
			this.dialoguePanel.drawRect(0, 0, this.game.width - 48, 132);
			this.dialoguePanel.endFill();
			this.dialogueText = this.add.bitmapText(42, this.game.height - 156, 'minecraftia', '');
			this.dialogueText.scale.setTo(CONFIG.PIXEL_RATIO / 3, CONFIG.PIXEL_RATIO / 3);
			this.advanceDialogue();
		},

		getDialogueLines: function () {

			return [
				'GENERAL:\nPILOT, WE FOUND YOUR REPORT.',
				'GENERAL:\nTWENTY HOSTILES. ONE ROCKET\nLAUNCHER...',
				'GENERAL:\nAND YOU PARKED MY PLANE\nIN A SWAMP.',
				'GENERAL:\nOUTSTANDING WORK. NEXT TIME,\nBRING IT BACK CLEAN.'
			];
		},

		advanceDialogue: function () {

			if (this.dialogueIndex >= this.dialogueLines.length) {
				this.showMissionComplete();
				return;
			}
			this.dialogueText.setText(this.dialogueLines[this.dialogueIndex]);
			this.dialogueIndex += 1;
		},

		showMissionComplete: function () {

			var runData = this.game.runData || {},
					kills = runData.groundKills || CONFIG.GROUND_ENEMY_KILLS,
					coins = runData.coins || 0,
					unlockedNow = this.unlockFifthPlane(),
					rewardText = unlockedNow ? '\n\nNEW PLANE UNLOCKED' : '';

			this.phase = 'complete';
			if (this.dialoguePanel) { this.dialoguePanel.destroy(); }
			if (this.dialogueText) { this.dialogueText.destroy(); }
			this.titleText.setText('MISSION COMPLETE');
			this.titleText.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			this.titleText.y = 90;
			this.centerText(this.titleText);
			this.summaryText = this.add.bitmapText(0, 210, 'minecraftia',
				'ENEMIES ' + kills + '\nCOINS ' + coins + rewardText + '\n\nCLICK TO RETURN');
			this.summaryText.align = 'center';
			this.summaryText.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			this.centerText(this.summaryText);
		},

		unlockFifthPlane: function () {

			var wasUnlocked = !!this.game.plane5Unlocked;
			this.game.plane5Unlocked = true;
			try {
				window.localStorage.setItem(CONFIG.PLANE_5_UNLOCK_KEY, 'unlocked');
			} catch (error) {
				this.game.plane5Unlocked = true;
			}
			return !wasUnlocked;
		},

		onDown: function () {

			if (this.phase === 'dialogue') {
				this.advanceDialogue();
			} else if (this.phase === 'complete') {
				this.game.runData = null;
				this.game.state.start('menu');
			}
		},

		update: function () {

			if (this.ocean) {
				this.ocean.tilePosition.y += 0.7 * CONFIG.PIXEL_RATIO;
			}
		},

		shutdown: function () {

			this.input.onDown.remove(this.onDown, this);
		}
	};

	window.firsttry = window.firsttry || {};
	window.firsttry.CarrierCutscene = CarrierCutscene;

}());
