const path       = require('path');
const webpack    = require("webpack");
module.exports = [{
  entry: {
    ohm: './sample/client/js/ohm.react.js'
  },
  context: __dirname,
  output: {
    path: path.join(__dirname, 'ohm/dist/assets/js'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [{
      test: /\.react.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        cacheDirectory: './.babel-loader/'
      }
    }, {
      test: /\.sass$/,
      loader: 'style-loader!raw-loader!sass-loader'
        + '?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
        + '&includePaths[]=' + path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
        + '&includePaths[]=' + path.resolve(__dirname, './ohm/client/sass/')
    }]
  }
}];
