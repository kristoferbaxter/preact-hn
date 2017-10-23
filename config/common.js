const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const autoprefixer = require('autoprefixer');

const IN_PRODUCTION = process.env.NODE_ENV === 'production';
const IN_DEVELOPER_MODE = process.env.BUNDLE_ENV === 'dev'; // New!
const CSS_LOADER_OPTIONS = {
  modules: true,
  localIdentName: '[hash:base64:4]',
  minimize: true,
  camelCase: 'only',
  importLoaders: 1,
};
const POSTCSS_LOADER_OPTIONS = (browsers = ['last 3 versions']) => {
  return {
    plugins: function() {
      return [
        autoprefixer({
          browsers: browsers,
        }),
      ];
    },
  };
};

const OptimizeJS = new OptimizeJsPlugin({
  sourceMap: false,
});
const ExtractCSSPlugin = new ExtractTextPlugin({
  filename: 'bundle.[name].[chunkhash].css',
  allChunks: true, // This is not ideal. However, Extract-Text doesn't support extractng the per bundle css.
});
const CleanupPlugin = new WebpackCleanupPlugin({
  exclude: ['webpack.json', '.gitignore'],
  quiet: true,
});

const EntryPoints = {
  application: './src/client.tsx',
};

const WebpackStats = {
  assets: true,
  cached: false,
  children: false,
  chunks: false,
  chunkModules: false,
  chunkOrigins: false,
  colors: true,
  errors: true,
  errorDetails: true,
  hash: false,
  modules: false,
  publicPath: true,
  reasons: false,
  source: false,
  timings: false,
  version: false,
  warnings: false,
};

const ResolveAliases = {
  preact: 'preact/src/preact.js',
  components: path.resolve(__dirname, '../src/components'),
  api: path.resolve(__dirname, '../src/api'),
  utils: path.resolve(__dirname, '../src/utils'),
  routes: path.resolve(__dirname, '../src/routes'),
  storage: path.resolve(__dirname, '../node_modules/@kristoferbaxter/hn-api/lib/storage'),
};
const ResolveExtensions = ['.ts', '.tsx', '.js', '.jsx'];

const TSLoaderRule = {
  test: /\.(ts|tsx)?$/,
  exclude: /node_modules/,
  use: {
    loader: 'ts-loader',
    options: {
      silent: true,
    },
  },
};
const BabelLoaderRule = {
  test: /\.(js|ts|tsx)$/,
  include: [
    fs.realpathSync('./src'),
    // fs.realpathSync('./node_modules/preact'),
    fs.realpathSync('./node_modules/@kristoferbaxter/hn-api/lib'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    },
  },
};
const CSSLoaderRule = browsers => {
  return {
    test: /\.css$/,
    include: [fs.realpathSync('./src')],
    use: ExtractCSSPlugin.extract({
      fallback: 'style-loader',
      use: [
        {loader: 'css-loader', options: CSS_LOADER_OPTIONS},
        {loader: 'postcss-loader', options: POSTCSS_LOADER_OPTIONS(browsers)},
      ],
    }),
  };
};

module.exports = {
  IN_PRODUCTION,
  CSS_LOADER_OPTIONS,
  ExtractCSSPlugin,
  EntryPoints,
  WebpackStats,
  TSLoaderRule,
  BabelLoaderRule,
  CSSLoaderRule,
  OptimizeJS,
  ResolveExtensions,
  ResolveAliases,
  CleanupPlugin,
};
