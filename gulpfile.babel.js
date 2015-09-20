import gulp from 'gulp';
import babel from 'gulp-babel';


let [SRC, DST] = ['src', 'dist'];

gulp.task('build', () => {
  return gulp.src([
    `${SRC}/**/*.js`,
    `!${SRC}/**/*.spec.js`
  ])
  .pipe(babel())
  .pipe(gulp.dest(DST))
});


gulp.task('default', gulp.series('build'));