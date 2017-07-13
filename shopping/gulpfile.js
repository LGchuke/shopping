'use strict';

let gulp        = require('gulp');
let browserSync = require('browser-sync').create();
let less        = require('gulp-less');
let sourcemaps  = require('gulp-sourcemaps');
let minify      = require('gulp-minify');
let del         = require('del');
let vinylPaths  = require('vinyl-paths');

// Static Server + watching less/html files
gulp.task('serve', ['less-dev'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("resource/stylesheet/*.less", ['less-dev']);
    gulp.watch("**/*.html").on('change', browserSync.reload);
});

// Compile less into CSS & auto-inject into browsers
gulp.task('less-dev', function() {
    return gulp.src("resource/stylesheet/*.less")
    	.pipe(sourcemaps.init())
        .pipe(less())
        .pipe(gulp.dest("resource/stylesheet"))
        .pipe(sourcemaps.write())
        .pipe(browserSync.stream());
});

// Compile less
gulp.task('less', function() {
    return gulp.src("resource/stylesheet/*.less")
    	.pipe(sourcemaps.init())
        .pipe(less())
        .pipe(gulp.dest("dist/resource/stylesheet"))
        .pipe(sourcemaps.write());
});

// Minify js
gulp.task('js', function() {
	return gulp.src("resource/javascript/*.js")
		.pipe(minify({
			ignoreFiles: ['-min.js']
		}))
		.pipe(gulp.dest('dist/resource/javascript'))
});

// Copy html
gulp.task('html', function() {
	return gulp.src(["**/*.html", "!dist", "!dist/**/*", "!node_modules", "!node_modules/**/*"])
		.pipe(gulp.dest('dist/'));
});

// Copy resource
gulp.task('resource', function() {
	return gulp.src(["resource/**/*", 
		"!resource/javascript", "!resource/javascript/**/*", 
		"!resource/stylesheet", "!resource/stylesheet/**/*"])
		.pipe(gulp.dest('dist/resource/'));
});

// Clean
gulp.task('clean', function() {
	return gulp.src('dist/*')
    	.pipe(vinylPaths(del));
});

gulp.task('build', ['less', 'js', 'html', 'resource']);

gulp.task('default', ['serve']);