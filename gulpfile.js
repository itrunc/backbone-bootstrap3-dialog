var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');

var paths = {
  scripts: ['src/js/*.js']
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    //.pipe(sourcemaps.init())
    .pipe(uglify())
    //.pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts-cmd', function() {
  return gulp.src(paths.scripts)
    .pipe(wrap('define(function(require, exports, module) {<%=contents%>});'))
    .pipe(uglify())
    .pipe(rename({suffix: '.cmd.min'}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts', 'scripts-cmd']);
});

gulp.task('default', ['watch', 'scripts', 'scripts-cmd']);