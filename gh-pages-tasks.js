import gulp from 'gulp';
import browserify from 'browserify';
import vinylSource from 'vinyl-source-stream';
import vinylBuffer from 'vinyl-buffer';
import gulpUglify from 'gulp-uglify';
import tsify from 'tsify';
import babelify from 'babelify';
import watchify from 'watchify';
import ngAnnotate from 'gulp-ng-annotate';
import typescript from 'typescript';
import gulpUtil from 'gulp-util';
import {symlink} from 'fs';
import tsConfig from './tsconfig.json';


const ghPagesBase = 'gh-pages';


let initTasks = function(lintStream) {
  ///////
  // lint
  let lint = function() {
    return lintStream(`${ghPagesBase}/**/*.ts`, {
      align: false
    });
  };

  gulp.task('lint:gh-pages', lint);
  
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

  /////////////
  // browserify
  let startBundle = function() {
    return browserify({debug: true, cache: {}, packageCache: {}})
      .add([
        `${ghPagesBase}/app/index.ts`,
        `${ghPagesBase}/app/app.d.ts`,
        'chunkify.d.ts',
        'typings/tsd.d.ts',
      ])
      .plugin(tsify, {typescript, rootDir: undefined})
      .transform(babelify.configure({extensions: ['.ts']}));
  };

  let finishBundle = function(bundle, ...plugins) {
    return plugins.reduce(
      function(currentStream, plugin) {
        return currentStream.pipe(plugin());
      }, 
      bundle
        .pipe(vinylSource('bundle.js'))
        .pipe(vinylBuffer())
    )
    .pipe(gulp.dest(ghPagesBase));
  };

  let bundleDev = function() {
    let bundle = watchify(startBundle());
    bundle
      .on('log', function(message) {
        gulpUtil.log(message);
      })
      .on('update', function() {
        lint();
        finishBundle(bundle.bundle());
      });
    return bundle;
  };

  let doBundle = function() {
    return finishBundle(startBundle().bundle());
  };

  gulp.task('bundle', function() {
    return doBundle();
  });

  gulp.task('bundle:prod', function() {
    return finishBundle(startBundle(), ngAnnotate, gulpUglify);
  });

  gulp.task('bundle:dev', function(done) {
    finishBundle(bundleDev().bundle());
    done();
  });

  gulp.task('gh-pages', gulp.series('symlink', 'lint:gh-pages', 'bundle'));
  gulp.task('gh-pages:dev', gulp.series('symlink', 'lint:gh-pages', 'bundle:dev'));
  gulp.task('gh-pages:prod', gulp.series('symlink', 'lint:gh-pages', 'bundle:prod'));
};

export default {initTasks};
