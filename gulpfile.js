var gulp = require('gulp');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

var config = {
		app: './app/',
		index: './app/index.html',
	    jsPaths: [
	    	'./app/app.js',
	    	'./app/view1/*.js',
	    	'./app/view2/*.js',
	    	'!./app/*/*_test.js',
	    	'./app/components/version/*.js',
	    	'!./app/components/version/*_test.js',
	    ],
	    injectOptions: {
		     addRootSlash: false,
		     ignorePath: 'app/'
		},
		wiredepOptions: {
			directory: './app/bower_components'
		}
};
 
 
gulp.task('index', function () {
  var target = gulp.src(config.index);
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(config.jsPaths, {read: false});

  return target.pipe(inject(sources, config.injectOptions))
    .pipe(gulp.dest(config.app));
});


gulp.task('bower', function () {
  var target = gulp.src(config.index);
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(config.jsPaths, {read: false});
 
  return target.pipe(wiredep(config.wiredepOptions))
    .pipe(gulp.dest(config.app));
});

