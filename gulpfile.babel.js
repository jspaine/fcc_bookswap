import gulp from 'gulp'
import uglify from 'gulp-uglify'
import webpack from 'webpack'
import nodemon from 'gulp-nodemon'

import webpackConfig from './webpack.config'

let webpackDevServer
if (process.env.NODE_ENV !== 'production') {
  webpackDevServer = require('webpack-dev-server')
}

gulp.task('build-client', (done) => {
  webpack(webpackConfig).run((err, stats) => {
    if (err) console.error(err)
    else console.log(stats.toString())
    done()
  })
})

gulp.task('watch-server', () => {
  nodemon({
    watch: 'server/**/*.js',
    exec: "node ./server/index.js"
  })
})

gulp.task('watch-client', ['watch-server'], () => {
  const compiler = webpack(webpackConfig)
  new webpackDevServer(compiler, webpackConfig.devServer)
    .listen(webpackConfig.devServer.port)
})

gulp.task('compress', ['build-client'], () => {
  return gulp.src('public/*.js')
    .pipe(uglify({
      compress: {warnings: false}
    }))
    .pipe(gulp.dest('public', {
      overwrite: true
    }))
})

gulp.task('build', ['build-client', 'compress'])

gulp.task('watch', ['watch-server', 'watch-client'])
