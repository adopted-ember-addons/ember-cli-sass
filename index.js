var SassCompiler = require('broccoli-sass-source-maps');
var path = require('path');
var checker = require('ember-cli-version-checker');
var mergeTrees = require('broccoli-merge-trees');
var merge = require('merge');
var fs = require('fs');

function SASSPlugin(optionsFn) {
  this.name = 'ember-cli-sass';
  this.optionsFn = optionsFn;
}

SASSPlugin.prototype.toTree = function(tree, inputPath, outputPath, inputOptions) {
  var options = merge({}, this.optionsFn(), inputOptions);

  var inputTrees = [tree];
  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths);
  }
  var trees = Object.keys(options.outputPaths).reduce(function(trees, file) {
    var input;
    if (options.extension) {
      input = path.join('.', inputPath, file + '.' + options.extension);
    }
    else {
      input = tryFile(file + '.scss') || tryFile(file + '.sass');
    }
    var output = options.outputPaths[file];
    if (input) {
      trees.push(new SassCompiler(inputTrees, input, output, options));
    }
    return trees;
  }, []);

  function tryFile(file) {
    // `ember-cli` passes different `tree` as the parameter to `toTree()`.
    //
    // When building an addon that directly uses `ember-cli-sass`, `tree` is a
    // `String` that contains `"/path/to/your/addon-name/addon/styles"`.
    //
    // When building an hosting app that indirectly uses `ember-cli-sass`
    // through an addon, `tree` is an object with a `read()` function that
    // returns `"/path/to/your/addon-name/addon/styles"`.
    var treeString = tree.read ? tree.read() : tree;

    // When tree is a 'TreeMerger (stylesAndVendor)'
    // the 'read' returns a object, so use the a relative treeString(.)
    if(typeof treeString !== "string") {
      treeString = "."
    }

    // When ember-cli preprocess addon style the inputPath is '/',
    // add the '/addon/styles' to try found addon sass files
    var root = (inputPath === '/') ? treeString : '.';
    var filePath = path.join(root, inputPath, file);

    if (!fs.existsSync(filePath)) return false;

    // Convert the (possibly) absolute path to a relative path expected by
    // `broccoli-sass-source-maps`
    return path.relative(treeString, filePath);
  }

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
