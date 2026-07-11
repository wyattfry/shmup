/*globals CONFIG, Phaser */

(function() {
	'use strict';

	function Shop() {
		this.rows = [];
		this.selection = 0;
	}

	Shop.prototype = {

		create: function () {
			var id, definition, colors = CONFIG.PLAYER_COLORS || [], i;
			this.resetViewState();
			this.stage.backgroundColor = '#10141a';
			this.progress = window.firsttry.Progress.load(this.game);
			this.titleText = this.add.bitmapText(0, 30, 'minecraftia', 'SHOP');
			this.titleText.scale.setTo(CONFIG.PIXEL_RATIO, CONFIG.PIXEL_RATIO);
			this.center(this.titleText);
			this.coinText = this.add.bitmapText(16, 92, 'minecraftia', '');
			this.coinText.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			for (id in window.firsttry.Progress.upgrades) {
				if (window.firsttry.Progress.upgrades.hasOwnProperty(id)) {
					definition = window.firsttry.Progress.upgrades[id];
					this.addRow('upgrade', id, definition, 150 + this.rows.length * 72);
				}
			}
			for (i = 0; i < colors.length; i++) {
				if (colors[i].premium) {
					this.addRow('color', colors[i].id, colors[i], 150 + this.rows.length * 72);
				}
			}
			this.backText = this.add.bitmapText(0, 680, 'minecraftia', 'BACK');
			this.backText.scale.setTo(CONFIG.PIXEL_RATIO / 1.5, CONFIG.PIXEL_RATIO / 1.5);
			this.center(this.backText);
			this.backText.inputEnabled = true;
			this.backText.events.onInputDown.add(this.goBack, this);
			this.feedbackText = this.add.bitmapText(0, 740, 'minecraftia', '');
			this.feedbackText.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			this.keys = {
				up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
				down: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
				enter: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
				w: this.input.keyboard.addKey(Phaser.Keyboard.W),
				escape: this.input.keyboard.addKey(Phaser.Keyboard.ESC)
			};
			this.refresh();
		},

		resetViewState: function () {
			this.rows = [];
			this.selection = 0;
		},

		addRow: function (type, id, definition, y) {
			var row = this.add.bitmapText(24, y, 'minecraftia', '');
			row.scale.setTo(CONFIG.PIXEL_RATIO / 2, CONFIG.PIXEL_RATIO / 2);
			row.shopType = type;
			row.shopId = id;
			row.definition = definition;
			row.inputEnabled = true;
			row.events.onInputDown.add(this.purchaseRow, this, 0, row);
			this.rows.push(row);
		},

		center: function (text) {
			text.x = (this.game.width - text.textWidth * text.scale.x) / 2;
		},

		update: function () {
			if (this.keys.escape.justDown) { this.goBack(); return; }
			if (this.keys.up.justDown) {
				this.selection = (this.selection + this.rows.length) % (this.rows.length + 1);
				this.refresh();
			} else if (this.keys.down.justDown) {
				this.selection = (this.selection + 1) % (this.rows.length + 1);
				this.refresh();
			} else if (this.keys.enter.justDown || this.keys.w.justDown) {
				if (this.selection === this.rows.length) { this.goBack(); }
				else { this.purchaseRow(this.rows[this.selection]); }
			}
		},

		purchaseRow: function (row) {
			var bought;
			if (row.shopType === 'upgrade') {
				bought = window.firsttry.Progress.buyUpgrade(this.game, row.shopId);
			} else {
				bought = window.firsttry.Progress.buyColor(this.game, row.shopId, row.definition.price);
			}
			this.setFeedback(bought ? 'PURCHASED' : 'NOT ENOUGH COINS');
			this.refresh();
		},

		setFeedback: function (text) {
			this.feedbackText.setText(text);
			this.center(this.feedbackText);
		},

		refresh: function () {
			var data = window.firsttry.Progress.load(this.game), i, row, level, price, owned;
			this.coinText.setText('COINS ' + data.coins);
			for (i = 0; i < this.rows.length; i++) {
				row = this.rows[i];
				if (row.shopType === 'upgrade') {
					level = data.upgrades[row.shopId];
					price = window.firsttry.Progress.getUpgradePrice(row.shopId, level);
					row.setText(row.definition.label + '  LV ' + level +
						(level >= row.definition.maxLevel ? '  MAX' : '  ' + price + ' COINS'));
				} else {
					owned = window.firsttry.Progress.ownsColor(this.game, row.shopId);
					row.setText(row.definition.name + (owned ? '  OWNED' : '  ' + row.definition.price + ' COINS'));
				}
				row.tint = i === this.selection ? 0xffdd66 : 0xffffff;
			}
			this.backText.tint = this.selection === this.rows.length ? 0xffdd66 : 0xffffff;
		},

		goBack: function () {
			this.game.state.start('home');
		}
	};

	window.firsttry = window.firsttry || {};
	window.firsttry.Shop = Shop;

}());
