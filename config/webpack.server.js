const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CommonOptions = require('./common.js');

let nodeModules = {};
fs
  .readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => (nodeModules[mod] = 'commonjs ' + mod));

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
  entry: {
    server: './src/server/index',
    background: './node_modules/@kristoferbaxter/hn-api/lib/storage/background',
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '..', 'dist', 'server'),
    filename: 'restify.[name].js',
  },
  stats: CommonOptions.WebpackStats,
  module: {
    rules: [CommonOptions.BabelLoaderRule, CommonOptions.TSLoaderRule, CommonOptions.CSSLoaderRule()],
  },
  externals: nodeModules,
  resolve: {
    extensions: CommonOptions.ResolveExtensions,
    alias: CommonOptions.ResolveAliases,
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_CLIENT: false,
    }),
    new webpack.DefinePlugin({
      IS_CLIENT: false,
    }),
    CommonOptions.ExtractCSSPlugin,
  ],
};
