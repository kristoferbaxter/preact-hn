const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CommonOptions = require('./common.js');

const BROWSER_NAME = 'firefox';
const BROWSER_MIN_SUPPORTED_VERSION = 55;

module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
        },
      },
    },
    minimize: false,
  },
  entry: CommonOptions.EntryPoints,
  output: {
    filename: 'bundle.[name].[chunkhash].js',
    path: path.resolve(__dirname, '..', 'dist', BROWSER_NAME),
    publicPath: `/dist/${BROWSER_NAME}/`,
    chunkFilename: 'bundle.[name].[chunkhash].js',
  },
  stats: CommonOptions.WebpackStats,
  module: {
    rules: [
      CommonOptions.BabelLoaderRule,
      CommonOptions.TSLoaderRule,
      CommonOptions.CSSLoaderRule(`${BROWSER_NAME} ${BROWSER_MIN_SUPPORTED_VERSION}`),
    ],
  },
  resolve: {
    extensions: CommonOptions.ResolveExtensions,
    alias: CommonOptions.ResolveAliases,
  },
  plugins: [
    CommonOptions.CleanupPlugin,
    new webpack.DefinePlugin({
      DO_NOT_TRACK: 'navigator.doNotTrack',
      POLYFILL_OBJECT_ASSIGN: false,
      POLYFILL_OBJECT_VALUES: false,
      POLYFILL_PROMISES: false,
      POLYFILL_FETCH: false,
      POLYFILL_URL: false,
      ALLOW_OFFLINE: false,
      IS_CLIENT: true,
    }),
    new CopyWebpackPlugin([{from: 'src/core/manifest.json'}], {copyUnmodified: true}),
    CommonOptions.ExtractCSSPlugin,
  ],
};
