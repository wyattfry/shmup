'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var started = null;

var context = {
	CONFIG: {},
	Phaser: { Keyboard: {} },
	window: { firsttry: {} }
};

vm.runInNewContext(fs.readFileSync('src/js/home.js', 'utf8'), context);
vm.runInNewContext(fs.readFileSync('src/js/shop.js', 'utf8'), context);

var home = new context.window.firsttry.Home();
home.game = { state: { start: function (name) { started = name; } } };
home.startGame();
assert.strictEqual(started, 'menu', 'START must open plane selection');
home.openShop();
assert.strictEqual(started, 'shop', 'SHOP must open the shop state');

var shop = new context.window.firsttry.Shop();
shop.game = { state: { start: function (name) { started = name; } } };
shop.goBack();
assert.strictEqual(started, 'home', 'shop BACK must return to the main menu');

shop.rows = [{ stale: true }];
shop.selection = 6;
shop.resetViewState();
assert.strictEqual(shop.rows.length, 0, 're-entering the shop must discard stale destroyed rows');
assert.strictEqual(shop.selection, 0, 're-entering the shop must reset keyboard selection');

home.items = [{ stale: true }];
home.selection = 1;
home.resetViewState();
assert.strictEqual(home.items.length, 0, 're-entering home must discard stale destroyed commands');
assert.strictEqual(home.selection, 0, 're-entering home must reset keyboard selection');

var preloaderSource = fs.readFileSync('src/js/preloader.js', 'utf8');
var groundSource = fs.readFileSync('src/js/ground.js', 'utf8');
var carrierSource = fs.readFileSync('src/js/carrier.js', 'utf8');
assert.ok(/state\.start\('home'\)/.test(preloaderSource), 'startup must enter the home state');
assert.ok(/endGroundGame[\s\S]*state\.start\('home'\)/.test(groundSource),
	'ground defeat must return home');
assert.ok(/phase === 'complete'[\s\S]*state\.start\('home'\)/.test(carrierSource),
	'mission completion must return home');

console.log('home and shop navigation regression test passed');
