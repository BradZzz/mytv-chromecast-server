// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

//Test the nodejs routing
gulp.task('nodejs', function() {
    return gulp.src('routes/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('angular', function() {
    return gulp.src('public/javascripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//Concatenate & Minify JS
gulp.task('minify', function() {
    return gulp.src('public/javascripts/lobby_core.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist'));
});

gulp.task('cleanup_angular',['minify'], function (cb) {
	del(['public/dist/all.js'], cb);
});

gulp.task('watch', function() {
    gulp.watch('routes/*.js', ['nodejs']);
    gulp.watch('public/javascripts/*.js', ['angular']);
});

//Default Task
gulp.task('default', ['nodejs','angular','minify','cleanup_angular']);