'use strict';

const gulp           = require('gulp');
const gutil          = require('gulp-util');
const webpack        = require('webpack');
const webpackConfig  = require('./webpack.config.js');
const del            = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const critical       = require('critical').stream;
const runSequence    = require('run-sequence');
const nodemon        = require('gulp-nodemon');

gulp.task('webpack', (done) => {
  const myConfig = Object.create(webpackConfig);
  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString());
    done();
  });
});

gulp.task('nunjucks', () => {
  nunjucksRender.nunjucks.configure(['./client/src/templates/'], { watch: false });
  return gulp.src(['./client/src/templates/**/*.html', '!**/_*'])
    .pipe(nunjucksRender())
    .pipe(gulp.dest('./public/'));
});

gulp.task('extras', () => {
  return gulp.src('./client/src/**/*.{txt,json,xml,jpeg,jpg,png,gif,svg}')
    .pipe(gulp.dest('./public/'));
});

gulp.task('watch', ['nunjucks', 'extras', 'webpack'], (done) => {
  const browserSync = require('browser-sync').create('dev');
  browserSync.init({
    files: './public/**/*',
    port: '9000',
    proxy: 'localhost:' + (process.env.PORT || 3000)
  });

  gulp.watch('./client/src/js/**/*.js', ['webpack']);
  gulp.watch('./client/src/js/**/*.html', ['webpack']);
  gulp.watch('./client/src/templates/**/*.html', ['nunjucks']);
  gulp.watch('./client/src/**/*.{txt,json,xml,jpeg,jpg,png,gif,svg}', ['extras']);
  done();
});

gulp.task('start', ['watch'], () => {
  const browserSync = require('browser-sync').get('dev');
  return nodemon({
    script: 'server.js',
    ext: 'js',
    watch: ['server.js', 'config.js', 'api/'],
    env: { 'NODE_ENV': 'development' }
  }).on('start', function() {
    setTimeout(function() {
      browserSync.reload();
    }, 500);
  });
});

gulp.task('critical', ['default'], function() {
  return gulp.src('public/**/*.html')
  .pipe(critical({
    base: 'public/',
    inline: true
  }))
  .pipe(gulp.dest('public/'));
});

gulp.task('clean', () => {
  return del(['public/*', '!public/favicon.ico', '!public/favicon-152.png']);
});

gulp.task('default', ['webpack', 'nunjucks', 'extras']);
gulp.task('prod', ['critical']);

gulp.task('build-dev', (done) => {
  runSequence('clean',
              ['default', 'start'],
              done);
});

gulp.task('build', (done) => {
  runSequence('clean',
              ['default', 'prod'],
              done);
});
