var gulp = require('gulp')
	, gutil = require('gulp-util')
	, clean = require('gulp-clean')
	, concat = require('gulp-concat')
	, sourcemaps = require('gulp-sourcemaps')
	, rename = require('gulp-rename')
	, minifyhtml = require('gulp-minify-html')
	, processhtml = require('gulp-processhtml')
	, jshint = require('gulp-jshint')
	, uglify = require('gulp-uglify')
	, connect = require('gulp-connect')
	, paths;

paths = {
	assets: 'src/assets/**/*',
	css:    'src/css/*.css', 
	libs:   [
		'src/bower_components/phaser-official/build/phaser.min.js'
	],
	js:     ['src/js/**/*.js'],
	dist:   './dist/'
};

function cleanTask() {
	var stream = gulp.src(paths.dist, {read: false, allowEmpty: true})
		.pipe(clean({force: true}))
		.on('error', gutil.log);
	return stream;
}

function copyTask() {
	// gulp 5 (vinyl-fs 4) decodes files as UTF-8 by default, which corrupts
	// binary assets (PNG/audio). encoding:false keeps them as raw buffers.
	return gulp.src(paths.assets, {encoding: false})
		.pipe(gulp.dest(paths.dist + 'assets', {encoding: false}))
		.on('error', gutil.log);
}

function uglifyTask() {
	// var srcs = [paths.libs[0], paths.js[0]];
	var srcs = [paths.libs[0],
		'src/js/boot.js',
		'src/js/preloader.js',
		'src/js/menu.js',

		'src/js/class/spriter.js',
		'src/js/class/actor.js',
		'src/js/class/mob.js',
		'src/js/class/shoot.js',
		'src/js/class/enemy.js',
		'src/js/class/flying_mobs.js',
		'src/js/class/turret.js',
		'src/js/class/player.js',
		'src/js/class/bullet.js',
		'src/js/class/collectible.js',
		'src/js/class/cloud.js',

		'src/js/ground.js',
		'src/js/game.js',
		'src/js/main.js'
	 ];

	return gulp.src(srcs)
		.pipe(sourcemaps.init())
		.pipe(concat('main.min.js'))
		.pipe(sourcemaps.write())
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist))
		.on('error', gutil.log);
}

function minifycssTask() {
	return gulp.src(paths.css)
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.dist))
		.on('error', gutil.log);
}

function processhtmlTask() {
	return gulp.src('src/index.html')
		.pipe(processhtml())
		.pipe(gulp.dest(paths.dist))
		.on('error', gutil.log);
}

function minifyhtmlTask() {
	return gulp.src('dist/index.html')
		.pipe(minifyhtml())
		.pipe(gulp.dest(paths.dist))
		.on('error', gutil.log);
}

function lintTask() {
	return gulp.src(paths.js)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.on('error', gutil.log);
}

function htmlTask() {
	return gulp.src('src/*.html')
		.pipe(connect.reload())
		.on('error', gutil.log);
}

function connectTask(done) {
	connect.server({
		root: [__dirname + '/src'],
		port: 9000,
		livereload: true
	});
	done();
}

function watchTask() {
	gulp.watch(paths.js, lintTask);
	gulp.watch(['./src/index.html', paths.css, paths.js], htmlTask);
}

gulp.task('clean', cleanTask);
gulp.task('copy', gulp.series(cleanTask, copyTask));
gulp.task('lint', lintTask);
gulp.task('uglify', gulp.series(cleanTask, lintTask, uglifyTask));
gulp.task('minifycss', gulp.series(cleanTask, minifycssTask));
gulp.task('processhtml', gulp.series(cleanTask, processhtmlTask));
gulp.task('minifyhtml', gulp.series(cleanTask, minifyhtmlTask));
gulp.task('html', htmlTask);
gulp.task('connect', connectTask);
gulp.task('watch', watchTask);

gulp.task('default', gulp.parallel(connectTask, watchTask));
gulp.task('build', gulp.series(
	cleanTask,
	gulp.parallel(copyTask, gulp.series(lintTask, uglifyTask), minifycssTask, processhtmlTask),
	minifyhtmlTask
));
