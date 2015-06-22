var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
var include = require('gulp-include');

var paths = {
  scripts: ['src/js/*.js'],
  main: ['src/js/backbone-bootstrap3-dialog.js']
};

gulp.task('scripts', function() {
  return gulp.src(paths.main)
    .pipe(include())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts-min', function() {
  return gulp.src(paths.main)
    .pipe(include())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts-cmd', function() {
  return gulp.src(paths.main)
    .pipe(include())
    .pipe(wrap('define(function(require, exports, module) {<%=contents%>});'))
    .pipe(rename({suffix: '.cmd'}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts-cmd-min', function() {
  return gulp.src(paths.main)
    .pipe(include())
    .pipe(wrap('define(function(require, exports, module) {<%=contents%>});'))
    .pipe(uglify())
    .pipe(rename({suffix: '.cmd.min'}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts-min-docs', function() {
  return gulp.src(paths.main)
    .pipe(include())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('docs/lib/'));
});

gulp.task('scripts-cmd-docs', function() {
  return gulp.src(paths.main)
    .pipe(include())
    .pipe(wrap('define(function(require, exports, module) {<%=contents%>});'))
    .pipe(uglify())
    .pipe(rename({suffix: '.cmd.min'}))
    .pipe(gulp.dest('docs/lib/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts', 'scripts-min', 'scripts-cmd', 'scripts-cmd-min', 'scripts-min-docs', 'scripts-cmd-docs']);
});

gulp.task('default', ['watch', 'scripts', 'scripts-min', 'scripts-cmd', 'scripts-cmd-min', 'scripts-min-docs', 'scripts-cmd-docs']);