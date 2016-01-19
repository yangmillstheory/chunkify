let gulp = require('gulp');
let ts = require('gulp-typescript');


const TS_PROJECT = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
});

gulp.task('build', () => {
  
  return gulp.src(
    [
      `src/**/*.js`,
      `!src/**/*.spec.js`,
      `!src/**/test-utility.js`
    ]
  )
  .pipe(ts(TS_PROJECT))
  .pipe(gulp.dest('dist'));
});


gulp.task('default', gulp.series('build'));
