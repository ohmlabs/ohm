module.exports = function(grunt) {
  'use strict';
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var webpack       = require("webpack");
  var webpackConfig = require('./webpack.config.js');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost',
          'web-port': 8090,
          'debug-port': 5959,
          'save-live-edit': true,
          'preload': false,
          'hidden': ['node_modules'],
          'stack-trace-limit': 5,
        }
      }
    },

    webpack: {
      options: webpackConfig,
      build: {
        plugins: [
          new webpack.DefinePlugin({
            'process.env':{
              'NODE_ENV': JSON.stringify('production')
            }
          }),
          new webpack.optimize.UglifyJsPlugin({minimize: true}),
          new webpack.optimize.DedupePlugin(),
        ]
      },
      'build-dev': {
        devtool: "sourcemap",
        debug: true
      }
    },

    copy: {
      main: {
        expand: true,
        src: '**',
        cwd: 'lib/dist',
        dest: 'lib/ghost/content/themes/ohm/assets/',
      },
    },

    watch: {
      sass: {
        files: 'client/**/*.sass',
        tasks: ''
      },
      babel: {
        files: 'client/js/{,*/}*.js',
        tasks: ['babel', 'webpack']
      },
      livereload: {
        options: {
          livereload: 35778
        },
        files: ['lib/dist/assets/js/**/*.js', 'lib/views/**/*.pug', 'lib/dist/css/**/*.css'],
      },
    },
  });

  grunt.registerTask('default', [
    'webpack:build-dev',
    'copy'
  ]);

  grunt.registerTask('prod', [
    'webpack:build',
    'copy'
  ]);

};
