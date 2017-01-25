(function() {
  'use strict';

  const _             = require('underscore');
  const session       = require('express-session');
  const MemoryStore   = session.MemoryStore;
  const RedisStore    = require('connect-redis')(session);
  const emptyFunction = include('models/emptyFunction.js');
  const production    = process.env.NODE_ENV === 'production';
  const redis         = require('redis');
  const sessionData   = include('models/SessionData.js');
  /**
   * Implementation of session data memory store.
   *
   * The npm package connect (and hence express.js) relies on the concept of
   * a MomeryStore in order to make sessionData a persistent object
   * stored on the server. However, because this is in RAM, any reboot of the server
   * causes all this information to be lost. Hence we instead will implement
   * a DB backed store to fetch and store session data.
   *
   * See https://github.com/senchalabs/connect/blob/master/lib/middleware/session/memory.js
   * for an example implementation of what connect expected from the session API.
   *
   * You MUST implement:
   * - get: function (sessionID, callback)
   * - set: function (sessionID, sessionData, callback)
   * - destroy: function (sessionID, callback)
   * @module SessionDataStore
   */
  function SessionDataStore(config) {
    this.config  = config;

    if (!production) {
      this.cache = new MemoryStore({
        reapInterval: 60000 * 10
      });
    } else {
      this.cache = new RedisStore({
        client: redis.createClient(config.REDIS_PORT, config.REDIS_HOST)
      });
    }
  }

  _.extend(SessionDataStore.prototype, RedisStore.prototype, {

    dirtyCache: function(sessionID, callback) {
      this.cache.destroy(sessionID, callback);
    },

    get: function(sessionID, callback) {
      var self = this;

      process.nextTick(() => {
        self._getFromCache(sessionID, (err, sessionDataJSON) => {
          if (err) {
            console.error(err);
          }

          if (sessionDataJSON) {
            callback(null, sessionDataJSON);
          } else {
            self._getFromDatabase(sessionID, (err, sessionDataJSON) => {
              self._updateCache(err, sessionID, sessionDataJSON, callback);
            });
          }
        });
      });
    },

    set: function(sessionID, sessionDataJSON, callback) {
      callback        = callback || emptyFunction;
      var self        = this;
      var SessionData = new sessionData(this.config);

      process.nextTick(() => {
        self._getFromCache(sessionID, (err, cacheSessionDataJSON) => {
          cacheSessionDataJSON = cacheSessionDataJSON || {};
          if (SessionData.areEqual(cacheSessionDataJSON, sessionDataJSON)) {
            callback();
          } else {
            self._setToDatabase(sessionID, sessionDataJSON, (err) => {
              self._updateCache(err, sessionID, sessionDataJSON, callback);
            });
          }
        });
      });
    },

    destroy: function(sessionID, callback) {
      callback        = callback || emptyFunction;
      var self        = this;
      var SessionData = new sessionData(this.config);

      process.nextTick(() => {
        self.dirtyCache(sessionID, () => {
          SessionData.fetchWithSessionID(
            sessionID,
            (err, sessionData) => {
              if (err) {
                console.error(err);
                callback(err);
                return;
              }

              if (sessionData) {
                sessionData.destroy(null, {
                  success: function() {
                    callback();
                  },
                  error: function(sessionData, err) {
                    console.error(err);
                    callback(err);
                  }
                });
              } else {
                callback();
              }
            }
          );
        });
      });
    },

    _getFromCache: function(sessionID, callback) {
      this.cache.get(sessionID, callback);
    },

    _getFromDatabase: function(sessionID, callback) {
      var SessionData = new sessionData(this.config);

      SessionData.fetchWithSessionID(
        sessionID,
        (err, sessionData) => {
          if (err) {
            console.error(err, (new Error()).trace);
            callback(err, null);
            return;
          }

          var sessionDataJSON = sessionData ? sessionData.toJSON() : null;
          if (sessionDataJSON) {
            var expires = _.isObject(sessionDataJSON.cookie.expires) ? new Date(sessionDataJSON.cookie.expires) : sessionDataJSON.cookie.expires;

            if (!expires || new Date < expires) {
              callback(null, sessionDataJSON);
            } else {
              self.destroy(sessionID, callback);
            }
          } else {
            callback();
          }
        }
      );
    },

    _updateCache: function(err, sessionID, sessionDataJSON, callback) {
      var self = this;

      if (err) {
        console.error(err);
        return;
      }

      this.cache.set(sessionID, sessionDataJSON, () => {
        callback(err, sessionDataJSON);
      }.bind(this));
    },

    _setToDatabase: function(sessionID, sessionDataJSON, callback) {
      callback = callback || emptyFunction;

      var SessionData = new sessionData(this.config);

      SessionData.fetchWithSessionID(
        sessionID,
        (err, sessionData) => {
          if (err) {
            console.error(err);
            callback(err);
            return;
          }

          if (!sessionData) {
            sessionData = SessionData.fromJSON(sessionDataJSON);
            // PARSE: save operation
            sessionData.save(null, {
              success: function() {
                callback();
              },
              error: function(sessionData, err) {
                console.error(err);
                callback(err);
              }
            });
          } else {
            sessionData.update(sessionDataJSON, callback);
          }
        }
      );
    },
  });

  module.exports = SessionDataStore;
}());
