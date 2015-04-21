// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    minimist = require('minimist'),
    browserify = require('browserify'),
    transform = require('vinyl-transform'),
    spawn = require('child_process').spawn;

var paths = {
  styles: 'app/styles/**/*.scss',
  scripts: 'app/scripts/**/*.js',
  images: 'app/images/**/*.{gif,jpg,png,svg,webp}',
  extras: 'app/*.*',
  index: 'app/**/*.html',
  clean: ['.tmp', '.tmp/**/*',
          'dist', 'dist/**/*',
          'public', 'public/**/*']
};

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'staging' }
};

var options = minimist(process.argv.slice(2), knownOptions);

/**
 * gulp deploy-init
 */
gulp.task('deploy-init', function() {
  var server = options.env === 'production'
    ? '<%= remoteProduction %>'
    : '<%= remoteStaging %>';

  var branch = options.env === 'production'
    ? 'dokku-production'
    : 'dokku-staging';

  var slug = '<%= _.slugify(slug) %>';

  return gulp.src('')
    .pipe($.shell([
      'git remote add ' + branch + ' dokku@' + server + ':' + slug,
      'git push ' + branch + ' master'
    ]));
});

/**
 * gulp deploy
 */
gulp.task('deploy', function() {
  var branch = options.env === 'production'
    ? 'dokku-production'
    : 'dokku-staging';

  return gulp.src('')
    .pipe($.shell([
      'git push ',
      'git push ' + branch + ' master'
    ]));
});

/**
 * gulp styles
 */
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.rubySass({
      bundleExec: true,
      require: 'sass-globbing',
      loadPath: 'bower_components',
      style: 'expanded',
      precision: 10
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe($.if(options.env === 'production', $.csso()))
    .pipe(gulp.dest('public/styles'))
});

/**
 * gulp scripts
 */
gulp.task('scripts', function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(paths.scripts)
    .pipe($.changed('dist/scripts'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(browserified)
    .pipe(gulp.dest('dist/scripts'));
});

/**
 * gulp images
 */
gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe($.changed('dist/images'))
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

/**
 * gulp extras
 */
gulp.task('extras', function() {
  return gulp.src(paths.extras, { dot: true })
    .pipe($.changed('dist'))
    .pipe(gulp.dest('dist'));
});

/**
 * gulp clean
 */
gulp.task('clean', function(cb) {
  require('del')(paths.clean, cb);
});

/**
 * gulp build
 */
gulp.task('build', ['build-useref'], function() {
  gulp.start('hologram');
});

/**
 * gulp hologram
 */

gulp.task('hologram', function() {
  spawn('hologram');
});

/**
 * gulp build-useref
 */
gulp.task('build-useref', [
    'images',
    'scripts',
    'styles',
    'extras'
  ], function() {
  var assets = $.useref.assets({searchPath: '{dist,app}'});

  return gulp.src(paths.index)
    .pipe(assets)
    .pipe($.if(options.env === 'production', $.if('*.js', $.uglify())))
    .pipe($.if(options.env === 'production', $.if('*.css', $.csso())))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if(options.env === 'production', $.if('*.html', $.htmlmin({collapseWhitespace: true}))))
    .pipe(gulp.dest('dist'));
});

/**
 * gulp connect
 */
gulp.task('connect', function () {
  var serveStatic = require('serve-static'),
      serveIndex = require('serve-index');

  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('public'))
    .use(serveIndex('public'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

/**
 * gulp watch
 */
gulp.task('watch', ['build'], function() {
  $.livereload.listen();

  gulp.watch('public/**/*', $.livereload.changed);
  gulp.watch(paths.extras,  ['extras', 'hologram']);
  gulp.watch(paths.index,   ['build-useref', 'hologram']);
  gulp.watch(paths.scripts, ['scripts', 'hologram']);
  gulp.watch(paths.styles,  ['styles', 'hologram']);
  gulp.watch(paths.images,  ['images', 'hologram']);
});

/**
 * gulp watch
 */
gulp.task('serve', ['connect', 'watch'], function() {
  gulp.start('hologram');
  require('opn')('http://localhost:9000');
});

/**
 * gulp
 */
gulp.task('default', ['build']);
