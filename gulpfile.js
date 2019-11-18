const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();
const gulpWebpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const autoprefixer = require('gulp-autoprefixer');

const paths = {
    root: './build',
    templates: {
        pages: 'src/html/*.pug',
    },
    styles: {
        src: 'src/scss/*.scss',
        dest: 'build/assets/css'
    },
    scrypts: {
        src: 'src/js/*.js',
        dest: 'build/assets/js',
        json: 'src/js/*.json'
    },
    image: {
        src: 'src/img/*.*',
        dest: 'build/assets/img'
    }
}
//move json
function json () {
    return gulp.src(paths.scrypts.json)
        .pipe(gulp.dest(paths.root))
}

function img(){
    return gulp.src(paths.image.src)
        .pipe(gulp.dest(paths.image.dest))
}
//convert pug
function html () {
    return gulp.src(paths.templates.pages)
        .pipe(pug({pretty:true}))
        .pipe(gulp.dest(paths.root));
};
// convert sass
function css(){
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(paths.styles.dest))
};
// clean
function clean(){
    return del(paths.root);
};
//gulp watcher
function watch(){
    gulp.watch(paths.styles.src, css);
    gulp.watch(paths.templates.pages, html);
    gulp.watch(paths.scrypts.src, scrypts);
    gulp.watch(paths.scrypts.src, json);

}
//local host + livereload
function server(){
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}
function scrypts () {
    return gulp.src(paths.scrypts.src)
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest(paths.scrypts.dest));
  }

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(css, html, scrypts, json, img),
    gulp.parallel(watch, server)
 ));


exports.server = server;
exports.html = html;
exports.css = css;
exports.clean = clean;
exports.scrypts = scrypts;
exports.json = json;
exports.img = img;