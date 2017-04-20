const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require('babili-webpack-plugin');
const CommonOptions = require('./common.js');

const BROWSER_NAME = 'fallback';

module.exports = {
  entry: CommonOptions.EntryPoints,
  output: {
    filename: 'bundle.[name].[chunkhash].js',
    path: path.resolve(__dirname, '..', 'dist', BROWSER_NAME),
    publicPath: `/dist/${BROWSER_NAME}/`,
    chunkFilename: 'bundle.[name].[chunkhash].js'
  },
  stats: CommonOptions.WebpackStats,
  module: {
    rules: [
      CommonOptions.BabelLoaderRule,
      CommonOptions.CSSLoaderRule()
    ]
  },
  plugins: [
    CommonOptions.CleanupPlugin,
    new webpack.DefinePlugin({
      POLYFILL_OBJECT_ASSIGN: true,
      POLYFILL_OBJECT_VALUES: true,
      POLYFILL_PROMISES: true,
      POLYFILL_FETCH: true,
      POLYFILL_URL: true,
      ALLOW_OFFLINE: false
    }),
    //new BabiliPlugin({unsafe: false}),
    CommonOptions.ExtractCSSPlugin,
    CommonOptions.ZopfliCompression
  ]
};