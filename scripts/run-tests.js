'use strict';

var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;
var testDirectory = path.join(__dirname, '..', 'test');
var testFiles = fs.readdirSync(testDirectory)
	.filter(function(file) {
		return /-test\.js$/.test(file);
	})
	.sort();
var failures = [];

if (testFiles.length === 0) {
	console.error('No test files found in ' + testDirectory);
	process.exit(1);
}

testFiles.forEach(function(file) {
	console.log('\nRunning ' + file);
	var result = spawnSync(process.execPath, [path.join(testDirectory, file)], {
		stdio: 'inherit'
	});

	if (result.error) {
		failures.push(file + ' (' + result.error.message + ')');
		return;
	}

	if (result.status !== 0) {
		failures.push(file + ' (exit code ' + (result.status || 1) + ')');
	}
});

if (failures.length > 0) {
	console.error('\n' + failures.length + ' test file(s) failed:');
	failures.forEach(function(failure) {
		console.error('  - ' + failure);
	});
	process.exit(1);
}

console.log('\nAll ' + testFiles.length + ' test files passed.');
