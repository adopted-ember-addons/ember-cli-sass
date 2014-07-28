var SassCompiler = require('broccoli-sass');

function SASSPlugin(options) {
  this.name = 'ember-cli-sass';
  options = options || {};
  options.inputFile = options.inputFile || 'app.scss';
  options.outputFile = options.outputFile || 'app.css';
  if (options.sourceMap || (options.sourceMap === undefined)) {
    options.sourceComments = 'map';
    options.sourceMap = options.outputFile + '.map';
  }
  this.options = options;
};

SASSPlugin.prototype.toTree = function(tree, inputPath, outputPath) {
  var trees = [tree];
  if (this.options.includePaths) trees = trees.concat(this.options.includePaths);
  inputPath += '/' + this.options.inputFile;
  outputPath += '/' + this.options.outputFile;
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
  options.outputFile = options.outputFile || this.project.name() + '.css';
  app.registry.add('css', new SASSPlugin(options));
};

module.exports = EmberCLISASS;
