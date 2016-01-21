'use strict';
let gulp = require('gulp');
let karma = require('karma');
let tslint = require('gulp-tslint');
let ts = require('gulp-typescript');


/////////
// config

const TS_PROJECT = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
});

const TS = [
  'src/**/*.ts',
  '!src**/*.spec.ts'
];

const SPEC = ['src/**/*.spec.ts']; 


//////////
// compile

let compileStream = (globs) => {
  return gulp
    .src(globs)
    .pipe(ts(TS_PROJECT))
    .pipe(gulp.dest('dist'));
};

gulp.task('compile:ts', () => {
  return compileStream(TS);
});

gulp.task('compile:spec', () => {
  return compileStream(SPEC);
});

gulp.task('compile', gulp.parallel('compile:ts', 'compile:spec'))


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

let startKarmaServer = (options, done) => {
  options = Object.assign(options || {}, {
    configFile: 'karma.conf.unit.js',
    files: [
      'node_modules/mocha/index.js',
      'node_modules/chai/index.js',
      'node_modules/sinon/lib/sinon.js',
      'dist/**/*.js',
      'dist/**/*.spec.js',
    ]
  });
  new karma.Server(options, exitCode => {
    done();
    process.exit(exitCode);
  }).start();
};

gulp.task('test', done => {
  startKarmaServer({
    singleRun: true,
    autoWatch: false,
  }, done);
});

gulp.task('tdd', done => {
  startKarmaServer({
    singleRun: false,
    autoWatch: true,
  }, done);
});


/////////////////////////
// continuous development

gulp.task('watch', done => {
  gulp.watch(TS, gulp.series(
    'compile:ts', 
    'lint:ts'));
  gulp.watch(SPEC, gulp.series(
    'compile:spec', 
    'lint:spec'));
});

gulp.task('dev', gulp.parallel('tdd', 'watch'));
