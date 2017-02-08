'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const nunjucksify = require('nunjucksify');
const source = require('vinyl-source-stream');
const merge = require('merge-stream');
const NodeServer = require('./node-server');

const LIVERELOAD_PORT = 35730;

const hostname = "localhost";
const port = 9001;

let $ = require('gulp-load-plugins')();
let pkg = require('./package');

let production = false;


gulp.task('browserify', [], () => {
	return browserify({
			entries: './app/scripts/main.js',
        	paths: ['./app/modules'],
			debug: !production
		})
		.transform(nunjucksify, {
			global: true,
			extension: '.html'
		})
		.bundle()
		.on('error', function (err) {
			console.log(err.toString());
			this.emit('end');
		})
		.pipe(source('main.js'))
		.pipe($.buffer())
		.pipe($.if(!production, $.sourcemaps.init({
			loadMaps: true
		})))
		.pipe($.if(production, $.uglify().on('error',(e) => { 
			console.log('Error in uglify !\n',e);
		})))
		.pipe($.if(!production, $.sourcemaps.write('./')))
		.pipe($.debug())
		.pipe(gulp.dest($.if(production,
			'dist/scripts/',
			'.tmp/scripts/')));
});



gulp.task('connect', ['nunjucks', 'browserify', 'sass'], function() {
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var app = require('connect')()
		.use(require('connect-livereload')({
			port: 35729
		}))
		.use('/node_modules', serveStatic('./node_modules'))
		.use(serveStatic('.tmp'))
		.use(serveStatic('browser'))
		.use(serveStatic('app'))
		.use(serveIndex('.tmp'));

	new NodeServer(app, hostname, port).start();

});

gulp.task('watch', ['connect'], function() {
	$.livereload.listen({ port: LIVERELOAD_PORT });

	// watch for changes
	gulp.watch([
		'.tmp/**.html',
		'{app,.tmp,app/modules/*}/styles/**/*.css',
		'{browser,dist}/scripts/**/*.js',
		'{app,app/modules/**}/images/**/*'
	]).on('change', $.livereload.changed);

	gulp.watch(['package.json', 'app/**.html'], ['version']);
	gulp.watch(['{app,app/modules/*}/styles/**/*.scss'], ['sass']);
	gulp.watch(['{app,app/modules/*}/scripts/**/*.js', '{app,app/modules/*}/templates/**/*.html', 'app/modules/*/*.js'], ['browserify']);
});

gulp.task('useref', ['nunjucks', 'sass'], function() {
	const cssFilter = $.filter('.tmp/**/*.css', {restore: true});
	const htmlFilter = $.filter('.tmp/*.html', {restore: true});

	return gulp.src('.tmp/*.html')
		// .pipe($.debug())
		.pipe($.useref({
			searchPath: ['.tmp', 'app']
		}))
		// .pipe($.debug({title: 'Debug:before cssFilter'}))
		// CSS
		.pipe(cssFilter)
		// .pipe($.debug({title: 'Debug:after cssFilter'}))
		.pipe($.if(production, $.cleanCss()))
		.pipe(cssFilter.restore)
		// HTML
		.pipe(htmlFilter)
		.pipe($.htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			removeAttributeQuotes: true
		}))
		.pipe(htmlFilter.restore)

		.pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
	return gulp.src([
			'app/fonts/**/*',
		], { base: './app/fonts' })
	 	// .pipe($.debug({title: 'unicorn:'}))
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		// .pipe($.flatten())
		.pipe($.if(production,
			gulp.dest('dist/fonts'),
			gulp.dest('.tmp/fonts')
		));
});

gulp.task('eslint', [], function() {
	return gulp.src('{app/*}/**/*.js')
		.pipe($.eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe($.eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe($.eslint.failAfterError());
});

gulp.task('sass', function() {
	return gulp.src('app/styles/main.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass({
			outputStyle: 'nested', // libsass doesn't support expanded yet
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.plumber(function onError(error) {
			$.util.log($.util.colors.red(error.message));
			this.emit('end');
		}))
		.pipe($.autoprefixer({
			browsers: ['last 2 version']
		}))
		.pipe($.if(!production, $.sourcemaps.write('.', {
			includeContent: false,
			sourceRoot: './'
		})))
		.pipe(gulp.dest('.tmp/styles'));f
});

gulp.task('images', [], function() {
	return gulp.src([
			'app/{favicons,images}/**/*.{jpg,png,gif,jpeg,svg}'
		], { base: '.' })
		.pipe($.rename(function(path) {
			var regex = /^win/.test(process.platform) ? /^app\\/ : /^app\//;
			path.dirname =  path.dirname.replace(regex, '');
			//path.dirname =  path.dirname.replace(/^(.*)\/images/, 'modules/$1/images');
		}))
		.pipe($.if(production, $.imagemin({
			progressive: true
		})))
		.pipe(gulp.dest('dist'));
});

gulp.task('nunjucks', function() {
	var nunjucksRender = require('gulp-nunjucks-render');
	// Force reload
	delete require.cache[require.resolve('./app/data.json')];
	var data = require('./app/data.json');

	// nunjucksRender.nunjucks.configure(['app/'], { watch: false });

	return gulp.src(['app/**/*.html'])
		.pipe($.plumber(function (error) {
			$.util.log($.util.colors.red(error.message));
			this.emit('end');
		}))
		.pipe(nunjucksRender({
			 path: 'app',
			 data: data
		}))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('clean', require('del').bind(null, ['browser', 'dist', '.tmp']));

gulp.task('serve', ['connect', 'watch'], () => {
	require('opn')('http://' + hostname + ':' + port);
});

gulp.task('build-node', ['eslint', 'browserify', 'fonts','useref', 'images']);

gulp.task('build', ['clean'], () => {
	production = true;
	gulp.start('build-node');
});

gulp.task('default', ['build']);