'use strict';

var yeoman = require('yeoman-generator'),
    yosay = require('yosay');

var FrancisStyleguideGenerator = yeoman.generators.Base.extend({
  init: function() {
    this.pkg = require('../package.json');
  },

  promptTask: function() {
    var done = this.async();

    this.log(yosay('You\'re using Francis Bond\'s fantastic styleguide generator.'));

    this.prompt([{
      name: 'slug',
      message: 'Enter a unique slug for this project',
    }, {
      name: 'staging',
      message: 'Enter the hostname of the dokku staging server',
      default: 'staging.francisbond.com'
    },
    {
      name: 'production',
      message: 'Enter the hostname of the dokku production server',
      default: 'production.francisbond.com'
    }], function(props) {
      this.slug = props.slug;
      this.remoteStaging = props.staging;
      this.remoteProduction = props.production;

      var hasFeature = function(feat) {
        return props.features.indexOf(feat) !== -1;
      }

      done();
    }.bind(this));
  },

  app: function() {
    this.mkdir('app');
    this.directory('templates', 'app/templates');

    this.mkdir('app/images');
    this.write('app/images/.gitkeep', '');
  },

  styles: function() {
    this.directory('styles', 'app/styles');
  },

  scripts: function() {
    this.mkdir('app/scripts');
    this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
  },

  bower: function() {
    this.copy('bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');
  },

  gulp: function() {
    this.template('gulpfile.js', 'gulpfile.js');
  },

  git: function() {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
  },

  package: function() {
    this.copy('_package.json', 'package.json');
  },

  hologram: function() {
    this.copy('Gemfile', 'Gemfile');
    this.copy('hologram_config.yml', 'hologram_config.yml');
  },

  extras: function() {
    this.copy('favicon.ico', 'app/favicon.ico');
    this.copy('robots.txt', 'app/robots.txt');
    this.copy('humans.txt', 'app/humans.txt');

    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('env', '.env');
  },

  install: function() {
    this.installDependencies();
  }
});

module.exports = FrancisStyleguideGenerator;