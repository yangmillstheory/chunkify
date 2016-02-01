import gulp from 'gulp';
import browserify from 'browserify';
import vinylSource from 'vinyl-source-stream';
import vinylBuffer from 'vinyl-buffer';
import gulpUglify from 'gulp-uglify';
import gulpBabel from 'gulp-babel';


const ghPages = {
  base: 'site',

  js: function() {
    return `${this.base}/js`
  },

  src: function() {
    return `${this.base}/src`
  }
};

export function init() {
  gulp.task('site', function() {
    return gulp
      .src(`${ghPages.src()}/index.js`)
      .pipe(gulpBabel())
      .pipe(gulp.dest(`${ghPages.js()}`));
  });

  gulp.task('bundle', function() {
    return browserify({entries: `${ghPages.js()}/index.js`, debug: false})
      .bundle()
      .pipe(vinylSource('bundle.js'))
      .pipe(vinylBuffer())
      .pipe(gulp.dest(`${ghPages.base}`));
  });

  gulp.task('bundle:uglify', function() {
    return gulp
      .src(`${ghPages.base}/bundle.js`)
      .pipe(gulpUglify())
      .pipe(gulp.dest(`${ghPages.base}`));
  });

  gulp.task('gh-pages', gulp.series('build', 'site', 'bundle'));
});
