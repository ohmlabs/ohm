// Allows for relative paths
require('./_include.js');
require('babel-register')({
  presets: ['env']
});

const nconf                = require('nconf');
const PATH                 = require('path');
const defaultConfig        = PATH.resolve(__dirname, 'config/default.json');
const production           = process.env.NODE_ENV === 'production';
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

nconf.argv().env().file({
  file: defaultConfig
}).defaults({
  ENV: 'development'
});

function Ohm(config) {
  Object.keys(config).map((key, index) => {
    nconf.set(key, config[key]);
  });

  if (nconf.get('STATIC_PATH') === undefined) {
    nconf.set('STATIC_PATH', PATH.join(__dirname, nconf.get('STATIC_DIR')));
  }

  winston.info('Server starting on port ' + config.port + ' in ' + app.settings.env + ' mode');
  app.config = config;
  configManager.handle(nconf, app);

  if (config.SESSION_KEY) {
    parseManager.handle(nconf, app);
    sessionManager.handle(nconf, app, io);
  }

  if (config.GHOST_CONFIG_PATH) {
    ghostManager.handle(nconf, app);
  }

  app.use(expressWinston.logger({
    transports: [
      new(winston.transports.File)({
        filename: 'logs/ohm.debug.log',
        level: 'debug',
      }),
    ]
  }));

  if (config.SOCKETS) {
    require(config.SOCKETS)(io, app);
  }
  require(config.ROUTES)(app);

  app.use(expressWinston.errorLogger({
    transports: [
      new(winston.transports.File)({

        filename: 'logs/ohm.error.log'
      }),
    ]
  }));

  server.listen(config.port);
  return server;
}

exports = module.exports     = Ohm;
exports.BaseController       = BaseController;
exports.BaseSocketController = BaseSocketController;
exports.ViewerContext        = ViewerContext;
