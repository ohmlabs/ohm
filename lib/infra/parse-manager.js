(function() {
  'use strict';


  const baseManager    = require('./base-manager');
  const ParseServer    = require('parse-server').ParseServer;
  const ParseDashboard = require('parse-dashboard');
  const S3Adapter      = require('parse-server').S3Adapter;
  const parseManager   = Object.assign({}, baseManager, {
    configureCommon(nconf, app, io) {
      app.use(nconf.get('PARSE_PATH'), new ParseServer({
        databaseURI: nconf.get('MONGODB_INSTANCE'),
        appId: nconf.get('PARSE_APPLICATION_ID'),
        masterKey: nconf.get('PARSE_MASTER_KEY'),
        serverURL: 'http://' + nconf.get('host') + ':' + nconf.get('port') + nconf.get('PARSE_PATH'),
        filesAdapter: new S3Adapter(
          nconf.get('AWS_ACCESS_KEY'),
          nconf.get('AWS_SECRET_KEY'),
          nconf.get('AWS_BUCKET_NAME'), {
            directAccess: true
          }
        ),
      }));
    },

    configureDevelopmentEnv(nconf, app, io) {
      if (nconf.get('PARSE_DASHBOARD')) {
        app.use(nconf.get('PARSE_DASHBOARD'), new ParseDashboard({
          'apps': [{
            'serverURL': nconf.get('PARSE_SERVER_URL'),
            'appId': nconf.get('PARSE_APPLICATION_ID'),
            'masterKey': nconf.get('PARSE_MASTER_KEY'),
            'appName': nconf.get('MONGO_DB')
          }]
        }, false));
      }
    },
  });

  module.exports = parseManager;
}());
