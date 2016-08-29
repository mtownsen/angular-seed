var gulp = require('gulp');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');


var config = {
		app: './app/',
		index: './app/index.html',
		jsMain: 'main.js',
	    jsPaths: [
			'./app/app.js',
			'./app/components/*/*.js',
			'!./app/components/*/*_test.js',
	    ],
	    cssMain: [
	    	'./app/app.css',
	    ],
	    cssPaths: [
	    	'./app/app.css',
	    ],
	    sassPaths: [
	    	'./app/styles/app.scss',
	    	'./app/components/*/*.scss'
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
    gulp.watch(config.jsPaths).on('change', function(){
    	gulp.start('scripts');
    });
    gulp.watch(config.cssPaths).on('change', browserSync.reload);
  	gulp.watch(config.viewPaths).on('change', browserSync.reload);
    gulp.watch(config.index).on('change', browserSync.reload);
});

gulp.task('scripts', function (cb) {
  pump([
      gulp.src(config.jsPaths),
      ngAnnotate(),
      concat(config.jsMain),
      uglify(),
      gulp.dest(config.app)
    ],
    cb
  );
});

gulp.task('sass', function (cb) {
  pump([
      gulp.src(config.sassPaths),
      sourcemaps.init(),
      sass({outputStyle: 'compressed'}).on('error', sass.logError),
      sourcemaps.write(),
      gulp.dest(config.app)
    ],
    cb
  );
});

gulp.task('bower', function (cb) {
  pump([
  		gulp.src(config.index),
      wiredep(config.bowerDir),
      gulp.dest(config.app)
    ],
    cb
  );
});
