'use strict';

var gulp = require('gulp');

gulp.task('watch', function watchTask () {
  gulp.watch(['public/css/**/*.css'], ['css']);
  gulp.watch(['public/templates/**/*.hbs'], ['javascript']);
  gulp.watch(['assets/javascript/**/*.js'], ['javascript']);
});
