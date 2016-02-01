'use strict';
import 'babel-polyfill';
import gulp from 'gulp';
import tslint from 'gulp-tslint';
import mocha from 'gulp-mocha';
import ts from 'gulp-typescript';
import babel from 'gulp-babel';
import {ghPagesTasks} from './gh-pages-tasks.js';


ghPagesTasks.init();


/////////
// config

const TYPINGS = [
  'typings/tsd.d.ts',
  'chunkify.d.ts'
]

const TS = [
  'src/**/*.ts',
  '!src/**/*.spec.ts'
];

const SPEC = ['src/**/*.spec.ts']; 

const TS_PROJECT = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
});

const DIST = 'dist';

//////////
// compile

gulp.task('compile:ts', function() {
  return gulp
    .src(TS.concat(TYPINGS))
    .pipe(ts(TS_PROJECT))
    .pipe(babel())
    .pipe(gulp.dest(DIST));
});

gulp.task('compile:spec', function() {
  return gulp
    .src(SPEC.concat(TYPINGS))
    // swallow compiler errors/warnings, since we abuse the API here
    .pipe(ts(TS_PROJECT, undefined, ts.reporter.nullReporter))
    .pipe(babel())
    .pipe(gulp.dest(DIST));
});

gulp.task('compile', gulp.series('compile:ts', 'compile:spec'));


///////
// lint

let lintStream = (globs, rules) {
  return gulp.src(globs)
    .pipe(tslint({
      configuration: {
        tslint: require('tslint'),
        rules: rules,
      } 
    }))
    .pipe(tslint.report('verbose', {
      summarizeFailureOutput: true,
      emitError: true
    }));
};

gulp.task('lint:ts', function(done) {
  return lintStream(TS);
});

gulp.task('lint:spec', function() {
  return lintStream(SPEC, {
    'no-empty': false
  });
});

gulp.task('lint', gulp.series('lint:ts', 'lint:spec'));


///////
// test

let testStream = function(testOptions) {
  return gulp
    .src('dist/**/*.js')
    .pipe(mocha(testOptions));
}

gulp.task('test', function() {
  return testStream();
});

gulp.task('tdd', function() {
  return testStream({reporter: 'min'});
});

/////////////////////////
// continuous development

gulp.task('dev', function(done) {
  gulp.watch(TS, gulp.series('compile:ts', 'tdd', 'lint:ts'));
  gulp.watch(SPEC, gulp.series('compile:spec', 'tdd', 'lint:spec'));
});

gulp.task('build', gulp.series('compile', 'test', 'lint'));
