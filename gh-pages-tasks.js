import gulp from 'gulp';
import browserify from 'browserify';
import vinylSource from 'vinyl-source-stream';
import vinylBuffer from 'vinyl-buffer';
import gulpUglify from 'gulp-uglify';
import gulpBabel from 'gulp-babel';
import tsify from 'tsify';
import babelify from 'babelify';
import ngAnnotate from 'gulp-ng-annotate';
import typescript from 'typescript';
import gulpUtil from 'gulp-util';
import {symlink} from 'fs';
import tsConfig from './tsconfig.json';


const ghPagesBase = 'gh-pages';

let bundleStream = function() {
  return browserify()
    .add([
      `${ghPagesBase}/app/index.ts`,
      'chunkify.d.ts',
      'lib.d.ts',
      'typings/tsd.d.ts',
    ])
    .plugin(tsify, {
      typescript,
      rootDir: ghPagesBase,
      exclude: undefined
    })
    .transform(babelify.configure({extensions: ['.ts']}))
    .bundle()
    .pipe(vinylSource('bundle.js'))
    .pipe(vinylBuffer())
    .pipe(ngAnnotate());
};

let initTasks = function(lintStream) {
  gulp.task('symlink', function(done) {
    let target = 'node_modules/chunkify';
    let source = `../${tsConfig.compilerOptions.outDir}`;
    symlink(source, target, function(error) {
      if (error) {
        gulpUtil.log(`${target} already linked to ${source}.`);
      }
      done();
    });
  });

  gulp.task('bundle', function() {
    return bundleStream()
      .pipe(gulp.dest(ghPagesBase));
  });

  gulp.task('bundle:uglify', function() {
    return bundleStream()
      .pipe(gulpUglify())
      .pipe(gulp.dest(ghPagesBase));
  });

  gulp.task('lint:gh-pages', function() {
    return lintStream(`${ghPagesBase}/**/*.ts`, {
      align: false
    });
  });

  gulp.task('gh-pages', gulp.series('symlink', 'lint:gh-pages', 'bundle'));
  gulp.task('gh-pages:prod', gulp.series('symlink', 'lint:gh-pages', 'bundle:uglify'));
};

export default {initTasks};
