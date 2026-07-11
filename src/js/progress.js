(function() {
	'use strict';

	var STORAGE_KEY = 'gunner-progress-v1',
			UPGRADES = {
				armor: { basePrice: 20, maxLevel: 5, label: 'ARMOR' },
				engine: { basePrice: 25, maxLevel: 5, label: 'ENGINE' },
				weapons: { basePrice: 30, maxLevel: 5, label: 'WEAPONS' },
				fireControl: { basePrice: 35, maxLevel: 5, label: 'FIRE CONTROL' }
			};

	function defaults() {
		return {
			version: 1,
			coins: 0,
			upgrades: { armor: 0, engine: 0, weapons: 0, fireControl: 0 },
			colors: []
		};
	}

	function normalize(value) {
		var data = defaults(), key;
		if (!value || typeof value !== 'object') { return data; }
		data.coins = Math.max(0, Number(value.coins) || 0);
		for (key in data.upgrades) {
			if (data.upgrades.hasOwnProperty(key)) {
				data.upgrades[key] = Math.max(0, Math.min(
					UPGRADES[key].maxLevel,
					Number(value.upgrades && value.upgrades[key]) || 0
				));
			}
		}
		data.colors = value.colors instanceof Array ? value.colors.slice(0) : [];
		return data;
	}

	var Progress = {

		upgrades: UPGRADES,

		load: function (game) {
			var parsed = game.progressData;
			if (!parsed) {
				try {
					parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
				} catch (error) {
					parsed = null;
				}
			}
			game.progressData = normalize(parsed);
			return game.progressData;
		},

		save: function (game) {
			try {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game.progressData));
			} catch (error) {
				return false;
			}
			return true;
		},

		addCoins: function (game, amount) {
			var data = this.load(game);
			data.coins += Math.max(0, Number(amount) || 0);
			this.save(game);
			return data.coins;
		},

		getUpgradePrice: function (id, level) {
			return UPGRADES[id].basePrice * (Number(level) + 1);
		},

		buyUpgrade: function (game, id) {
			var data = this.load(game),
					definition = UPGRADES[id],
					level = data.upgrades[id],
					price;
			if (!definition || level >= definition.maxLevel) { return false; }
			price = this.getUpgradePrice(id, level);
			if (data.coins < price) { return false; }
			data.coins -= price;
			data.upgrades[id] += 1;
			this.save(game);
			return true;
		},

		ownsColor: function (game, id) {
			return this.load(game).colors.indexOf(id) !== -1;
		},

		buyColor: function (game, id, price) {
			var data = this.load(game);
			if (data.colors.indexOf(id) !== -1 || data.coins < price) { return false; }
			data.coins -= price;
			data.colors.push(id);
			this.save(game);
			return true;
		}
	};

	window.firsttry = window.firsttry || {};
	window.firsttry.Progress = Progress;

}());
