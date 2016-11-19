(function () {
  'use strict';

  var base,
      path    = require('path'),
      _       = require('underscore'),
      envFlag = process.argv[2];

  switch (envFlag) {
  case '-p':
    base = {
      env             : 'production',
      host            : 'localhost',
      port            : '8888',
      MONGO_HOST      : 'mongo',
      REDIS_HOST      : 'redis',
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
    SOCKETS                   : path.join(__dirname, '../routes/sockets.js'),
  });

  module.exports = base;
}());
