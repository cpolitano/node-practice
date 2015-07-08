'use strict';

var gulp = require('gulp');

gulp.task('hello', function(){
  console.log('hello gulp!');
});

gulp.task('default', ['hello'], function(){
  console.log('default task');
});