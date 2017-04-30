var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    customMedia = require('postcss-custom-media'),
    objectFitImages = require('postcss-object-fit-images'),
    autoprefixer = require('autoprefixer'),
    minifycss = require('gulp-minify-css'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    imagemin = require('gulp-imagemin'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

var sassPaths = [
  './node_modules'
];

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('styles', function(){
  gulp.src(['src/scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        notify().write(error);
        this.emit('end');
    }}))
    .pipe(sass({
      includePaths: sassPaths
    }))
    .pipe(postcss([autoprefixer({ browsers: ['last 2 versions', 'Explorer >= 8', 'iOS >= 6', 'Safari >= 6'] }), customMedia(), objectFitImages()]))
    .pipe(gulp.dest('dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('scripts', function() {
  return browserify({
    entries: ["src/js/index.js"]
  })
  .on('error', function (error) {
    console.log(error.toString());
    notify().write(error);
    this.emit('end');
  })
  .transform(babelify, {presets: ['es2015']})
  .bundle()
  .pipe(source("bundle.js"))
  .pipe(gulp.dest('dist/js'))
  .pipe(buffer())
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
});

gulp.task('lint', function() {
  return gulp.src([
    'src/js/**/*.js'
  ])
  .pipe(eslint({
    configFile: '.eslintrc.json'
  }))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .on("error", notify.onError(eslint.format()))
});

gulp.task('build-js', ['scripts', 'lint']);

gulp.task('images', function() {
  gulp.src(['src/images/**/*'])
      .pipe(imagemin())
      .pipe(gulp.dest('dist/images'))
});

gulp.task('default', ['styles', 'build-js', 'images'], function(){
  gulp.watch("src/scss/**/*.scss", ['styles']);
  gulp.watch("src/js/**/*.js", ['build-js']);
  gulp.watch("src/images/**/*", ['images']);
});
