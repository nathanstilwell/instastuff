//
// https://github.com/gulpjs/gulp/blob/ed913ac2b4ae531e6fbf8fed8d2f291b473c7fe0/docs/recipes/fast-browserify-builds-with-watchify.md
// Multiple Bundles: http://fettblog.eu/gulp-browserify-multiple-bundles/
//

'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var browserify = require('browserify');
var handlebars = require('browserify-handlebars');
var glob = require('glob');
var es = require('event-stream');

gulp.task('javascript', function () {
  return glob('./public/js/index.js', function (err, files) {
    // map files to stream function
    var tasks = files.map(function (entry) {
      return browserify({
          entries: [entry],
          debug: true,
          transform: [handlebars]
        })
        .bundle()
        .pipe(source(entry))
        .pipe(rename({
          dirname: './',
          extname: '.bundle.js'
        }))
        .pipe(gulp.dest('./public/js/dist'));
    });

    // create a merged stream
    return es.merge(tasks);
  }); // glob
});
