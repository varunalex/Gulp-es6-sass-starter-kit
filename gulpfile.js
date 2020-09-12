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

// Vinyl
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

// Style paths
const styleSrc = 'src/scss/style.scss';
const styleDist = './dist/css/';

// Js paths
const mainJS = 'main.js';
const blogJS = 'blog.js';
let jsFolder = 'src/js/';
var jsDist = './dist/js/';
let jsFiles = [mainJS, blogJS];

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
    .pipe(dest(styleDist));

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
      .pipe(dest(jsDist));
  });

  done(); // calling callback
}

// Register tasks
task('style', style); // gulp style

task('js', js); // gulp js

task('default', parallel(style, js)); // gulp
