const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CommonOptions = require('./common.js');

let nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => nodeModules[mod] = 'commonjs ' + mod);

module.exports = {
  entry: {
    'server': './src/restify/index.js',
    'background': './src/restify/storage/background.js'
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '..', 'dist', 'server'),
    filename: 'restify.[name].js'
  },
  stats: CommonOptions.WebpackStats,
  module: {
    rules: [
      CommonOptions.BabelLoaderRule,
      CommonOptions.CSSLoaderRule()
    ]
  },
  externals: nodeModules,
  plugins: [
    CommonOptions.CleanupPlugin,
    new webpack.DefinePlugin({
      IS_CLIENT: false,
    }),
    new CopyWebpackPlugin([
      {from: 'static', to: 'static'},
      {from: 'proxy/cert.pem'},
      {from: 'proxy/h2o.config.yaml'},
      {from: 'proxy/key.pem'}
    ], {copyUnmodified: true}),
    CommonOptions.ExtractCSSPlugin
  ]
}