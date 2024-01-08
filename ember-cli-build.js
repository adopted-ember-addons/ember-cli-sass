/* eslint-env node */
"use strict";

const EmberAddon = require("ember-cli/lib/broccoli/ember-addon");
const sass = require("sass");

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    outputPaths: {
      app: {
        css: {
          app: "/assets/dummy.css",
          "output-path": "/assets/output-path.css",
        },
      },
    },
    sassOptions: {
      implementation: sass,
      includePaths: ["node_modules/spinkit/scss"],
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
