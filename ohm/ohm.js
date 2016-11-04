(function() {
  'use strict';

  require('./_include.js');

  var BaseController       = require('./controllers/BaseController.js')
  var BaseSocketController = require('./controllers/BaseSocketController.js')

  function Ohm(config) {
    var ParseDashboard, ParseServer, SessionDataStore, io, ohmSessionDataStore, ensureAuthenticatedSocket, ohmCookieParser, S3Adapter, session, server, helmet, bodyParser, cookieParser, errorHandler, express, ghost, http, logger, methodOverride, parentApp, path, pkg;

    // Dependencies'
    SessionDataStore = include('models/SessionDataStore.js');
    ghost            = include('ghost/ghostMiddleware.js');
    path             = require('path');
    http             = require('http');
    express          = require('express');
    logger           = require('morgan');
    helmet           = require('helmet');
    bodyParser       = require('body-parser');
    session          = require('express-session');
    ParseServer      = require('parse-server').ParseServer;
    S3Adapter        = require('parse-server').S3Adapter;
    ParseDashboard   = require('parse-dashboard');
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
    parentApp.use(logger('dev'));
    parentApp.use(methodOverride());
    parentApp.set('env', config.env);
    parentApp.set('view engine', 'pug');
    parentApp.set('views', __dirname + '/views');
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
        parentApp.use(errorHandler());
        parentApp.enable('trust proxy');
        parentApp.locals.pretty = false;
        process.env.NODE_ENV = 'production';
        break;
      case 'development':
        require('longjohn');
        parentApp.use(config.PARSE_DASHBOARD, new ParseDashboard({
          'apps': [{
            'serverURL': config.PARSE_SERVER_URL,
            'appId': config.PARSE_APPLICATION_ID,
            'masterKey': config.PARSE_MASTER_KEY,
            'appName': config.MONGO_DB
          }]
        }, false));
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
    parentApp.use(config.GHOST_PATH, ghost({
      config: path.join(__dirname, config.GHOST_CONFIG)
    }));
    ///////////////////////////////////
    //   Start Server               //
    /////////////////////////////////
    include(config.SOCKETS)(io, parentApp);
    include(config.ROUTES)(parentApp);
    // Listen
    server.listen(config.port);

    if (config.is_prod) {
      console.log('Server started on port ' + config.port + ' in ' + parentApp.settings.env + ' mode');
    } else {
      console.log('Server started on port ' + config.port + ' in ' + parentApp.settings.env + ' mode');
    }
  }

  exports                      = module.exports = Ohm;
  exports.BaseController       = BaseController;
  exports.BaseSocketController = BaseSocketController;
}());
