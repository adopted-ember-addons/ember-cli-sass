var SassCompiler = require('broccoli-sass');
var path = require('path');

function SASSPlugin(options) {
  this.name = 'ember-cli-sass';
  options = options || {};
  options.inputFile = options.inputFile || 'app.scss';
  options.outputFile = options.outputFile || 'app.css';
  if (options.sourceMap) {
    options.sourceComments = 'map';
    options.sourceMap = true;
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

function EmberCLISASS(project) {
  this.project = project;
  this.name = 'Ember CLI SASS';
}

EmberCLISASS.prototype.treeFor = function treeFor(type) {
};

EmberCLISASS.prototype.included = function included(app) {
  var options = app.options.sassOptions || {};
  if ((options.sourceMap === undefined) && (app.env == 'development')) {
    options.sourceMap = true;
  }
  options.outputFile = options.outputFile || this.project.name() + '.css';
  app.registry.add('css', new SASSPlugin(options));
  // prevent conflict with broccoli-sass if it's installed
  if (app.registry.remove) app.registry.remove('css', 'broccoli-sass');
};

module.exports = EmberCLISASS;
