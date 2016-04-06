const gulp = require("gulp");
const del = require("del");
const typescript = require("gulp-typescript");
const tscConfig = require("./tsconfig.json");
const sourcemaps = require("gulp-sourcemaps");
const tslint = require('gulp-tslint');

var browserSync = require('browser-sync');
var superstatic = require('superstatic');

// clean the contents of the disttribution directory
gulp.task("clean", function() {
    return del("dist/**/*");
});

// typescript compile
gulp.task("compile", ["clean"], function() {
    return gulp
        .src("app/**/*.ts")
        .pipe(sourcemaps.init()) 
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("dist/app"));
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
    return gulp.src(['app/**/*', 'index.html', 'styles.css', '!app/**/*.ts'], { base : './' })
        .pipe(gulp.dest('dist'))
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
    return gulp.src([
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/router.dev.js'
        ])
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('tslint', function() {
    return gulp.src('app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('serve', function() {
    gulp.watch(['./app/**/*.ts'], ['build']);
    browserSync({
        port: 3000,
        files: ['index.html', '**/*.js'],
        injectChanges: true,
        logFileChanges: false,
        logLevel: 'silent',
        notify: true,
        reloadDelay: 0,
        //server: ["dist", "app"]
        server: {
            baseDir: ["dist", "app"]
        }
    }); 
});

gulp.task("build", ['tslint', 'compile', 'copy:libs', 'copy:assets']);
gulp.task("watch", ["build", "serve"]);
gulp.task("default", ["build"]);

