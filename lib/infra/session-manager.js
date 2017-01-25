(function() {
  'use strict';

  const baseManager      = include('infra/base-manager');
  const cookieParser     = require('cookie-parser');
  const session          = require('express-session');
  const MemoryStore      = session.MemoryStore;
  const RedisStore       = require('connect-redis')(session);
  const redis            = require('redis');
  const SessionDataStore = include('models/SessionDataStore.js');
  const production       = process.env.NODE_ENV === 'production';
  const sessionManager   = Object.assign({}, baseManager, {
    configureCommon(nconf, app, io) {
      const ohmCookieParser  = cookieParser(nconf.get('SOCKETIO_SESSION_SECRET'));
      app.use(ohmCookieParser);

      if (!production) {
        var cache = new MemoryStore({
          reapInterval: 60000 * 10
        });
      } else {
        var cache = new RedisStore({
          client: redis.createClient()
        });
      }

      var ohmSessionDataStore = new SessionDataStore(nconf.get(), cache);

      app.use(
        session({
          secret: nconf.get('SOCKETIO_SESSION_SECRET'),
          store: ohmSessionDataStore,
          cookie: {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 525600 * 60 * 1000),
            // secure: true,
          },
          key: nconf.get('SESSION_KEY'),
          resave: true, // redis requires this be true
          saveUninitialized: false, // redis requires this be true
        })
      );
      /////////////////////
      // Socket IO setup //
      /////////////////////
      // See:
      // 1. https://github.com/LearnBoost/socket.io/wiki/Authorizing
      // 2. http://stackoverflow.com/questions/11541835/
      // 3. https://github.com/senchalabs/connect/blob/master/lib/middleware/session.js
      const ensureAuthenticatedSocket = function(handshake, callback) {
        var cookie = ohmCookieParser(handshake, null, function(err) {
          var sessionID = handshake.signedCookies[nconf.get('SESSION_KEY')];
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
    },
  });

  module.exports = sessionManager;
}());
