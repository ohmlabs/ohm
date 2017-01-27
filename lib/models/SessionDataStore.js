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

    _getFromCache: function(sessionID, callback) {
      this.cache.get(sessionID, callback);
    },

    dirtyCache: function(sessionID, callback) {
      this.cache.destroy(sessionID, callback);
    },

    _updateCache: function(err, sessionID, sessionDataJSON, callback) {
      if (sessionDataJSON && !err) {
        this.cache.set(sessionID, sessionDataJSON);
        callback(null, sessionDataJSON);
      } else {
        callback(err);
      }
    },

    get: function(sessionID, callback) {
      process.nextTick(() => {
        this._getFromCache(sessionID, (err, sessionDataJSON) => {
          if (sessionDataJSON) {
            callback(err, sessionDataJSON);
          } else {
            this._getFromDatabase(sessionID, (err, sessionDataJSON) => {
              this._updateCache(err, sessionID, sessionDataJSON, callback);
            });
          }
        });
      });
    },

    set: function(sessionID, sessionDataJSON, callback) {
      callback        = callback || emptyFunction;
      var SessionData = new sessionData(this.config);
      process.nextTick(() => {
        this._getFromCache(sessionID, (err, cacheSessionDataJSON) => {
          cacheSessionDataJSON = cacheSessionDataJSON || {};
          if (SessionData.areEqual(cacheSessionDataJSON, sessionDataJSON)) {
            return callback();
          } else {
            this._setToDatabase(sessionID, sessionDataJSON, (err) => {
              this._updateCache(err, sessionID, sessionDataJSON, callback);
            });
          }
        });
      });
    },

    destroy: function(sessionID, callback) {
      callback        = callback || emptyFunction;
      var SessionData = new sessionData(this.config);

      process.nextTick(() => {
        this.dirtyCache(sessionID, () => {
          SessionData.fetchWithSessionID(
            sessionID,
            (err, sessionData) => {
              if (err) {
                callback(err);
                return;
              }

              if (sessionData) {
                sessionData.destroy(null, {
                  success: function() {
                    callback();
                  },
                  error: function(sessionData, err) {
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

    _getFromDatabase: function(sessionID, callback) {
      var SessionData = new sessionData(this.config);
      SessionData.fetchWithSessionID(
        sessionID,
        (err, sessionData) => {
          var sessionDataJSON = sessionData ? sessionData.toJSON() : null;
          if (!err && sessionDataJSON && sessionDataJSON.cookie && sessionDataJSON.cookie.expires) {
            var expires = _.isObject(sessionDataJSON.cookie.expires) ? new Date(sessionDataJSON.cookie.expires) : sessionDataJSON.cookie.expires;

            if (!expires || new Date < expires) {
              callback(err, sessionDataJSON);
            } else {
              this.destroy(sessionID, callback);
            }
          } else {
            callback(err);
          }
        }
      );
    },

    _setToDatabase: function(sessionID, sessionDataJSON, callback) {
      callback        = callback || emptyFunction;
      var SessionData = new sessionData(this.config);
      SessionData.fetchWithSessionID(
        sessionID,
        (err, sessionData) => {
          if (!sessionData) {
            sessionData = SessionData.fromJSON(sessionDataJSON);
            sessionData.save(null, {
              success: function(sessionData) {
                callback(null, sessionData);
              },
              error: function( err) {
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
