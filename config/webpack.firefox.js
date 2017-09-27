const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CommonOptions = require('./common.js');

const BROWSER_NAME = 'firefox';
const BROWSER_MIN_SUPPORTED_VERSION = 55;

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
      CommonOptions.CSSLoaderRule(`${BROWSER_NAME} ${BROWSER_MIN_SUPPORTED_VERSION}`)
    ]
  },
  plugins: [
    CommonOptions.CleanupPlugin,
    new webpack.DefinePlugin({
      POLYFILL_OBJECT_ASSIGN: false,
      POLYFILL_OBJECT_VALUES: false,
      POLYFILL_PROMISES: false,
      POLYFILL_FETCH: false,
      POLYFILL_URL: false,
      ALLOW_OFFLINE: false,
      IS_CLIENT: true,
    }),
    new CopyWebpackPlugin([
      {from: 'src/core/manifest.json'}
    ], {copyUnmodified: true}),
    new webpack.optimize.ModuleConcatenationPlugin(),
    CommonOptions.ExtractCSSPlugin,
  ]
};