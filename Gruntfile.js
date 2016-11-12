module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  const webpack       = require("webpack");
  const webpackConfig = require('./webpack.config.js');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost',
          'web-port': 8090,
          'debug-port': 5967,
          'save-live-edit': true,
          'preload': false,
          'hidden': ['node_modules'],
          'stack-trace-limit': 5,
        },
      },
    },

    webpack: {
      options: webpackConfig,
      build: {
        plugins: [
          new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
          }),
          new webpack.optimize.UglifyJsPlugin({
            minimize: true
          }),
          new webpack.optimize.DedupePlugin(),
        ]
      },
      'build-dev': {
        devtool: "eval",
        debug: true,
      },
    },

    watch: {
      client: {
        files: [
          'examples/basic/client/js/{,*/}*.js',
          'examples/basic/client/sass/{,*/}*.sass',
          'lib/client/js/{,*/}*.js',
          'lib/client/sass/{,*/}*.sass',
        ],
        tasks: ['webpack:build-dev'],
      },
      livereload: {
        options: {
          livereload: 35777,
        },
        files: 'lib/dist/assets/js/{,*/}*.js',
      },
    },

    copy: {
      bootstrap: {
        cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap',
        expand: true,
        src: '**',
        dest: 'node_modules/ohm/lib/dist/lib/bootstrap/fonts/',
      },
      main: {
        expand: true,
        src: '**',
        cwd: 'lib/dist',
        dest: 'lib/ghost/content/themes/ohm/assets/',
      },
    },

    coveralls: {
      // Options relevant to all targets
      options: {
        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: false
      },

      your_target: {
        // LCOV coverage file (can be string, glob or array)
        src: 'coverage/extra-results-*.info',
        options: {
          // Any options for just this target
        }
      },
    },

  });

  grunt.registerTask('default', [
    'webpack:build-dev',
    'copy',
  ]);

  grunt.registerTask('prod', [
    'webpack:build',
    'copy',
  ]);

};
