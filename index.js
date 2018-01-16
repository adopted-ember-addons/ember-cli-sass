/* eslint-env node */
var SassCompiler = require('broccoli-sass-source-maps');
var path = require('path');
var VersionChecker = require('ember-cli-version-checker');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var fs = require('fs');

function SASSPlugin(optionsFn) {
  this.name = 'ember-cli-sass';
  this.optionsFn = optionsFn;
  this.ext = ['scss', 'sass'];
}

SASSPlugin.prototype.toTree = function(tree, inputPath, outputPath, inputOptions) {
  var options = Object.assign({}, this.optionsFn(), inputOptions);
  var inputTrees;

  if (options.onlyIncluded) {
    inputTrees = [new Funnel(tree, {
      include: ['app/styles/**/*'],
      annotation: 'Funnel (styles)'
    })];
  }
  else {
    inputTrees = [tree];
  }

  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths);
  }

  var ext = options.extension || 'scss';
  var paths = options.outputPaths;
  var trees = Object.keys(paths).map(function(file) {
    var input = path.join(inputPath, file + '.' + ext);
    var output = paths[file];
    return new SassCompiler(inputTrees, input, output, options);
  });

  return mergeTrees(trees);
};

module.exports = {
  name:  'ember-cli-sass',

  shouldSetupRegistryInIncluded: function() {
    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cli');

    return !dep.isAbove('0.2.0');
  },

  sassOptions: function () {
    var env  = process.env.EMBER_ENV;
    var options = (this.app && this.app.options && this.app.options.sassOptions) || {};
    var parentOption = (this.parent && this.parent.app && this.parent.app.options && this.parent.app.options.sassOptions) || {};
    var envConfig = this.project.config(env).sassOptions;

    Object.assign(options, parentOption);

    if (envConfig) {
      console.warn("Deprecation warning: sassOptions should be moved to your ember-cli-build");
      Object.assign(options, envConfig);
    }

    if ((options.sourceMap === undefined) && (env == 'development')) {
      options.sourceMap = true;
    }

    if (options.sourceMap || options.sourceMapEmbed) {
      // we need to embed the sourcesContent in the source map until libsass has better support for broccoli-sass
      options.sourceMapContents = true;
    }

    options.outputFile = options.outputFile || this.project.name() + '.css';
    options.sourceMapRoot = path.join(this.project.root, 'app/styles');

    return options;
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('css', new SASSPlugin(this.sassOptions.bind(this)));

    // prevent conflict with broccoli-sass if it's installed
    if (registry.remove) registry.remove('css', 'broccoli-sass');
  },

  included: function included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};
