const { dest, parallel, series, src, task, watch } = require('gulp');

// CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// JS
const babelify = require('babelify');
const browserify = require('browserify');
const uglify = require('gulp-uglify');

// Utils
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Vinyl
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

// Style paths
const styleSrc = 'src/scss/style.scss';
const styleDist = './dist/css/';
let styleWatch = 'src/scss/**/*.scss';

// Js paths
const mainJS = 'main.js';
const blogJS = 'blog.js';
let jsFolder = 'src/js/';
var jsDist = './dist/js/';
let jsFiles = [mainJS, blogJS];
let jsWatch = 'src/js/**/*.js';

let htmlWatch = '**/*.html'; // Optional

function style(done) {
  src(styleSrc)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'compressed',
      }),
    )
    .on('error', console.error.bind(console))
    .pipe(
      autoprefixer({
        cascade: false,
      }), // browsersList available at the package.json
    )
    .pipe(rename({ suffix: '.min' })) // or extname: '.min.css'
    .pipe(sourcemaps.write('./'))
    .pipe(dest(styleDist))
    .pipe(browserSync.stream());

  done(); // calling callback
}

function js(done) {
  jsFiles.map(function (file) {
    return browserify({
      entries: [jsFolder + file],
    })
      .transform(babelify, { presets: ['@babel/preset-env'] })
      .bundle()
      .pipe(source(file))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(dest(jsDist))
      .pipe(browserSync.stream());
  });

  done(); // calling callback
}

function gulp_watch(done) {
  watch(styleWatch, style);
  watch(jsWatch, series(js, reload));

  watch(htmlWatch, reload); // Optional

  done();
}

function browser_sync(done) {
  browserSync.init({
    injectChanges: true,
    server: {
      baseDir: './',
    },
  });

  //   browserSync.init({
  //     open: false,
  //     injectChanges: true,
  //     proxy: 'http://127.0.0.1:5500',
  //     // https: {
  //     //   key: '/path/to/your/key.key',
  //     //   cert: '/path/to/your/crt.crt',
  //     // },
  //   });

  done();
}

// Register tasks
task('style', style); // gulp style

task('js', js); // gulp js

task('watch', gulp_watch); // gulp watch

task('watch-sync', series(gulp_watch, browser_sync)); // gulp watch-sync

task('default', parallel(style, js)); // gulp
