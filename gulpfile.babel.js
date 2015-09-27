import gulp from 'gulp';
import babel from 'gulp-babel';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';


let [SRC, DST] = ['src', 'dist'];

gulp.task('build', () => {
  return gulp.src([
    `${SRC}/**/*.js`,
    `!${SRC}/**/*.spec.js`,
    `!${SRC}/**/testutils.js`
  ])
  .pipe(babel())
  .pipe(gulp.dest(DST))
});


gulp.task('bundle', () => {
  browserify({entries: `${DST}/index.js`, debug: true})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('.'));
});


gulp.task('default', gulp.series('build'));
gulp.task('gh-pages', gulp.series('build', 'bundle'));