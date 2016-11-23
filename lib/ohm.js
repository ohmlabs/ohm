(function() {
  'use strict';

  const nconf         = require('nconf');
  const PATH          = require('path');
  const defaultConfig = PATH.resolve(__dirname, 'config/default.json');
  nconf.argv().env().file({
    file: defaultConfig
  }).defaults({
    ENV: 'development'
  });

  // Allows for relative paths
  require('./_include.js');

  const winston              = require('winston');
  const expressWinston       = require('express-winston');
  const http                 = require('http');
  const express              = require('express');
  const app                  = express();
  const server               = http.createServer(app);
  const io                   = require('socket.io')(server);
  const sessionManager       = include('infra/session-manager');
  const configManager        = include('infra/config-manager');
  const parseManager         = include('infra/parse-manager');
  const ghostManager         = include('infra/ghost-manager');
  const BaseController       = include('controllers/BaseController.js');
  const BaseSocketController = include('controllers/BaseSocketController.js');
  const ViewerContext        = include('models/ViewerContext.js');

  function Ohm(config) {
    Object.keys(config).map(function (key, index) {
      nconf.set(key, config[key]);
    });

    if (config.is_prod) {
      winston.info('Server starting on port ' + config.port + ' in ' + app.settings.env + ' mode');
    } else {
      winston.info('Server starting on port ' + config.port + ' in ' + app.settings.env + ' mode');
    }

    app.config = config;

    configManager.handle(nconf, app);
    parseManager.handle(nconf, app);
    sessionManager.handle(nconf, app, io);
    ghostManager.handle(nconf, app);

    app.use(expressWinston.logger({
      transports: [
        new (winston.transports.File)({
          filename: 'logs/ohm.debug.log',
          level: 'debug',
        }),
      ]
    }));

    require(config.SOCKETS)(io, app);
    require(config.ROUTES)(app);

    app.use(expressWinston.errorLogger({
      transports: [
        new (winston.transports.File)({

          filename: 'logs/ohm.error.log'
        }),
      ]
    }));

    return server.listen(config.port);
  }

  exports                      = module.exports = Ohm;
  exports.BaseController       = BaseController;
  exports.BaseSocketController = BaseSocketController;
  exports.ViewerContext        = ViewerContext;
}());