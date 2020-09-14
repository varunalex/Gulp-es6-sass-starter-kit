# Gulp ES6 SASS STARTER KIT

Gulp ES6 & Sass starter. What's include autoprefixer, browser-sync, uglify, sourcemaps, watch, rename and more...

## Installation

1] Install gulp globally.

    npm install -g gulp

2] Clone the repo

3] Install dependencies `npm install`

## Usage

**Build** - `gulp build`

**Clean** - `gulp clean`

**Build CSS** - `gulp styles`

**Build Js** - `gulp scripts`

**Watch** - `gulp watch`

**Watch and sync with browser** - `gulp watch-browser`

- `browserSync`option of the `gulpfile.js` file must be `true`

**Watch and Sync with a proxy** - gulp watch-proxy

- `browserSync` option of the gulpfile.js file must be `true`
- If your proxy is secured (https), you have to provide SSL certificate key and crt file locations. Check `proxy_sync` function of the `gulpfile.js`

## Notes:

- `browserslist` array for autoprefix is available at the `package.json` file.
- if you need to output multiple javascript files, specify those file in `exportFiles`array. Check the example implementation of the `blog.js` file. It's very usefull when you need to seperate js files from main.js file.
- Useful links: https://gulpjs.com/docs/en/getting-started/explaining-globs
