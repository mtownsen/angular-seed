var gulp = require('gulp');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync').create();
var ngAnnotate = require('gulp-ng-annotate');

var concat = require('gulp-concat');

var config = {
		app: './app/',
		index: './app/index.html',
		jsMain: 'main.js',
	    jsPaths: [
			'./app/app.js',
			'./app/components/*/*.js',
			'!./app/components/*/*_test.js',
	    ],
	    cssPaths: [
	    	'./app/app.css',
	    ],
	    viewPaths: [
	    	'./app/components/*/*.html',
	    ],
	    injectOptions: {
		     addRootSlash: false,
		     ignorePath: 'app/'
		},
		bowerDir: {
			directory: './app/bower_components'
		},
		browserPort: 4000
};

// Static server
gulp.task('default', function() {
    browserSync.init({
	    server: config.app,
	    port: 	config.browserPort
    });

    // Watch for changes to main files and reload browser.
  	gulp.watch(config.app + config.jsMain).on('change', browserSync.reload);
    gulp.watch(config.cssPaths).on('change', browserSync.reload);
  	gulp.watch(config.viewPaths).on('change', browserSync.reload);
    gulp.watch(config.index).on('change', browserSync.reload);
});

gulp.task('scripts', function() {
	gulp.src(config.jsPaths)
		.pipe(ngAnnotate())
		.pipe(concat(config.jsMain))
		.pipe(gulp.dest(config.app));

   	return gulp.src(config.index)
   				.pipe(inject(gulp.src(config.app + config.jsMain, {read: false}), config.injectOptions))
   				.pipe(gulp.dest(config.app));
});

gulp.task('styles', function () {
  var target = gulp.src(config.index);
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(config.cssPaths, {read: false});

  return target.pipe(inject(sources, config.injectOptions))
    .pipe(gulp.dest(config.app));
}); 

gulp.task('bower', function () {
  var target = gulp.src(config.index);
  return target.pipe(wiredep(config.bowerDir))
    .pipe(gulp.dest(config.app));
});
