'use strict';

var gulp = require('gulp');

gulp.task('watch', function watchTask () {
  gulp.watch(['css/**/*.css'], ['css']);
  gulp.watch(['templates/**/*.hbs'], ['javascript']);
  gulp.watch(['assets/javascript/**/*.js'], ['javascript']);
});
