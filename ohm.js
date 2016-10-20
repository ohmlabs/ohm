(function() {
  'use strict';
  var ParseDashboard, ParseServer, SessionDataStore, io, ohmSessionDataStore, ensureAuthenticatedSocket, ohmCookieParser, S3Adapter, session, server, assetsVersion, helmet, bodyParser, config, cookieParser, errorHandler, express, ghost, http, logger, methodOverride, parentApp, path, pkg;

  require('./_include.js');
  // FIXME
  config          = include('sample/config/config.js');
  // Dependencies'
  pkg             = include('package.json');
  path            = require('path');
  http            = require('http');
  express         = require('express');
  logger          = require('morgan');
  helmet          = require('helmet');
  bodyParser      = require('body-parser');
  session         = require('express-session');
  ParseServer     = require('parse-server').ParseServer;
  S3Adapter       = require('parse-server').S3Adapter;
  ParseDashboard  = require('parse-dashboard');
  methodOverride  = require('method-override');
  errorHandler    = require('errorhandler');
  cookieParser    = require('cookie-parser');
  ohmCookieParser = cookieParser(config.SOCKETIO_SESSION_SECRET);
  assetsVersion   = pkg.version;
  parentApp       = express();
  server          = http.createServer(parentApp);
  ///////////////////////////////////
  //   Configure Ghost CMS        //
  /////////////////////////////////
  ghost = include('sample/ghost/ghostMiddleware.js');
  parentApp.use(config.GHOST_PATH, ghost({
    config: path.join(__dirname, '/sample/ghost/config.js')
  }));
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
      'burrowdev', {
        directAccess: true
      }
    ),
  }));
  ///////////////////////////////////
  //      Session Tracking        //
  /////////////////////////////////
  SessionDataStore    = include('ohm/models/SessionDataStore.js');
  ohmSessionDataStore = new SessionDataStore();
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
      key: 'ojxsid',
      // resave: true,
      // saveUninitialized: true,
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
      var sessionID = handshake.signedCookies.ojxsid;
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
  parentApp.set('views', __dirname + '/ohm/views');
  parentApp.use(bodyParser.urlencoded({
    extended: true
  }));
  parentApp.use(bodyParser.json());
  parentApp.use(function(req, res, next) {
    res.locals.assetsVersion = assetsVersion;
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
      parentApp.use('/dashboard', new ParseDashboard({
        'apps': [{
          'serverURL': config.getBaseDomain() + config.PARSE_PATH,
          'appId': config.PARSE_APPLICATION_ID,
          'masterKey': config.PARSE_MASTER_KEY,
          'appName': 'ohm'
        }]
      }, false));
      parentApp.use(express['static'](__dirname + '/static'));
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
  //   Start Server               //
  /////////////////////////////////
  // Routes
  include('sample/routes/sockets.js')(io);
  include('sample/routes/site.js')(parentApp);
  // Listen
  server.listen(config.port);
  server.listen(4040);

  if (config.is_prod) {
    console.log('Server started on port ' + config.port + ' in ' + parentApp.settings.env + ' mode');
  } else {
    console.log('Server started on port ' + config.port + ' in ' + parentApp.settings.env + ' mode');
  }

}).call(this);
