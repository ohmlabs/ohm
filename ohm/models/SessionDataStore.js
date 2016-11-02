(function() {
  'use strict';

  var _             = require('underscore');
  var session       = require('express-session');
  var MemoryStore   = session.MemoryStore;
  var RedisStore    = require('connect-redis')(session);
  var redis         = require('redis');
  var emptyFunction = include('ohm/models/emptyFunction.js');
  var SessionData   = include('ohm/models/SessionData.js');

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
  function SessionDataStore(redis, port, host) {
    if (!redis) {
      this.cache = new MemoryStore({
        reapInterval: 60000 * 10
      });
    } else {
      // This acts as a cache in front of Parse
      this.cache = new RedisStore({
        client: redis.createClient(port, host)
      });
    }
  }

  _.extend(SessionDataStore.prototype, RedisStore.prototype, MemoryStore.prototype, {

    dirtyCache: function(sessionID, callback) {
      this.cache.destroy(sessionID, callback);
    },

    get: function(sessionID, callback) {
      var self = this;

      process.nextTick(function() {
        self._getFromCache(sessionID, function(err, sessionDataJSON) {
          if (err) {
            console.error(err);
          }

          if (sessionDataJSON) {
            callback(null, sessionDataJSON);
          } else {
            self._getFromDatabase(sessionID, function(err, sessionDataJSON) {
              self._updateCache(err, sessionID, sessionDataJSON, callback);
            });
          }
        });
      });
    },

    set: function(sessionID, sessionDataJSON, callback) {
      callback = callback || emptyFunction;
      var self = this;

      process.nextTick(function() {
        self._getFromCache(sessionID, function(err, cacheSessionDataJSON) {
          cacheSessionDataJSON = cacheSessionDataJSON || {};
          if (SessionData.areEqual(cacheSessionDataJSON, sessionDataJSON)) {
            callback();
          } else {
            self._setToDatabase(sessionID, sessionDataJSON, function(err) {
              self._updateCache(err, sessionID, sessionDataJSON, callback);
            });
          }
        });
      });
    },

    destroy: function(sessionID, callback) {
      callback = callback || emptyFunction;
      var self = this;

      process.nextTick(function() {
        self.dirtyCache(sessionID, function() {
          SessionData.fetchWithSessionID(
            sessionID,
            function(err, sessionData) {
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

      this.cache.set(sessionID, sessionDataJSON, function() {
        callback(err, sessionDataJSON);
      }.bind(this));
    },

    _setToDatabase: function(sessionID, sessionDataJSON, callback) {
      callback = callback || emptyFunction;

      SessionData.fetchWithSessionID(
        sessionID,
        function(err, sessionData) {
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
