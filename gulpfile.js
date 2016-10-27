var gulp = require('gulp'),
	del = require('del'),
	fs = require("fs"),
	rucksack = require('gulp-rucksack'), //PostCSS CSS super powers library: http://simplaio.github.io/rucksack/docs/
	rename = require('gulp-rename'),
	sourcemaps   = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create(),

	sass = require('gulp-sass'),
	bulkSass = require('gulp-sass-bulk-import'),
	postcss      = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cleanCSS = require('gulp-clean-css'),

	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber');


/**
 * Live browser previews
 */
gulp.task('browserSync', ['make-css'], function() {
	browserSync.init({
		open: 'external',
		host: 'boilerplate.dev', // this can be anything at .dev, or localhost, or...
		proxy: "boilerplate.dev", // this needs to be your project (localhost, .dev, vagrant domain et al)
		watchTask: true
	})
});


/**
 * Compile sass, allowing for wildcard @imports. Then run autoprefixer on the output
 * so that we don't have to manually write browser prefixes
 * Use sourcemaps so that we know where things have come from when using these files
 * Minify CSS using cleanCSS, and output to an style.css file.
 */
gulp.task('make-css', function() {
	return gulp.src('src/scss/style.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(sass()) // Using gulp-sass
		.pipe(cleanCSS({compatibility: 'ie9'}))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(rucksack({
			alias: false
		}))
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('dist/css/'))
});

gulp.task('watch', ['make-css', 'browserSync'], function () {
	gulp.watch('src/scss/**/*.scss', ['make-css', browserSync.reload]); //watch sass in project sass folder, run tasks
});

gulp.task('default', ['watch']);
