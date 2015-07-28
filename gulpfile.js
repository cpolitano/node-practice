'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    del = require('del');


// Creates a readable stream of data in memory
gulp.task('concatScripts', function() {
  return gulp.src(['src/assets/js/**'])
  .pipe(concat('app.js')) // concats readable stream to one file
  .pipe(gulp.dest('dist/assets/js')); // persists file to destination
});

// Convert ES6/2015 to browser-compatible JS
gulp.task('babelScripts', ['concatScripts'], function() {
  return gulp.src('dist/assets/js/app.js')
  .pipe(babel())
  .pipe(gulp.dest('dist/assets/js'));
});

// babelScripts is a dependency of minifyScripts
// Concat, babel & minify js and save to dist
gulp.task('minifyScripts', ['babelScripts'], function() {
  gulp.src('dist/assets/js/app.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/assets/js'));
});

// Compile Sass files and save to dist
gulp.task('compileSass', function() {
  gulp.src('src/assets/sass/app.scss')
  .pipe(sass())
  .pipe(gulp.dest('dist/assets/css'));
});

// Sets ups a watch task for any changes to css or js
gulp.task('watch', function() {
  gulp.watch(['src/assets/sass/**/*.scss'], ['compileSass']);
  gulp.watch(['src/assets/js/**/*.js'], ['concatScripts']);
});

gulp.task('clean', function() {
  del('dist');
});

// Saves everything to dist
// Base preserves directory structure
gulp.task('build', ['minifyScripts', 'compileSass'], function() {
  // return gulp.src(['html','img/**','fonts/**','etc'], { base: './' }).pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watch']);

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

