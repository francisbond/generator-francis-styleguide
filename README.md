generator-francis-styleguide
============================

[Francis Bond's](http://francisbond.com) [Yeoman](http://yeoman.io) generator for scaffolding a styleguide with [Hologram](http://trulia.github.io/hologram/), [Gulp](http://gulpjs.com/), Bower, Sass, inuit.css, Modernizr, and jQuery.

## Features

* Deploy to a Dokku-powered server
* Automatically compile Sass with Autoprefixing
* Automatically lint your Javascript
* Image optimization (png, jpg, gif)
* Optionally include inuit.css and jQuery

## Initialization

* Install: `npm install -g francisbond/generator-francis-styleguide`
* Run: `yo francis-styleguide`
* Run `gulp build` for building and `gulp watch` for preview
* Use `gulp deploy-init` to initalise a deployment environment
* Run `gulp deploy` after committing changes to deploy them

### Requirements
* Hologram must be installed: `gem install hologram`
* The generator requires Ruby and Sass to be installed, and inuit.css requires at least Sass 3.3. Using the newest version available is recommended: `gem install sass`.
* Yeoman, Bower, and gulp.js should be installed globally via npm.

## Available Commands

### Deployment

* `gulp deploy-init`

  Initialize a Dokku container for use in the project's deployment.

  1. Adds a git remote corresponding with the Dokku server.
  2. Pushes the repository to the Dokku remote.
  3. Defines a Buildpack for Dokku to use in the project's deployment.

* `gulp deploy`

  Pushes the repository to the Dokku remote.

### Development

* `gulp watch`

  Watches the project for changes in images, styles, javascript, HTML, etc. and performs appropriate actions. Skips some non-critical resource-intensive processes (e.g. image optimization).

* `gulp build`

  Build the project for deployment. Performs all tasks including minification and image optimization.

### Miscellaneous

* `bower install`

  Install project-specific Bower packages defined in bower.json. You should run this command when cloning an already initialized repository.

* `npm install`

  Install project-specific npm packages defined in the package.json. You should run this command when cloning an already initialized repository.

## Known Issues

* Rerunning `gulp deploy-init` will fail, since a Dokku remote has already been created. Running `git remote remove dokku` will resolve this.
* `gulp deploy` will sometimes fail if a newer commit has been deployed but not pushed to the repository. You can override this by running `git push origin dokku --force`.
