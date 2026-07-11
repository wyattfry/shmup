/*globals CONFIG */

(function() {
	'use strict';

	function Menu() {

		this.titleTxt = null;
		this.startTxt = null;
		this.profileTxts = [];
		this.profileSprites = [];
		this.colorTxt = null;
		this.colorSwatches = [];
		this.colorPreview = null;
		this.doneTxt = null;
		this.menuMode = 'class';
		this.keys = null;
		this.profileRowHeight = 128;
		this.selectedPlayerClass = 1;
		this.selectedPlayerColorIndex = 0;
	}

	Menu.prototype = {

		create: function () {

			var x = this.game.width / 2;

			this.profileTxts = [];
			this.profileSprites = [];
			this.colorSwatches = [];
			this.menuMode = 'class';
			this.selectedPlayerClass = this.game.selectedPlayerClass || 1;
			this.selectedPlayerColorIndex = this.game.selectedPlayerColorIndex || 0;
			this.keys = {
				up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
				down: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
				left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
				right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
				one: this.input.keyboard.addKey(Phaser.Keyboard.ONE),
				two: this.input.keyboard.addKey(Phaser.Keyboard.TWO),
				three: this.input.keyboard.addKey(Phaser.Keyboard.THREE),
				four: this.input.keyboard.addKey(Phaser.Keyboard.FOUR),
				w: this.input.keyboard.addKey(Phaser.Keyboard.W)
			};

			this.titleTxt = this.add.bitmapText(x, 24, 'minecraftia', 'PHASER SHMUP' );
			this.titleTxt.align = 'center';
			this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;
			this.titleTxt.y = 24;

			this.startTxt = this.add.bitmapText(x, this.game.height - 124, 'minecraftia', 'Arrows / 1-4 : choose class\nW / click : color\nIn game: W shoot, E rocket');
			this.startTxt.scale.setTo(0.7, 0.7);
			this.startTxt.align = 'center';
			this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth * this.startTxt.scale.x / 2;

			this.createProfileList();
			this.updateProfileList();

			this.input.onDown.remove(this.onDown, this);
			this.input.onDown.add(this.onDown, this);
		},

		update: function () {

			if (this.menuMode === 'class') {
				this.updateClassInput();
				if (this.keys.w.justDown) {
					this.confirmMenu();
				}

			} else {
				this.updateColorInput();
			}
		},

		updateClassInput: function () {

			if (this.keys.up.justDown) {
				this.selectPlayerClass(this.selectedPlayerClass - 1);

			} else if (this.keys.down.justDown) {
				this.selectPlayerClass(this.selectedPlayerClass + 1);

			} else if (this.keys.one.justDown) {
				this.selectPlayerClass(1);

			} else if (this.keys.two.justDown) {
				this.selectPlayerClass(2);

			} else if (this.keys.three.justDown) {
				this.selectPlayerClass(3);

			} else if (this.keys.four.justDown) {
				this.selectPlayerClass(4);
			}
		},

		updateColorInput: function () {

			if (this.keys.up.justDown || this.keys.left.justDown) {
				this.selectPlayerColor(this.selectedPlayerColorIndex - 1);

			} else if (this.keys.down.justDown || this.keys.right.justDown) {
				this.selectPlayerColor(this.selectedPlayerColorIndex + 1);

			} else if (this.keys.one.justDown) {
				this.selectPlayerColor(0);

			} else if (this.keys.two.justDown) {
				this.selectPlayerColor(1);

			} else if (this.keys.three.justDown) {
				this.selectPlayerColor(2);

			} else if (this.keys.four.justDown) {
				this.selectPlayerColor(3);
			}
		},

		onDown: function () {

			var pointerY = this.input.activePointer.y
				, pointerX = this.input.activePointer.x
				, i;

			if (this.menuMode === 'color') {
				for (i = 0; i < this.colorSwatches.length; i++) {
					if (pointerX >= this.colorSwatches[i].x && pointerX <= this.colorSwatches[i].x + this.colorSwatches[i].size &&
							pointerY >= this.colorSwatches[i].y && pointerY <= this.colorSwatches[i].y + this.colorSwatches[i].size) {
						this.selectPlayerColor(i);
						return;
					}
				}

				if (this.doneTxt && pointerX >= this.doneTxt.x && pointerX <= this.doneTxt.x + this.doneTxt.textWidth &&
						pointerY >= this.doneTxt.y && pointerY <= this.doneTxt.y + this.doneTxt.textHeight) {
					this.startGame();
				}

				return;

			} else {
				for (i = 0; i < this.profileTxts.length; i++) {
					if (pointerY >= this.profileTxts[i].y && pointerY <= this.profileTxts[i].y + this.profileRowHeight) {
						this.selectPlayerClass(i + 1);
						break;
					}
				}
			}

			this.confirmMenu();
		},

		createColorTabs: function () {

			var i
				, swatch
				, size = 44
				, x = 180
				, y = 320;

			this.colorTxt = this.add.bitmapText(0, 106, 'minecraftia', 'PICK COLOR');
			this.colorTxt.x = this.game.width / 2 - this.colorTxt.textWidth / 2;

			this.colorPreview = this.add.sprite(this.game.width / 2, 210, 'player_' + this.selectedPlayerClass);
			this.colorPreview.frame = 2;
			this.colorPreview.anchor.setTo(0.5, 0.5);
			this.colorPreview.scale.setTo(CONFIG.PIXEL_RATIO * 3, CONFIG.PIXEL_RATIO * 3);

			this.doneTxt = this.add.bitmapText(0, 408, 'minecraftia', 'DONE');
			this.doneTxt.scale.setTo(1.2, 1.2);
			this.doneTxt.x = this.game.width / 2 - this.doneTxt.textWidth * this.doneTxt.scale.x / 2;

			for (i = 0; i < CONFIG.PLAYER_COLORS.length; i++) {
				swatch = this.add.graphics(x + i * 58, y);
				swatch.size = size;
				this.colorSwatches.push(swatch);
			}
		},

		selectPlayerColor: function (colorIndex) {

			if (colorIndex < 0) {
				colorIndex = CONFIG.PLAYER_COLORS.length - 1;

			} else if (colorIndex >= CONFIG.PLAYER_COLORS.length) {
				colorIndex = 0;
			}

			this.selectedPlayerColorIndex = colorIndex;
			this.game.selectedPlayerColorIndex = colorIndex;
			this.game.selectedPlayerColor = CONFIG.PLAYER_COLORS[colorIndex].tint;
			this.updateColorTabs();
			this.updateProfileList();
		},

		updateColorTabs: function () {

			var i
				, swatch;

			for (i = 0; i < this.colorSwatches.length; i++) {
				swatch = this.colorSwatches[i];
				swatch.clear();
				swatch.lineStyle((i === this.selectedPlayerColorIndex) ? 4 : 2, 0xffffff);
				swatch.beginFill(CONFIG.PLAYER_COLORS[i].tint);
				swatch.drawRect(0, 0, swatch.size, swatch.size);
				swatch.endFill();
			}

			if (this.colorPreview) {
				this.colorPreview.tint = CONFIG.PLAYER_COLORS[this.selectedPlayerColorIndex].tint;
			}
		},

		createProfileList: function () {

			var i
				, y
				, profileTxt
				, profileSprite;

			for (i = 0; i < CONFIG.CLASS_STATS.length; i++) {
				y = 92 + i * this.profileRowHeight;

				profileSprite = this.add.sprite(74, y + 36, 'player_' + (i + 1));
				profileSprite.frame = 2;
				profileSprite.anchor.setTo(0.5, 0.5);
				profileSprite.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
				profileSprite.animations.add('selected', [ 0, 1, 2, 3, 4, 3, 2, 1 ], 8, true);
				this.profileSprites.push(profileSprite);

				profileTxt = this.add.bitmapText(128, y, 'minecraftia', '');
				profileTxt.scale.setTo(0.7, 0.7);
				this.profileTxts.push(profileTxt);
			}
		},

		selectPlayerClass: function (playerClass) {

			var classCount = CONFIG.CLASS_STATS.length;

			if (playerClass < 1) {
				playerClass = classCount;

			} else if (playerClass > classCount) {
				playerClass = 1;
			}

			this.selectedPlayerClass = playerClass;
			this.game.selectedPlayerClass = playerClass;
			this.updateProfileList();
		},

		updateProfileList: function () {

			var i
				, stats
				, prefix
				, text;

			for (i = 0; i < CONFIG.CLASS_STATS.length; i++) {
				stats = CONFIG.CLASS_STATS[i];
				prefix = (i + 1 === this.selectedPlayerClass) ? '> ' : '  ';
				text = prefix + (i + 1) + '. ' + stats.className + '\n' +
					'HP ' + stats.health + '  STR ' + stats.strength + '\n' +
					'RAT ' + stats.rate + '  SPD ' + stats.speed + '  ACC ' + stats.accel;

				this.profileTxts[i].setText(text);
				this.profileSprites[i].tint = CONFIG.PLAYER_COLORS[this.selectedPlayerColorIndex].tint;
				this.profileSprites[i].alpha = (i + 1 === this.selectedPlayerClass) ? 1 : 0.55;

				if (i + 1 === this.selectedPlayerClass) {
					this.profileSprites[i].play('selected');

				} else {
					this.profileSprites[i].animations.stop();
					this.profileSprites[i].frame = 2;
				}
			}
		},

		showColorScreen: function () {

			var i;

			if (this.menuMode === 'color') {
				return;
			}

			this.menuMode = 'color';

			for (i = 0; i < this.profileTxts.length; i++) {
				this.profileTxts[i].visible = false;
				this.profileSprites[i].visible = false;
			}

			this.createColorTabs();
			this.updateColorTabs();
			this.startTxt.setText('Arrows / click : choose color\nClick DONE : start');
			this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth * this.startTxt.scale.x / 2;
		},

		confirmMenu: function () {

			if (this.menuMode === 'class') {
				this.showColorScreen();

			} else {
				this.startGame();
			}
		},

		startGame: function () {

			this.game.runData = null;
			this.game.selectedPlayerClass = this.selectedPlayerClass;
			this.game.selectedPlayerColorIndex = this.selectedPlayerColorIndex;
			this.game.selectedPlayerColor = CONFIG.PLAYER_COLORS[this.selectedPlayerColorIndex].tint;
			this.game.state.start('game');
		}
	};

	window['firsttry'] = window['firsttry'] || {};
	window['firsttry'].Menu = Menu;

}());
