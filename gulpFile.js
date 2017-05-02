'use strict';

const gulp = require('gulp');

require('./gulp/jobs/generateJS');

gulp.task('build', ['gen:js']);
