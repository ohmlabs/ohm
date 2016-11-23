(function () {
  'use strict';

  var base,
      path    = require('path'),
      _       = require('underscore'),
      envFlag = process.argv[2];

  switch (envFlag) {
  case '-p':
    process.env.NODE_ENV= 'production';
    base = {
      env             : 'production',
      host            : 'localhost',
      port            : '8888',
      development     : false,
    };
    break;
  default:
    base = {
      env             : 'development',
      host            : 'localhost',
      port            : '8888',
    };
  }
  _.extend(base, {
    ROUTES                    : path.join(__dirname, '../routes/site.js'),
    GHOST_PATH                : '/blog',
    GHOST_CONFIG_PATH         : path.join(__dirname, './ghost.config.js'),
    SOCKETS                   : path.join(__dirname, '../routes/sockets.js'),
  });

  module.exports = base;
}());
