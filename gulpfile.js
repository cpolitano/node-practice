'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat');


// Creates a readable stream of data in memory
gulp.task('concatScripts', function(){
  gulp.src([
    'src/assets/js/nav.js',
    'src/assets/js/form.js'])
  .pipe(concat('app.js')) // concats readable stream to one file
  .pipe(gulp.dest('dist/assets/js')); // persists file to destination
});

gulp.task('default', ['concatScripts'], function(){
  console.log('default task');
});