const path       = require('path');
const webpack    = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [{
  entry: {
    ohm: './examples/basic/client/js/ohm.react.js'
  },
  context: __dirname,
  output: {
    path: path.join(__dirname, 'lib/dist/assets/js'),
    filename: '[name].bundle.js',
    chunkFilename: "[id].bundle.js",
  },
  module: {
    loaders: [{
      test: /\.react.js?$/,
      exclude: /node_modules\/(?!(ohm|compass-mixins|bootstrap-sass)\/).*/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        cacheDirectory: './.babel-loader/'
      }
    }, {
      test: /\.sass$/,
      loader: process.env.NODE_ENV !== 'production' ? 'style!raw!sass'
        + '?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
        + '&includePaths[]=' + path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
        + '&includePaths[]=' + path.resolve(__dirname, './lib/client/sass/') :
      ExtractTextPlugin.extract('raw!css!sass'
        + '?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
        + '&includePaths[]=' + path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
        + '&includePaths[]=' + path.resolve(__dirname, './lib/client/sass/'))
    }],
  },
  plugins: [
    new ExtractTextPlugin("style.css")
  ],
}];
