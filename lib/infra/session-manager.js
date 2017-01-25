(function() {
  'use strict';

  const baseManager      = include('infra/base-manager');
  const cookieParser     = require('cookie-parser');
  const session          = require('express-session');
  const SessionDataStore = include('models/SessionDataStore.js');
  const production       = process.env.NODE_ENV === 'production';
  const sessionManager   = Object.assign({}, baseManager, {
    configureCommon(nconf, app, io) {
      const ohmSessionDataStore = new SessionDataStore(nconf.get());

      app.use(
        session({
          secret: nconf.get('SOCKETIO_SESSION_SECRET'),
          resave: true,
          saveUninitialized: false,
          store: ohmSessionDataStore,
          ttl: 260,
          cookie: {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 525600 * 60 * 1000),
            // secure: true,
          },
          key: nconf.get('SESSION_KEY'),
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
        var sessionID = handshake.signedCookies[nconf.get('SESSION_KEY')];
        ohmSessionDataStore.get(sessionID, callback);
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
