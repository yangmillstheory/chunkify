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


const SITE = {
  base: 'site',

  js: function() {
    return `${this.base}/js`
  },

  src: function() {
    return `${this.base}/src`
  }
};


gulp.task('site', (done) => {
  gulp
    .src(`${SITE.src()}/index.js`)
    .pipe(babel())
    .pipe(gulp.dest(`${SITE.js()}`));
  done()
});

gulp.task('bundle', () => {
  browserify({entries: `${SITE.js()}/index.js`, debug: true})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(`${SITE.base}`));
});


gulp.task('default', gulp.series('build'));
gulp.task('gh-pages', gulp.series('build', 'site', 'bundle'));