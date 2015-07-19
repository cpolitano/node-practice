'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass');


// Creates a readable stream of data in memory
gulp.task('concatScripts', function() {
  return gulp.src([
    'src/assets/js/nav.js',
    'src/assets/js/form.js'])
  .pipe(concat('app.js')) // concats readable stream to one file
  .pipe(gulp.dest('dist/assets/js')); // persists file to destination
});

gulp.task('minifyScripts', ['concatScripts'], function() {
  gulp.src('dist/assets/js/app.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('compileSass', function() {
  gulp.src('src/assets/sass/app.scss')
  .pipe(sass())
  .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('watchSass', function() {
  gulp.watch(['src/assets/sass/*.scss'], ['compileSass']);

});

gulp.task('build', ['minifyScripts', 'compileSass'], function() {
  console.log('build task');
});

gulp.task('default', ['concatScripts', 'minifyScripts', 'compileSass'], function() {
  console.log('default task');
});