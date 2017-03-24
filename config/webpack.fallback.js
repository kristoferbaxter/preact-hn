const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeJsPlugin = require("optimize-js-plugin");
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
      POLYFILL_PROMISES: true,
      POLYFILL_FETCH: true
    }),
    new BabiliPlugin({unsafe: false}),
    new OptimizeJsPlugin({sourceMap: false}),
    CommonOptions.ExtractCSSPlugin,
    CommonOptions.ZopfliCompression
  ]
};