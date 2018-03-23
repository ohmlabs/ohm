(function () {
  'use strict';

  var base,
      path    = require('path'),
      _       = require('lodash'),
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
    ROUTES            : path.join(__dirname, '../routes/site.js'),
    SOCKETS           : path.join(__dirname, '../routes/sockets.js'),
    SESSION_KEY       : 'OHMTEST',
    PARSE_SERVER_URL  : 'http://localhost:8888/parse',
  });

  module.exports = base;
}());
