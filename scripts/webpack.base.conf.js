const path = require('path');
const webpack = require('webpack');
const BabiliWebpackPlugin = require('babili-webpack-plugin');
const vueLoaderConfig = require('./vue-loader.conf');
const { IS_DEV, styleRule } = require('./utils');
const DIST = 'dist';
const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    DEBUG: IS_DEV ? 'true' : 'false', // whether to log message errors
  },
});

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  output: {
    path: resolve(DIST),
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      src: resolve('src'),
    }
  },
  node: {
    Buffer: false,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      styleRule({
        fallback: 'vue-style-loader',
        loaders: ['postcss-loader'],
      }),
    ],
  },
  // cheap-module-eval-source-map is faster for development
  devtool: IS_DEV ? '#inline-source-map' : false,
  plugins: [
    definePlugin,
    !IS_DEV && new BabiliWebpackPlugin(),
  ].filter(Boolean),
};
