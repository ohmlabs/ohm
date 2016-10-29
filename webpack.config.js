const path       = require('path');
const webpack    = require("webpack");
module.exports = [{
  entry: {
    ohm: './client/js/ohm.react.js'
  },
  context: __dirname,
  output: {
    path: path.join(__dirname, 'static/assets/js'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [{
      test: /\.react.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }, {
      test: /\.sass$/,
      loader: 'style-loader!raw-loader!sass-loader'
        + '?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
        + '&includePaths[]=' + path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
    }]
  }
}];
