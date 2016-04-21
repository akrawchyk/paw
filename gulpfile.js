'use strict';

const fs             = require('fs');
const path           = require('path');
const gulp           = require('gulp');
const gutil          = require('gulp-util');
const webpack        = require('webpack');
const webpackConfig  = require('./webpack.config.js');
const del            = require('del');
const nunjucks       = require('gulp-nunjucks');
const critical       = require('critical').stream;
const runSequence    = require('run-sequence');
const nodemon        = require('gulp-nodemon');

gulp.task('webpack', (done) => {
  const myConfig = Object.create(webpackConfig);
  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({ colors: true }));
    done();
  });
});

gulp.task('nunjucks', ['webpack'], () => {
  const webpackAssets = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'webpack-assets.json'), 'utf8'));
  return gulp.src(['./client/src/templates/**/*.html', '!**/_*'])
    .pipe(nunjucks.compile({ webpackAssets: webpackAssets }, {
      throwOnUndefined: true
    }))
    .pipe(gulp.dest('public/'))
})

gulp.task('extras', () => {
  return gulp.src(['./client/src/**/*.{txt,json,xml,ico}', './client/src/favicon-152.png'])
    .pipe(gulp.dest('./public/'));
});

gulp.task('watch', ['nunjucks', 'extras', 'webpack'], (done) => {
  const browserSync = require('browser-sync').create('dev');
  browserSync.init({
    files: './public/**/*',
    port: '9000',
    proxy: 'localhost:' + (process.env.PORT || 3000)
  });

  gulp.watch([
    './client/src/js/**/*.js',
    './client/src/js/**/*.html',
    './client/src/scss/**/*.scss',
    './client/src/img/**/*'
  ], ['webpack']);
  gulp.watch('./client/src/templates/**/*.html', ['nunjucks']);
  gulp.watch('./client/src/**/*.{txt,json,xml,ico}', ['extras']);
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
  const webpackAssets = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'webpack-assets.json'), 'utf8'));
  return gulp.src('public/**/*.html')
  .pipe(critical({
    base: 'public/',
    css: ['public' + webpackAssets.styles.css],
    minify: true,
    inline: true
  }))
  .pipe(gulp.dest('public/'));
});

gulp.task('clean', () => {
  return del('public/*');
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
