'use strict';

var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

var context = {
	CONFIG: { PIXEL_RATIO: 1 },
	Phaser: {},
	window: {}
};

vm.runInNewContext(fs.readFileSync('src/js/carrier.js', 'utf8'), context);

var CarrierCutscene = context.window.firsttry.CarrierCutscene;
var state = new CarrierCutscene();
var shownLines = [];
var missionComplete = false;

state.phase = 'dialogue';
state.dialogueLines = ['ONE', 'TWO'];
state.dialogueIndex = 0;
state.dialogueText = {
	setText: function (text) { shownLines.push(text); }
};
state.showMissionComplete = function () { missionComplete = true; };

state.advanceDialogue();
state.advanceDialogue();
assert.deepStrictEqual(shownLines, ['ONE', 'TWO'], 'clicks must advance the general dialogue in order');
assert.strictEqual(missionComplete, false, 'mission completion must wait until dialogue is exhausted');
state.advanceDialogue();
assert.strictEqual(missionComplete, true, 'the final dialogue click must show mission completion');

var startedState = null;
state.phase = 'complete';
state.game = { state: { start: function (name) { startedState = name; } } };
state.onDown();
assert.strictEqual(startedState, 'menu', 'mission completion input must return to plane selection');

console.log('carrier cutscene regression test passed');
