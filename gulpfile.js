const gulp = require('gulp');
// CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// js
const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('browserify');
const uglify = require('gulp-uglify');

// Utilities
const concat = require('gulp-concat');
const del = require('del');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

let paths = {
  styles: {
    src: 'src/scss/**.scss',
    dest: 'dist/css/',
    watch: 'src/scss/**/*.scss',
  },
  scripts: {
    srcFolder: 'src/js/',
    dest: './dist/js/',
    files: ['main.js', 'blog.js'], // dest output files (filename.min.js)
    watch: 'src/js/**/*.js',
  },
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(['dist/css', 'dist/js']);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return (
    gulp
      .src(paths.styles.src)
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          errLogToConsole: true,
          outputStyle: 'compressed',
        }),
      )
      .pipe(cleanCSS())
      // pass in options to the stream
      .on('error', console.error.bind(console))
      .pipe(
        autoprefixer({
          cascade: false,
        }), // browsersList available at the package.json
      )
      .pipe(
        rename({
          suffix: '.min',
        }),
      )
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(paths.styles.dest))
  );
}

function scripts() {
  return paths.scripts.files.map(function (file) {
    return browserify({
      entries: [paths.scripts.folder + file],
    })
      .transform(babelify, { presets: ['@babel/preset-env'] })
      .bundle()
      .pipe(source(file))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(dest(paths.scripts.dest));
    //.pipe(browserSync.stream());
  });
  return (
    gulp
      .src(paths.scripts.src, { sourcemaps: true })
      .pipe(babel())
      .pipe(uglify())
      // .pipe(concat('main.min.js'))
      .pipe(gulp.dest(paths.scripts.dest))
  );
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.watch, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
