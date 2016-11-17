(function() {
  'use strict';

  // Allows for relative paths
  require('./_include.js');

  const BaseController       = include('controllers/BaseController.js');
  const BaseSocketController = include('controllers/BaseSocketController.js');
  const ViewerContext        = include('models/ViewerContext.js');

  function Ohm(config) {
    var ParseServer, SessionDataStore, io, ohmSessionDataStore, ensureAuthenticatedSocket, ohmCookieParser, S3Adapter, session, server, helmet, bodyParser, cookieParser, errorHandler, express, http, logger, methodOverride, parentApp, path, winston, expressWinston;

    // Dependencies'
    SessionDataStore = include('models/SessionDataStore.js');
    path             = require('path');
    http             = require('http');
    express          = require('express');
    winston          = require('winston');
    expressWinston   = require('express-winston');
    logger           = require('morgan');
    helmet           = require('helmet');
    bodyParser       = require('body-parser');
    session          = require('express-session');
    ParseServer      = require('parse-server').ParseServer;
    S3Adapter        = require('parse-server').S3Adapter;
    methodOverride   = require('method-override');
    errorHandler     = require('errorhandler');
    cookieParser     = require('cookie-parser');
    ohmCookieParser  = cookieParser(config.SOCKETIO_SESSION_SECRET);
    parentApp        = express();
    parentApp.config = config;
    server           = http.createServer(parentApp);
    ///////////////////////////////////
    //   Configure Parse Server     //
    /////////////////////////////////
    parentApp.use(config.PARSE_PATH, new ParseServer({
      databaseURI: config.MONGODB_INSTANCE,
      appId: config.PARSE_APPLICATION_ID,
      masterKey: config.PARSE_MASTER_KEY,
      serverURL: config.PARSE_SERVER_URL,
      filesAdapter: new S3Adapter(
        config.AWS_ACCESS_KEY,
        config.AWS_SECRET_KEY,
        config.AWS_BUCKET_NAME, {
          directAccess: true
        }
      ),
    }));
    ///////////////////////////////////
    //      Session Tracking        //
    /////////////////////////////////
    if (config.env === "development") {
      ohmSessionDataStore = new SessionDataStore(config, false);
    } else {
      ohmSessionDataStore = new SessionDataStore(config, true, config.REDIS_PORT, config.REDIS_HOST);
    }
    parentApp.use(ohmCookieParser);
    parentApp.use(
      session({
        secret: config.SOCKETIO_SESSION_SECRET,
        store: ohmSessionDataStore,
        cookie: {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 525600 * 60 * 1000),
          // secure: true,
        },
        key: config.SESSION_KEY,
        resave: true, // redis requires this be true
        saveUninitialized: true, // redis requires this be true
      })
    );
    /////////////////////
    // Socket IO setup //
    /////////////////////
    io = require('socket.io')(server);
    // See:
    // 1. https://github.com/LearnBoost/socket.io/wiki/Authorizing
    // 2. http://stackoverflow.com/questions/11541835/
    // 3. https://github.com/senchalabs/connect/blob/master/lib/middleware/session.js
    ensureAuthenticatedSocket = function(handshake, callback) {
      var cookie = ohmCookieParser(handshake, null, function(err) {
        var sessionID = handshake.signedCookies[config.SESSION_KEY];
        ohmSessionDataStore.get(sessionID, callback);
      });
    };
    io.use(function(socket, next) {
      var handshake = socket.request;
      // call the method with handshake as parameter, wait for callback
      ensureAuthenticatedSocket(handshake, function(err, sessionData) {
        if (!err && sessionData) {
          // IT WORKED
          handshake.sessionData = sessionData;
          next();
        } else {
          // IT FAILED
          next(new Error('Not authorized'));
        }
      });
    });
    ///////////////////////////////////
    //  Environment Configuration   //
    /////////////////////////////////
    parentApp.use(methodOverride());
    parentApp.set('env', config.env);
    parentApp.set('view engine', 'pug');
    parentApp.set('views', config.VIEWS_DIR || __dirname + '/views');
    parentApp.use(bodyParser.urlencoded({
      extended: true
    }));
    parentApp.use(bodyParser.json());
    parentApp.locals.config = config;
    parentApp.use(function(req, res, next) {
      res.locals.assetsVersion = '1.0';
      return next();
    });
    switch (config.env) {
      case 'production':
        parentApp.use(logger('combined'));
        parentApp.use(errorHandler());
        parentApp.enable('trust proxy');
        parentApp.locals.pretty = false;
        process.env.NODE_ENV = 'production';
        break;
      case 'development':
        parentApp.use(logger('dev'));
        require('longjohn');
        if (config.PARSE_DASHBOARD) {
          var ParseDashboard   = require('parse-dashboard');
          parentApp.use(config.PARSE_DASHBOARD, new ParseDashboard({
            'apps': [{
              'serverURL': config.PARSE_SERVER_URL,
              'appId': config.PARSE_APPLICATION_ID,
              'masterKey': config.PARSE_MASTER_KEY,
              'appName': config.MONGO_DB
            }]
          }, false));
        }
        // FIXME, make optional
        parentApp.use(express['static'](__dirname + '/dist'));
        parentApp.use(errorHandler({
          dumpExceptions: true,
          showStack: true
        }));
        parentApp.locals.pretty = true;
        break;
      default:
        break;
    }
    ///////////////////////////////////
    //   Configure Ghost CMS        //
    /////////////////////////////////
    if (config.GHOST_PATH) {
      var ghost = include('ghost/ghostMiddleware.js');
      parentApp.use(config.GHOST_PATH, ghost({
        config: config.GHOST_CONFIG
      }));
    }
    parentApp.use(expressWinston.logger({
      transports: [
        new (winston.transports.File)({
          filename: 'logs/ohm.debug.log',
          level: 'debug',
        }),
      ]
    }));

    if (config.is_prod) {
      winston.info('Server starting on port ' + config.port + ' in ' + parentApp.settings.env + ' mode');
    } else {
      winston.info('Server starting on port ' + config.port + ' in ' + parentApp.settings.env + ' mode');
    }
    ///////////////////////////////////
    //   Start Server               //
    /////////////////////////////////
    require(config.SOCKETS)(io, parentApp);
    require(config.ROUTES)(parentApp);

    parentApp.use(expressWinston.errorLogger({
      transports: [
        new (winston.transports.File)({

          filename: 'logs/ohm.error.log'
        }),
      ]
    }));

    // Listen
    return server.listen(config.port);

  }

  exports                      = module.exports = Ohm;
  exports.BaseController       = BaseController;
  exports.BaseSocketController = BaseSocketController;
  exports.ViewerContext        = ViewerContext;
}());
