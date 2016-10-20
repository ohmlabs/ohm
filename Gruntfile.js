module.exports = function(grunt) {
  'use strict';
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var webpackConfig = require('./webpack.config.js');
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015', 'react']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'client/js',
          dest: 'static/assets/js',
          src: '**/*.js'
        }]
      }
    },

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
      webpack: webpackConfig
    },

    'webpack-dev-server': {
      options: {
        webpack: webpackConfig,
        publicPath: '/' + webpackConfig.output.publicPath
      },
      start: {
        keepAlive: true,
        webpack: {
          devtool: 'eval',
          debug: true
        }
      }
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
        files: ['static/assets/js/**/*.js', 'ohm/views/**/*.pug', 'static/css/**/*.css'],
      },
    },
  });

  grunt.registerTask('default', [
    'babel',
    'webpack'
  ]);

  grunt.registerTask('prod', [
    'babel',
    'webpack',
  ]);

};
