'use strict';
let gulp = require('gulp');
let tslint = require('gulp-tslint');
let mocha = require('gulp-mocha');
let ts = require('gulp-typescript');
let babel = require('gulp-babel');


/////////
// config

const TYPINGS = [
  'typings/tsd.d.ts',
  'chunkify.d.ts'
]

const TS = [
  'src/**/*.ts',
  '!src**/*.spec.ts'
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
    .pipe(ts(TS_PROJECT))
    // swallow compiler errors/warnings, since we abuse the API here
    .pipe(ts(TS_PROJECT, undefined, ts.reporter.nullReporter))
    .pipe(babel())
    .pipe(gulp.dest(DIST));
});

gulp.task('compile', gulp.parallel('compile:ts', 'compile:spec'));


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
  return lintStream(SPEC);
});

gulp.task('lint', gulp.parallel('lint:ts', 'lint:spec'));


///////
// test

gulp.task('test', done => {
  return gulp
    .src([
      'dist/**/*.js'
    ])
    .pipe(mocha({reporter: 'dot'}));
});


/////////////////////////
// continuous development

gulp.task('dev', done => {
  gulp.watch(TS, gulp.series('compile:ts', 'lint:ts', 'test'));
  gulp.watch(SPEC, gulp.series('compile:spec', 'lint:spec', 'test'));
});
