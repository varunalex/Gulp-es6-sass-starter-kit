const { dest, parallel, series, src, task, watch } = require('gulp');

// CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// Utils
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// Style paths
const styleSrc = 'src/scss/style.scss';
const styleDist = './dist/css/';

function style(done) {
  src(styleSrc)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true, //
        outputStyle: 'compressed',
      }),
    )
    .on('error', console.error.bind(console))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(rename({ suffix: '.min' })) // or extname: '.min.css'
    .pipe(sourcemaps.write('./'))
    .pipe(dest(styleDist));

  done();
}

// Register tasks
task('style', style); // gulp style

task('default', parallel(style)); // gulp
