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
    fileName: 'build-manifest.json' // FIXME put this in config
  }),
]

const query = {
  mozjpeg: {
    optimizationLevel: 7,
    progressive: true,
  },
  gifsicle: {
    optimizationLevel: 7,
    interlaced: false,
  },
  optipng: {
    optimizationLevel: 7,
  },
  pngquant: {
    optimizationLevel: 7,
  },
};

if (production){
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: true
    }
  }));
} else {
  query.bypassOnDebug = true
}

let options = {
  devtool: "source-map",
  node: {
    fs: "empty",
    tls: 'empty',
    net: 'empty',
    child_process: 'empty',
    module: 'empty',
  },
  entry: clientFiles,
  context: __dirname,
  output: {
    path: path.join(__dirname, staticPath),
    filename: !production ? './[name].bundle.js' : './[name].[chunkhash:8].js',
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
      loader: !production ? 'style-loader!raw-loader!sass-loader'
        + '?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
        + '&includePaths[]=' + path.resolve(__dirname, './node_modules/bootstrap-sass/assets/stylesheets')
        + '&includePaths[]=' + path.resolve(__dirname, './lib/client/sass/') : ExtractTextPlugin.extract('css!sass'),
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'url-loader?limit=10240&name=/img/[hash].[ext]',
        `image-webpack-loader?${JSON.stringify(query)}`,
      ]
    }]
  },
  plugins: plugins,
}

if (!production) {
  options.devtool = 'eval-source-map';
}

module.exports = options;
