'use strict';

let gulp = require('gulp');
let autoprefixer = require('autoprefixer');
let postcss = require('gulp-postcss');
let cssimport = require('postcss-import');
let cssimporturl = require('postcss-import');
let nested = require('postcss-nested');

gulp.task('css', () => {
  gulp.src('css/index.css')
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 4 versions'],
        remove: false
      }),
      cssimport(),
      cssimporturl,
      nested
    ]))
    .pipe(gulp.dest('css/dist'));
});
