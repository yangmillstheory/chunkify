'use strict';
import 'babel-polyfill';
import gulp from 'gulp';
import tslint from 'gulp-tslint';
import mocha from 'gulp-mocha';
import ts from 'gulp-typescript';
import babel from 'gulp-babel';


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

gulp.task('compile:ts', () => {
  return gulp
    .src(TS.concat(TYPINGS))
    .pipe(ts(TS_PROJECT))
    .pipe(babel())
    .pipe(gulp.dest(DIST));
});

gulp.task('compile:spec', () => {
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

let lintStream = (globs, rules) => {
  return gulp.src(globs)
    .pipe(tslint({
      configuration: {
        tslint: require('tslint'),
        rules: rules,
      } 
    }))
    .pipe(tslint.report('verbose', {
      summarizeFailureOutput: true,
      emitError: false
    }));
};

gulp.task('lint:ts', () => {
  return lintStream(TS);
});

gulp.task('lint:spec', () => {
  return lintStream(SPEC, {
    'no-empty': false
  });
});

gulp.task('lint', gulp.parallel('lint:ts', 'lint:spec'));


///////
// test

gulp.task('test', done => {
  return gulp
    .src('dist/**/*.js')
    .pipe(mocha({reporter: 'min'}));
});


/////////////////////////
// continuous development

gulp.task('dev', done => {
  gulp.watch(TS, gulp.series('compile:ts', 'test', 'lint:ts'));
  gulp.watch(SPEC, gulp.series('compile:spec', 'test', 'lint:spec'));
});

gulp.task('build', gulp.series('compile', 'test', 'lint'));
