# ember-cli-sass

[![Join the chat at https://gitter.im/aexmachina/ember-cli-sass](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aexmachina/ember-cli-sass?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Use node-sass to preprocess your ember-cli app's files, with support for source maps and include paths.

## Installation

```
npm install --save-dev ember-cli-sass
```

## Usage

By default this addon will compile `app/styles/app.scss` into `dist/assets/app.css` and produce a source map for your delectation.

Or, if you want more control then you can specify options using the
`sassOptions` config property in `config/environment.js`:

```javascript
ENV.sassOptions =  {...}
```

- `.inputFile`: the input SASS file, defaults to `app.scss`
- `.outputFile`: the output CSS file, defaults to `app.css`
- `.includePaths`: an array of include paths
- `.sourceMap`: controls whether to generate sourceMaps, defaults to `true` in development. The sourceMap file will be saved to `options.outputFile + '.map'`

### ember-cli versions prior to 0.2.0

In older versions of ember-cli the `sassOptions` config property should be added to the `EmberApp` constructor in `Brocfile.js`:

```javascript
var app = new EmberApp({
  ...
  sassOptions: {...}
});
```

## Example

The following example assumes your bower packages are installed into `bower_components/`.

Install some SASS:

```shell
bower install --save foundation
```

Specify some include paths in `config/environment.js`:

```javascript

ENV.sassOptions = {
  includePaths: [
    'bower_components/foundation/scss'
  ]
}
```

Import some deps into your app.scss:

```scss
@import 'foundation'; /* import everything */
/* or just import the bits you need: @import 'foundation/functions'; */
```

## Source Maps

Be aware that there are [some issues with source maps](https://github.com/joliss/broccoli-sass/issues/39) in broccoli-sass. The source maps it generates will at least show you the source file names and line number in your dev tools. When we've got a better solution in broccoli-sass you'll be able to click through to view and update the SASS files in the dev tools \o/.
