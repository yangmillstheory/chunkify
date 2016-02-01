'use strict';
import 'babel-polyfill';
import gulp from 'gulp';
import tslint from 'gulp-tslint';
import mocha from 'gulp-mocha';
import ts from 'gulp-typescript';
import babel from 'gulp-babel';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';


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
      emitError: true
    }));
};

gulp.task('lint:ts', done => {
  return lintStream(TS);
});

gulp.task('lint:spec', () => {
  return lintStream(SPEC, {
    'no-empty': false
  });
});

gulp.task('lint', gulp.series('lint:ts', 'lint:spec'));


///////
// test

let testStream = testOptions => {
  return gulp
    .src('dist/**/*.js')
    .pipe(mocha(testOptions));
}

gulp.task('test', () => {
  return testStream();
});

gulp.task('tdd', () => {
  return testStream({reporter: 'min'});
});

/////////////////////////
// continuous development

gulp.task('dev', done => {
  gulp.watch(TS, gulp.series('compile:ts', 'tdd', 'lint:ts'));
  gulp.watch(SPEC, gulp.series('compile:spec', 'tdd', 'lint:spec'));
});

gulp.task('build', gulp.series('compile', 'test', 'lint'));

/////////////////////
// build for gh-pages

const SITE = {
  base: 'site',

  js: function() {
    return `${this.base}/js`
  },

  src: function() {
    return `${this.base}/src`
  }
};


gulp.task('site', () => {
  return gulp
    .src(`${SITE.src()}/index.js`)
    .pipe(babel())
    .pipe(gulp.dest(`${SITE.js()}`));
});

gulp.task('bundle', () => {
  return browserify({entries: `${SITE.js()}/index.js`, debug: false})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(`${SITE.base}`));
});


gulp.task('bundle:uglify', () => {
  return gulp.src(`${SITE.base}/bundle.js`)
    .pipe(uglify())
    .pipe(gulp.dest(`${SITE.base}`));
});


gulp.task('default', gulp.series('build'));
gulp.task('gh-pages', gulp.series('build', 'site', 'bundle'));
