var SassCompiler = require('broccoli-sass-source-maps');
var path = require('path');
var checker = require('ember-cli-version-checker');
var mergeTrees = require('broccoli-merge-trees');
var merge = require('merge');

function SASSPlugin(options) {
  this.name = 'ember-cli-sass';
  options = options || {};
  if (options.sourceMap || options.sourceMapEmbed) {
    options.sourceMapContents = true;
  }
  this.options = options;
}

SASSPlugin.prototype.toTree = function(tree, inputPath, outputPath, options) {
  options = merge({}, this.options, options);

  var paths = options.outputPaths;
  var ext = options.ext || 'scss';
  var trees = [tree];

  if (options.includePaths) trees = trees.concat(options.includePaths);

  console.log('paths', paths);
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
    var options = this.project.config(env).sassOptions
        || (this.app && this.app.options.sassOptions) || {};
    if ((options.sourceMap === undefined) && (env == 'development')) {
      options.sourceMap = true;
    }
    options.outputFile = options.outputFile || this.project.name() + '.css';
    return options;
  },
  setupPreprocessorRegistry: function(type, registry) {
    registry.add('css', new SASSPlugin(this.sassOptions()));

    // prevent conflict with broccoli-sass if it's installed
    if (registry.remove) registry.remove('css', 'broccoli-sass');
  },
  included: function included(app) {
    this.app = app; // used to provide back-compat for ember-cli < 0.2.0 in sassOptions()
    this._super.included.apply(this, arguments);

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};
