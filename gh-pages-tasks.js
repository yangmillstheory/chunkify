import gulp from 'gulp';
import browserify from 'browserify';
import vinylSource from 'vinyl-source-stream';
import vinylBuffer from 'vinyl-buffer';
import gulpUglify from 'gulp-uglify';
import gulpBabel from 'gulp-babel';
import tsify from 'tsify';
import babelify from 'babelify';
import typescript from 'typescript';
import {serve} from './gh-pages/server';


const ghPagesBase = 'gh-pages';

let bundleStream = function() {
  return browserify()
    .add(`${ghPagesBase}/src/index.ts`)
    .plugin(tsify, {
      typescript,
      rootDir: undefined
    })
    .transform(babelify)
    .bundle()
    .pipe(vinylSource('bundle.js'))
    .pipe(vinylBuffer());
};

let initTasks = function() {
  gulp.task('bundle', function() {
    return bundleStream()
      .pipe(gulp.dest(ghPagesBase));
  });

  gulp.task('bundle:uglify', function() {
    return bundleStream()
      .pipe(gulpUglify())
      .pipe(gulp.dest(ghPagesBase));
  });

  gulp.task('serve', serve);

  gulp.task('gh-pages', gulp.series('build', 'compile', 'bundle'));
};

export default {initTasks};
