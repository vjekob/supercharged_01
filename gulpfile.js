const gulp = require("gulp");
const del = require("del");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const cleanCss = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const babel = require("gulp-babel");

const config = require("./gulp.config.json");

const path = {
    js: `${config.root}/${config.path.js}`,
    css: `${config.root}/${config.path.css}`
};
const bundleJsFileName = `${config.package}.min.js`;
const bundleCssFileName = `${config.package}.min.css`;
const pathBundleJs = `${path.js}/${bundleJsFileName}`;
const pathBundleCss = `${path.css}/${bundleCssFileName}`;
const globJs = `${path.js}/*.js`;
const globCss = `${path.css}/*.css`;

const deleteBundleJs = () => del(pathBundleJs);
const deleteBundleCss = () => del(pathBundleCss);

const bundleJs = prod => () => gulp
    .src([globJs, `!${path.js}/start.js`])
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(concat(bundleJsFileName))
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(gulpif(prod, uglify()))
    .pipe(gulpif(!prod, sourcemaps.write()))
    .pipe(gulp.dest(path.js));

const bundleCss = prod => () => gulp
    .src(globCss)
    .pipe(concat(bundleCssFileName))
    .pipe(gulpif(prod, cleanCss()))
    .pipe(gulp.dest(path.css));

const buildJs = prod => gulp.series(deleteBundleJs, bundleJs(prod));
const buildCss = prod => gulp.series(deleteBundleCss, bundleCss(prod));

const watchJs = () => gulp.watch([globJs, `!${pathBundleJs}`], buildJs(false));
const watchCss = () => gulp.watch([globCss, `!${pathBundleCss}`], buildCss(false));

const build = prod => gulp.parallel(buildJs(prod), buildCss(prod));

exports.build = build(false);
exports.prod = build(true);
exports.watch = gulp.parallel(watchJs, watchCss);
