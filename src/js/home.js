/*globals CONFIG, Phaser */

(function() {
	'use strict';

	function Home() {
		this.selection = 0;
		this.items = [];
	}

	Home.prototype = {

		create: function () {
			var progress = window.firsttry.Progress.load(this.game);
			this.stage.backgroundColor = '#071018';
			this.titleText = this.add.bitmapText(0, 100, 'minecraftia', 'GUNNER');
			this.titleText.scale.setTo(CONFIG.PIXEL_RATIO * 1.2, CONFIG.PIXEL_RATIO * 1.2);
			this.center(this.titleText);
			this.coinText = this.add.bitmapText(0, 22, 'minecraftia', 'COINS ' + progress.coins);
			this.coinText.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			this.coinText.x = this.game.width - this.coinText.textWidth * this.coinText.scale.x - 16;
			this.createCommand('START', 320, this.startGame);
			this.createCommand('SHOP', 420, this.openShop);
			this.keys = {
				up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
				down: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
				enter: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
				w: this.input.keyboard.addKey(Phaser.Keyboard.W)
			};
			this.updateSelection();
		},

		createCommand: function (label, y, action) {
			var item = this.add.bitmapText(0, y, 'minecraftia', label);
			item.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			this.center(item);
			item.inputEnabled = true;
			item.events.onInputDown.add(action, this);
			this.items.push(item);
		},

		center: function (text) {
			text.x = (this.game.width - text.textWidth * text.scale.x) / 2;
		},

		update: function () {
			if (this.keys.up.justDown) {
				this.selection = (this.selection + this.items.length - 1) % this.items.length;
				this.updateSelection();
			} else if (this.keys.down.justDown) {
				this.selection = (this.selection + 1) % this.items.length;
				this.updateSelection();
			} else if (this.keys.enter.justDown || this.keys.w.justDown) {
				if (this.selection === 0) { this.startGame(); } else { this.openShop(); }
			}
		},

		updateSelection: function () {
			var i;
			for (i = 0; i < this.items.length; i++) {
				this.items[i].tint = i === this.selection ? 0xffdd66 : 0xffffff;
			}
		},

		startGame: function () {
			this.game.state.start('menu');
		},

		openShop: function () {
			this.game.state.start('shop');
		}
	};

	window.firsttry = window.firsttry || {};
	window.firsttry.Home = Home;

}());
