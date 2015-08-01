import gulp from 'gulp'
import babel from 'gulp-babel'
import del from 'del'

gulp.task('clean', (cb) => {
  del([ './lib' ], cb)
})

gulp.task('build', [ 'clean' ], () => {
  return gulp.src([ './src/*.js' ])
    .pipe(babel())
    .pipe(gulp.dest('./lib'))
})

gulp.task('default', [ 'build' ])
