(function () {
  'use strict';

  var base,
      _       = require('underscore'),
      envFlag = process.argv[2];

  switch (envFlag) {
  case '-p':
    base = {
      env             : 'production',
      host            : 'localhost',
      port            : '8888',
      MONGO_PORT      : '27017',
      MONGO_HOST      : 'mongo',
      REDIS_PORT      : '6379',
      REDIS_HOST      : 'redis',
    };
    break;
  default:
    base = {
      env             : 'development',
      host            : 'localhost',
      port            : '8888',
      MONGO_PORT      : '27017',
      MONGO_HOST      : 'localhost',
      REDIS_PORT      : '6379',
      REDIS_HOST      : 'localhost',
    };
  }
  _.extend(base, {
    // AWS
    AWS_ACCESS_KEY            : 'OHMTEST',
    AWS_SECRET_KEY            : 'OHMTEST',
    // MongoDB instance
    MONGODB_INSTANCE          : 'mongodb://' + base.MONGO_HOST + ':' + base.MONGO_PORT + '/' + base.MONGO_DB,
    // Parse
    PARSE_SERVER_URL          : 'http://' + base.host + ':' + base.port+ '/parse',
    PARSE_APPLICATION_ID      : 'OHMTEST',
    PARSE_JAVASCRIPT_KEY      : 'OHMTEST',
    PARSE_MASTER_KEY          : 'OHMTEST',
    // Socket.io
    SOCKETIO_SESSION_SECRET   : 'OHMTEST',
    // This is the main account for ViewerContext
    PRIMARY_ACCOUNT_KEY       : '',
    // Custom Config
    PARSE_PATH                : '/parse',
    PARSE_DASHBOARD           : '/dashboard',
    GHOST_PATH                : '/blog',
    GHOST_CONFIG              : '/sample/ghost/config.js',
    SESSION_KEY               : 'ojxsid',
    MONGO_DB                  : 'ohm',
    AWS_BUCKET_NAME           : 'ohmdev',
  });

  module.exports = base;
}());
