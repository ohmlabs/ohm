const staticPath = 'lib/dist';

const webpack           = require('webpack');
const ManifestPlugin    = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs                = require('fs');
const path              = require('path');
const clientConfig      = path.join(__dirname, 'examples/basic/client/client.config.json');
const clientFiles       = JSON.parse(fs.readFileSync(clientConfig, { encoding: 'utf-8' }));
const production        = process.env.NODE_ENV === 'production';
const plugins           = [
  new ExtractTextPlugin((production ? '[name].[contenthash].css' : '[name].bundle.css')),
  new ManifestPlugin({
    fileName: 'build-manifest.json'
  }),
]

if (production){
  plugins.push(new webpack.optimize.DedupePlugin())
  plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = [{
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ],
},{
  devtool: "source-map",
  node: {fs: "empty"},
  entry: clientFiles,
  context: __dirname,
  output: {
    path: path.join(__dirname, staticPath),
    filename: !production ? '[name].bundle.js' : '[name].[chunkhash:8].js',
    chunkFilename: "[id].bundle.js",
  },
  module: {
    loaders: [{
      test: /\.react.js?$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        cacheDirectory: './.babel-loader/',
      }
    }, {
      test: /\.sass$/,
      loader: !production ? 'style!raw!sass'
        + '?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
        + '&includePaths[]=' + path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
        + '&includePaths[]=' + path.resolve(__dirname, './lib/client/sass/') : ExtractTextPlugin.extract('css!sass'),
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }]
  },
  plugins: plugins,
}];
