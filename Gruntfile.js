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

    copy: {
      bootstrap: {
        cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap',
        expand: true,
        src: '**',
        dest: 'lib/dist/lib/bootstrap/fonts/',
      },
      ghost: {
        expand: true,
        src: '**',
        cwd: 'lib/dist',
        dest: 'lib/ghost/content/themes/ohm/assets/',
      },
    },

    watch: {
      sass: {
        files: 'lib/client/**/*.sass',
        tasks: ['webpack:build-dev', 'copy']
      },
      babel: {
        files: 'lib/client/js/{,*/}*.js',
        tasks: ['webpack:build-dev', 'copy']
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
