const gulp = require('gulp');
// CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// js
const babelify = require('babelify');
const browserify = require('browserify');
const uglify = require('gulp-uglify');

// Utilities
const browserSync = require('browser-sync').create();
const del = require('del');
var gulpif = require('gulp-if');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const reload = browserSync.reload;

// Vinyl
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const options = {
  browserSync: true,
};

let paths = {
  styles: {
    src: 'src/scss/**.scss',
    dest: 'dist/css/',
    watch: 'src/scss/**/*.scss',
  },
  scripts: {
    srcFolder: 'src/js/',
    dest: './dist/js/',
    exportFiles: ['main.js', 'blog.js'], // dest output files (filename.min.js)
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
  return del(['dist']);
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
      .pipe(gulpif(options.browserSync, browserSync.stream()))
  );
}

function scripts(done) {
  paths.scripts.exportFiles.map(function (file) {
    return browserify({
      entries: [paths.scripts.srcFolder + file],
    })
      .transform(babelify, { presets: ['@babel/preset-env'] })
      .bundle()
      .pipe(source(file))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(gulpif(options.browserSync, browserSync.stream()));
  });

  done();
}

function browser_sync(done) {
  browserSync.init({
    injectChanges: true,
    server: {
      baseDir: './dist/',
    },
  });
  done();
}

/**
 * Specify SSL certificate key and crt files if you are using https dev server/proxy
 */
function proxy_sync(done) {
  browserSync.init({
    open: false,
    injectChanges: true,
    proxy: 'http://127.0.0.1:5500',
    // https: {
    //   key: '/path/to/your/key.key',
    //   cert: '/path/to/your/crt.crt',
    // },
  });
  done();
}

function watch(done) {
  gulp.watch(paths.scripts.watch, scripts);
  // Use reload if you want to disable injectChanges option.
  gulp.watch(paths.styles.watch, styles);

  done();
}

function watchNsync(done) {
  gulp.watch(paths.scripts.watch, gulp.series(scripts, reload));
  // Use reload if you want to disable injectChanges option.
  gulp.watch(paths.styles.watch, styles);

  done();
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports['watch-browser'] = gulp.series(watchNsync, browser_sync);
exports['watch-proxy'] = gulp.series(watchNsync, proxy_sync);
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
