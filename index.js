var SassCompiler = require('broccoli-sass');
var path = require('path');
var checker   = require('ember-cli-version-checker');

function SASSPlugin(options) {
  this.name = 'ember-cli-sass';
  options = options || {};
  options.inputFile = options.inputFile || 'app.scss';
  options.outputFile = options.outputFile || 'app.css';
  if (options.sourceMap || options.sourceMapEmbed) {
    options.sourceMapContents = true;
  }
  this.options = options;
}

SASSPlugin.prototype.toTree = function(tree, inputPath, outputPath) {
  var trees = [tree];
  if (this.options.includePaths) trees = trees.concat(this.options.includePaths);
  inputPath = path.join(inputPath, this.options.inputFile);
  outputPath = path.join(outputPath, this.options.outputFile);
  return new SassCompiler(trees, inputPath, outputPath, this.options);
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
