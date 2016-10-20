(function () {
  'use strict';

  var base,
      _       = require('underscore'),
      envFlag = process.argv[2];

  switch (envFlag) {
  case '-p':
    base = {
      env             : 'production',
      host            : 'ohm.fm',
      port            : '8888',
      // Mongodb
      MONGODB_INSTANCE: 'mongodb://localhost:27017/ohm',
      getBaseDomain   : function () {
        return 'https://' + base.host;
      },
    };
    break;
  default:
    base = {
      env             : 'development',
      host            : 'localhost',
      port            : '8888',
      // Mongodb
      MONGODB_INSTANCE: 'mongodb://localhost:27017/ohm',
      getBaseDomain   : function () {
        return 'http://' + base.host + ':' + base.port;
      },
    };
  }
  _.extend(base, {
    // AWS
    AWS_ACCESS_KEY            : 'OHMTEST',
    AWS_SECRET_KEY            : 'OHMTEST',
    // Parse
    PARSE_SERVER_URL          :  base.getBaseDomain() + '/parse',
    PARSE_APPLICATION_ID      : 'OHMTEST',
    PARSE_JAVASCRIPT_KEY      : 'OHMTEST',
    PARSE_MASTER_KEY          : 'OHMTEST',
    // Socket.io
    SOCKETIO_SESSION_SECRET   : 'OHMTEST',
    PRIMARY_ACCOUNT_KEY       : '',
    GHOST_PATH                : '/blog',
    PARSE_PATH                : '/parse',
  });

  module.exports = base;
}());
