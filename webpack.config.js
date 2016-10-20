// FIXME this is hard coded which is a little problematic
var path       = require('path');
var webpack    = require('webpack');
module.exports = {
  devtool: 'source-map',
  entry: {
    index: './static/assets/js/index.js',
  },
  output: {
    // Make sure to use [name] or [id] in output.filename
    //  when using multiple entry points
    filename: './static/assets/js/[name].bundle.js',
    chunkFilename: './static/assets/js/[id].bundle.js'
  },
  module: {
    loaders: [{
      test: /\.react.js?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
