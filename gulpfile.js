var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var deploy = require('gulp-gh-pages');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');

gulp.task('watch', ['clean', 'sass'], function() {
	browserSync.init({
		server: {
            baseDir: "./"
		},
		notify: {
            styles: {
                top: 'auto',
                bottom: '0'
            }
        }
	});

	gulp.watch("assets/scss/**/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("assets/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(csso())
        .pipe(gulp.dest("build/css"))
        .pipe(browserSync.stream());
});


/**
 * Remove files in build map
 */
gulp.task('clean', function () {
    return del('build');
});

/**
 * Push build to gh-pages
 */
gulp.task('deploy', ['clean', 'sass'], function () {
	return gulp.src("./build/**/*")
	  .pipe(deploy())
  });

gulp.task('default', ['sass', 'watch']);