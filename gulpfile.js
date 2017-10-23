const gulp = require('gulp');
const karma = require('karma');
const doc = require('gulp-documentation');
const jsBuilder = require('gulp-systemjs-builder');
const uglifyjs = require('uglify-es');
const composer = require('gulp-uglify/composer');
const rename = require('gulp-rename');
const license = require('gulp-header-license');


gulp.task('test', (done) => {
	new karma.Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});


gulp.task('build', ['build:distributable', 'build:minify', 'build:license']);

gulp.task('build:distributable', () => {
	let builder = jsBuilder('./src');
	builder.config({
		transpiler: 'plugin-babel',
		paths: {
			"node:*": "./node_modules/*"
		},
		map: {
 			'plugin-babel': 'node:systemjs-plugin-babel/plugin-babel.js',
			'systemjs-babel-build': 'node:systemjs-plugin-babel/systemjs-babel-browser.js'
		},
		meta: {
			'*.js': {
				babelOptions: {es2015: false}
			}
		}
	});
	return builder.buildStatic('./src/awc-core.js', 'awc-core.js', {globalName: 'awc'})
		.pipe(gulp.dest('./dist'));
});

gulp.task('build:minify', ['build:distributable'], () => {
	let minifier = composer(uglifyjs, console);
	return gulp.src('./dist/awc-core.js')
		.pipe(minifier())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build:license', ['build:minify'], () => {
	return gulp.src('./dist/*.js')
		.pipe(license(
`/*
 * Copyright (C) ${(new Date()).getFullYear()} Fraunhofer IAO
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the Clear BSD license. See the LICENSE file for details.
 */`))
		.pipe(gulp.dest('./dist'));
});


gulp.task('apidoc', ['apidoc:html', 'apidoc:md']);

gulp.task('apidoc:html', () => {
	let pkg = require('./package.json');
	return gulp.src('./src/**/*.js')
		.pipe(doc('html', {}, {
			name: pkg.name,
			version: pkg.version
		}))
		.pipe(gulp.dest('./doc'));
});

gulp.task('apidoc:md', () => {
	let pkg = require('./package.json');
	return gulp.src('./src/**/*.js')
		.pipe(doc('md', {}, {
			name: pkg.name,
			version: pkg.version
		}))
		.pipe(gulp.dest('./doc'));
});
