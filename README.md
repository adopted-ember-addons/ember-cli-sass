# ember-cli-sass

Use node-sass to preprocess your ember-cli app's files, with support for sourceMaps and include paths.

## Installation

```
npm install --save-dev ember-cli-sass
```

## Usage

By default this addon will compile `app/styles/app.scss` into `dist/assets/app.css` and produce a sourceMap for your delectation.

Or, if you want more control then you can specify options using the `sassOptions` config property:

```
var app = new EmberApp({
  ...
  sassOptions: {...}
});
```

- `.inputFile`: the input SASS file, defaults to `app.scss`
- `.outputFile`: the output CSS file, defaults to `app.css`
- `.includePaths`: an array of include paths
- `.sourceMap`: controls whether to generate sourceMaps, defaults to `true` in development. The sourceMap file will be saved to `options.outputFile + '.map'`