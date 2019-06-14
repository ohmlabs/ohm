// Allows for relative paths
require('./_include.js');
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
  "ENV": 'development',
  "host": "localhost",
  "port": "8888",
  "MONGO_DB": "OHMTEST",
  "MONGO_PORT": "27017",
  "MONGO_HOST": "localhost",
  "REDIS_PORT": "6379",
  "REDIS_HOST": "localhost",
  "PARSE_PATH": "/parse",
  "PARSE_DASHBOARD": "/dashboard",
  "PARSE_APPLICATION_ID": "OHMTEST",
  "PARSE_JAVASCRIPT_KEY": "OHMTEST",
  "PARSE_MASTER_KEY": "OHMTEST",
  "PARSE_SERVER_URL": "http://localhost:8888/parse",
  "AWS_ACCESS_KEY": "OHMTEST",
  "AWS_SECRET_KEY": "OHMTEST",
  "AWS_BUCKET_NAME": "OHMTEST",
  "SOCKETIO_SESSION_SECRET": "OHMTEST",
  "SESSION_KEY": "OHMTEST",
  "PRIMARY_ACCOUNT_KEY": "OHMTEST",
  "VIEWS_DIR": "/views",
  "STATIC_DIR": "/dist"
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
    sessionManager.handle(nconf, app, io);
  }

  if (config.PARSE_APPLICATION_ID) {
    parseManager.handle(nconf, app);
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
