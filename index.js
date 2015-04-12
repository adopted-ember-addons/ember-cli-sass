var SassCompiler = require('broccoli-sass-source-maps');
var path = require('path');
var checker = require('ember-cli-version-checker');
var mergeTrees = require('broccoli-merge-trees');
var merge = require('merge');

function SASSPlugin(optionsFn) {
  this.name = 'ember-cli-sass';
  this.optionsFn = optionsFn;
}

SASSPlugin.prototype.toTree = function(tree, inputPath, outputPath, inputOptions) {
  var options = merge({}, this.optionsFn(), inputOptions);

  var paths = options.outputPaths;
  var ext = options.ext || 'scss';
  var trees = [tree];

  if (options.includePaths) trees = trees.concat(options.includePaths);

  trees = Object.keys(paths).map(function(file) {
    var input = path.join(inputPath, file + '.' + ext);
    var output = paths[file];

    return new SassCompiler(trees, input, output, options);
  });

  return mergeTrees(trees);
};

module.exports = {
  name:  'Ember CLI SASS',

  shouldSetupRegistryInIncluded: function() {
    return !checker.isAbove(this, '0.2.0');
  },

  sassOptions: function () {
    var env  = process.env.EMBER_ENV;
    var options = (this.app && this.app.options.sassOptions) || {};
    var envConfig = this.project.config(env).sassOptions;
    if (envConfig) {
      console.warn("Deprecation warning: sassOptions should be moved to your Brocfile");
      merge(options, envConfig);
    }

    if ((options.sourceMap === undefined) && (env == 'development')) {
      options.sourceMap = true;
    }

    if (options.sourceMap || options.sourceMapEmbed) {
      // we need to embed the sourcesContent in the source map until libsass has better support for broccoli-sass
      options.sourceMapContents = true;
    }

    options.outputFile = options.outputFile || this.project.name() + '.css';

    return options;
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('css', new SASSPlugin(this.sassOptions.bind(this)));

    // prevent conflict with broccoli-sass if it's installed
    if (registry.remove) registry.remove('css', 'broccoli-sass');
  },

  included: function included(app) {
    this.app = app;
    this._super.included.apply(this, arguments);

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};
