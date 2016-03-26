'use strict';
import 'babel-polyfill';
import gulp from 'gulp';
import gulpTslint from 'gulp-tslint';
import gulpMocha from 'gulp-mocha';
import gulpTs from 'gulp-typescript';
import gulpBabel from 'gulp-babel';
import typescript from 'typescript';
import tslint from 'tslint';


const typings = [
  'typings/tsd.d.ts',
  'chunkify.d.ts'
]

const tsProject = gulpTs.createProject('tsconfig.json', {typescript});

const tsFiles = [
  `${tsProject.config.compilerOptions.rootDir}/**/*.ts`,
  '!**/*.spec.ts'
].concat(typings);

const specFiles = [
  `${tsProject.config.compilerOptions.rootDir}/**/*.spec.ts`,
].concat(typings); 

const outDir = tsProject.config.compilerOptions.outDir;

//////////
// compile

gulp.task('compile:ts', function() {
  return gulp
    .src(tsFiles)
    .pipe(gulpTs(tsProject))
    .pipe(gulpBabel())
    .pipe(gulp.dest(outDir));
});

gulp.task('compile:spec', function() {
  return gulp
    .src(specFiles.concat(typings))
    // swallow compiler errors/warnings, since we abuse the API here
    .pipe(gulpTs(tsProject, undefined, gulpTs.reporter.nullReporter))
    .pipe(gulpBabel())
    .pipe(gulp.dest(outDir));
});

gulp.task('compile', gulp.series('compile:ts', 'compile:spec'));


///////
// lint

let lintStream = function(globs, rules) {
  return gulp.src(globs)
    .pipe(gulpTslint({configuration: {rules}, tslint}))
    .pipe(gulpTslint.report('verbose', {
      summarizeFailureOutput: true,
      emitError: true
    }));
};

gulp.task('lint:ts', function(done) {
  return lintStream(tsFiles);
});

gulp.task('lint:spec', function() {
  return lintStream(specFiles, {'no-empty': false, typedef: false});
});

gulp.task('lint', gulp.series('lint:ts', 'lint:spec'));


///////
// test

let testStream = function(testOptions) {
  return gulp
    .src('dist/**/*.js')
    .pipe(gulpMocha(testOptions));
}

gulp.task('test', function() {
  return testStream();
});

gulp.task('tdd', function() {
  return testStream({reporter: 'min'});
});


/////////////////////////
// continuous development

gulp.task('dev', function() {
  gulp.watch(tsFiles, gulp.series(
    'compile:ts',
    'tdd',
    'lint:ts'
  ));
  gulp.watch(specFiles, gulp.series(
    'compile:spec',
    'tdd',
    'lint:spec'
  ));
});

gulp.task('build', gulp.series('compile', 'test', 'lint'));
