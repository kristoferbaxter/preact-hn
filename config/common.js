const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const autoprefixer = require('autoprefixer');

const IN_PRODUCTION = process.env.NODE_ENV === 'production';
const IN_DEVELOPER_MODE = process.env.BUNDLE_ENV === 'dev'; // New!
const CSS_LOADER_OPTIONS = {
  modules: true,
  localIdentName: '[hash:base64:8]',
  minimize: true,
  camelCase: false,
  importLoaders: 1
};
const POSTCSS_LOADER_OPTIONS = (browsers=["last 3 versions"]) => {
  return {
    plugins: function() {
      return [
        autoprefixer({
          browsers: browsers
        })
      ];
    } 
  }; 
};

const ExtractCSSPlugin = new ExtractTextPlugin({
  filename: 'bundle.[name].[chunkhash].css',
  allChunks: true // This is not ideal. However, Extract-Text doesn't support extractng the per bundle css. 
});
const BabiliMinification = new BabiliPlugin();
const ZopfliCompression = new CompressionPlugin({
  asset: "[path].gzip[query]",
  algorithm: "zopfli",
  test: /\.(js|css)$/
});
const BrotliCompression = new BrotliPlugin({
  asset: '[path].br[query]',
  test: /\.(js|css)$/,
  mode: 0,
  quality: 11
});
const CleanupPlugin= new WebpackCleanupPlugin({
  exclude: ['webpack.json', '.gitignore'],
  quiet: true
});

const EntryPoints = {
  'application': './src/client.js'
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
  warnings: false
};

const BabelLoaderRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true
    }
  }
};
const CSSLoaderRule = (browsers) => {
  return {
    test: /\.css$/,
    exclude: /node_modules/,
    use: ExtractCSSPlugin.extract({
      fallback: 'style-loader',
      use: [
        { loader: 'css-loader', options: CSS_LOADER_OPTIONS },
        { loader: 'postcss-loader', options: POSTCSS_LOADER_OPTIONS(browsers) }
      ]
    })
  };
};

module.exports = {
  IN_PRODUCTION,
  CSS_LOADER_OPTIONS,
  ExtractCSSPlugin,
  EntryPoints,
  WebpackStats,
  BabelLoaderRule,
  CSSLoaderRule,
  BabiliMinification,
  ZopfliCompression,
  BrotliCompression,
  CleanupPlugin
}