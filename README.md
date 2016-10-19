# ember-cli-sass

[![npm version](https://badge.fury.io/js/ember-cli-sass.svg)](https://www.npmjs.com/package/ember-cli-sass)
[![Tests](https://travis-ci.org/aexmachina/ember-cli-sass.svg)](https://travis-ci.org/aexmachina/ember-cli-sass)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-sass.svg)](http://emberobserver.com/addons/ember-cli-sass)
[![Dependency Status](https://david-dm.org/aexmachina/ember-cli-sass.svg)](https://david-dm.org/aexmachina/ember-cli-sass)

ember-cli-sass uses libsass to preprocess your ember-cli app's files and provides support for source maps and include paths. It provides support for the common use case for Ember.js projects:

- Source maps by default in development
- Support for [`outputPaths` configuration](http://ember-cli.com/user-guide/#configuring-output-paths)
- Provides the ability to specify include paths
- Edit SASS in Chrome Dev Tools

## Installation

```
ember install ember-cli-sass
```

### Addon Development

If you want to use ember-cli-sass in an addon and you want to distribute the compiled CSS it must be installed as a `dependency` so that `addon/styles/addon.scss` is compiled into `dist/assets/vendor.css`. This can be done using:

```bash
npm install --save ember-cli-sass
```

## Usage

By default this addon will compile `app/styles/app.scss` into `dist/assets/app.css` and produce
a source map for your delectation.

If you want more control then you can specify options using the
`sassOptions` config property in `ember-cli-build.js` (or in `Brocfile.js` if you are using an Ember CLI version older than 1.13):

```javascript
var app = new EmberApp({
  sassOptions: {...}
});
```

- `includePaths`: an array of include paths
- `onlyIncluded`: true/false whether to use only what is in `app/styles` and `includePaths`. This may helps with performance, particularly when using NPM linked modules
- `sourceMap`: controls whether to generate sourceMaps, defaults to `true` in development. The sourceMap file will be saved to `options.outputFile + '.map'`
- `extension`: specifies the file extension for the input files, defaults to `scss`. Set to `sass` if you want to use `.sass` instead.
- `nodeSass`: Allows a different version of [node-sass](https://www.npmjs.com/package/node-sass) to be used (see below)
- See [broccoli-sass-source-maps](https://github.com/aexmachina/broccoli-sass-source-maps) for a list of other supported options.

### Processing multiple files

If you need to process multiple files, it can be done by [configuring the output paths](http://ember-cli.com/user-guide/#configuring-output-paths) in your `ember-cli-build.js`:

```js
var app = new EmberApp({
  outputPaths: {
    app: {
      css: {
        'app': '/assets/application-name.css',
        'themes/alpha': '/assets/themes/alpha.css'
      }
    }
  }
});
```

### Choosing the version of node-sass

You can specify which version of node-sass to use with the [`nodeSass` option](https://github.com/aexmachina/broccoli-sass-source-maps#usage).

Add the version that you want to use to _your_ package.json and then provide that version of the module using the `nodeSass` option:

```js
var nodeSass = require('node-sass'); // loads the version in your package.json

var app = new EmberApp({
  sassOptions: {
    nodeSass: nodeSass
  }
});
```

### Source Maps

Source maps work for reading with no configuration, but to edit the SASS in the Dev Tools
you need to configure your Workspace:

1. Open app.scss in Dev Tools (you can use ⌘P and search for "app.scss")
1. Right click in the Sources panel on the right of the Sources tab and
  select _Add Folder to Workspace_
1. Select the root directory of your project
1. Right click on app.scss and select _Map to File System Resource..._
1. Select app.scss from your project directory

## Example

The following example assumes your bower packages are installed into `bower_components/`.

Install some SASS:

```shell
bower install --save foundation
```

Specify some include paths in your `ember-cli-build.js`:

```javascript
var app = new EmberApp({
  sassOptions: {
    includePaths: [
      'bower_components/foundation/scss'
    ]
  }
});
```

Import some deps into your app.scss:

```scss
@import 'foundation'; /* import everything */
/* or just import the bits you need: @import 'foundation/functions'; */
```

## Addon Usage

To compile SASS within an ember-cli addon, there are a few additional steps:

1. Include your styles in `addon/styles/addon.scss`.

2. Ensure you've installed `ember-cli-sass` under `dependencies` in your
   `package.json`.

3. Define an `included` function in your app:
   ```js
   // in your index.js
   module.exports = {
     name: 'my-addon',
     included: function(/* app */) {
       this._super.included.apply(this, arguments);
     }
   };
   ```

   If you omit this step, it will throw the following error:
   ```
   Cannot read property 'sassOptions' of undefined
   TypeError: Cannot read property 'sassOptions' of undefined
   at Class.module.exports.sassOptions (~/my-plugin/node_modules/ember-cli-sass/index.js:43:48)
   ```

4. Make sure your dummy app contains an `app.scss`

5. If you run `ember build dist`, your styles from `addon/styles/addon.scss`
   should appear correctly in `dist/assets/vendor.css`

## Alternative Addon Usage

As an alternative to the above, some addons may choose to allow their SASS to be  used in
the parent app, rather than the compiled CSS. This has the advantage of easily allowing
users to use and override your SASS. The steps for this setup are as follows:

1. Instead of including your styles in `addon/styles/addon.scss`, place them in
  `app/styles/your-addon-name.scss`. Document that your user can now add
  `@import 'your-addon-name';` to their `app.scss` file. In the lines before this import
  they can choose to override any variables your addon marks with
  [default](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variable_defaults_).
2. Ensure steps 2, 3 and 4 are completed as per the standard addon usage section above.
