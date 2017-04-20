const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const CommonOptions = require('./common.js');

const BROWSER_NAME = 'chrome';
const BROWSER_MIN_SUPPORTED_VERSION = 52;

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
      ALLOW_OFFLINE: true
    }),
    new CopyWebpackPlugin([
      {from: 'src/core/manifest.json'}
    ], {copyUnmodified: true}),
    CommonOptions.BabiliMinification,
    CommonOptions.ExtractCSSPlugin,
    new OfflinePlugin({
      cacheMaps: [{
        match: function(requestUrl) {
          return new URL('/shell', location);
        },
        requestTypes: ['navigate']
      }],
      caches: 'all',
      externals: ['/shell'],
      excludes: ['**/.*', '**/*.map', '**/*.js.br', '**/*.js.gzip', '**/*.css', '**/*.css.br', '**/*.css.gzip'],
      autoUpdate: false,
      AppCache: false,
      ServiceWorker: {
        publicPath: '/sw.js'
      }
    }),
    CommonOptions.ZopfliCompression,
    CommonOptions.BrotliCompression
  ]
};