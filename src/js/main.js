/*globals CONFIG */

window.onload = function () {
  'use strict';

  var game
    , ns = window['firsttry'];

  game = new Phaser.Game(
  	CONFIG.GAME_WIDTH * CONFIG.PIXEL_RATIO, 
  	CONFIG.GAME_HEIGHT * CONFIG.PIXEL_RATIO, 
  	Phaser.AUTO, 
  	// 'firsttry-game', 
  	'', 
  	null, 
  	false, 
  	false
  	);

  game.CONFIG = CONFIG;

  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('home', ns.Home);
  game.state.add('shop', ns.Shop);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
	game.state.add('ground', ns.GroundGame);
	game.state.add('carrier', ns.CarrierCutscene);

  game.state.start('boot');
};
