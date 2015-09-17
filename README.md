# ember-cli-sass


ember-cli-sass uses libsass to preprocess your ember-cli app's files and provides support for source maps and include paths. It provides support for the common use case for Ember.js projects:

- Source maps by default in development
- Support for [`outputPaths` configuration](http://www.ember-cli.com/#configuring-output-paths)
- Detects whether to use .scss or .sass file extensions
- Provides the ability to specify include paths

## Installation

```
npm install --save-dev ember-cli-sass
```

## Usage

By default this addon will compile `app/styles/app.scss` or `app/styles/app.sass` into `dist/assets/app.css` and produce 
a source map for your delectation.

If you want more control then you can specify options using the
`sassOptions` config property in `ember-cli-build.js` (or in `Brocfile.js` if you are using an Ember CLI version older than 1.13):

```javascript
var app = new EmberApp({
  sassOptions: {...}
});
```

- `includePaths`: an array of include paths
- `sourceMap`: controls whether to generate sourceMaps, defaults to `true` in development. The sourceMap file will be saved to `options.outputFile + '.map'`
- `extension`: optionally specify the file extension for the input files. If not specified then the filesystem is checked for the existence of an `scss` or `sass` file
- See [broccoli-sass-source-maps](https://github.com/joliss/broccoli-sass-source-maps) for a list of other supported options.

### Processing multiple files

If you need to process multiple files, it can be done by [configuring the output paths](http://www.ember-cli.com/#configuring-output-paths) in your `ember-cli-build.js`:

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

### Using in addons

To use `ember-cli-sass` for an addon's dummy app, explicitly specify the `extension` option in your `ember-cli-build.js`:

```js
var app = new EmberApp(defaults, {
  sassOptions: {
    extension: 'scss' // or sass
  }
});
```

### Upgrading from a previous version

In a previous versions the `sassOptions` config property was incorrectly moved to the `config/environment.js` file. This usage is deprecated, and you should specify the config in the `ember-cli-build.js`.

In versions of Ember CLI before 1.13 the `sassOptions` config property was placed in `Brocfile.js`, this has since been deprecated. If you are upgrading from an older verion of Ember CLI move your `sassOptions` to `ember-cli-build.js` and remove your Brocfile. For more information check out the [Ember CLI Brocfile transition guide](https://github.com/ember-cli/ember-cli/blob/master/TRANSITION.md#brocfile-transition).

If you were using the `inputFile` and `outputFile` options, this is now done by [configuring the output paths](http://www.ember-cli.com/#configuring-output-paths) in `ember-cli-build.js`.

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
     included: function(app) {
       this._super.included(app);
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

For an example of an addon that does this correctly, see
[ember-cli-notifications](https://github.com/Blooie/ember-cli-notifications)

## Source Maps

Be aware that there are [some issues with source maps](https://github.com/joliss/broccoli-sass/issues/39) in broccoli-sass. The source maps it generates will at least show you the source file names and line number in your dev tools. When we've got a better solution in broccoli-sass you'll be able to click through to view and update the SASS files in the dev tools \o/.
