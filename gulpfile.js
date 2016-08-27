var gulp = require('gulp');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

var config = {
		app: './app/',
		index: './app/index.html',
	    jsPaths: [
			'./app/app.js',
			'./app/components/*/*.js',
			'!./app/components/*/*_test.js',
	    ],
	    cssPaths: [
	    	'./app/app.css',
	    ],
	    injectOptions: {
		     addRootSlash: false,
		     ignorePath: 'app/'
		},
		bowerDir: {
			directory: './app/bower_components'
		}
};
 

gulp.task('styles', function () {
  var target = gulp.src(config.index);
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(config.cssPaths, {read: false});

  return target.pipe(inject(sources, config.injectOptions))
    .pipe(gulp.dest(config.app));
}); 
 
gulp.task('scripts', function () {
  var target = gulp.src(config.index);
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(config.jsPaths, {read: false});

  return target.pipe(inject(sources, config.injectOptions))
    .pipe(gulp.dest(config.app));
});


gulp.task('bower', function () {
  var target = gulp.src(config.index);
  return target.pipe(wiredep(config.bowerDir))
    .pipe(gulp.dest(config.app));
});
