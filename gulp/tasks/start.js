'use strict';

var gulp = require('gulp');
var gulpNodemon = require('gulp-nodemon');

gulp.task('start:deps', ['javascript']);

gulp.task('start', ['start:deps'], function () {
  gulpNodemon({
    script: 'server.js',
    watch: [
      'public/templates/',
      'server.js'
    ],
    ext: 'hbs js',
    env: { 'NODE_ENV': 'development' }
  });
}); // start
