(function() {
  'use strict';

  let _                   = require('underscore');
  let SESSION_DATA_FIELDS = ['cookie', 'sessionID', 'viewerContextID'];
  let session             = require('express-session');
  let MemoryStore         = session.MemoryStore;
  let RedisStore          = require('connect-redis')(session);
  let emptyFunction       = include('models/emptyFunction.js');
  let production          = process.env.NODE_ENV === 'production';
  let redis               = require('redis');
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
    this.config = config;

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

    renameIDToSessionID: function(sessionDataJSON) {
      var copy = _.omit(sessionDataJSON, 'id');
      if (sessionDataJSON.id) {
        copy.sessionID = sessionDataJSON.id;
      }
      return copy;
    },

    areEqual: function(sessionDataJSON1, sessionDataJSON2) {
      return _.isEqual(
        _.pick(
          this.renameIDToSessionID(sessionDataJSON1),
          SESSION_DATA_FIELDS
        ),
        _.pick(
          this.renameIDToSessionID(sessionDataJSON2),
          SESSION_DATA_FIELDS
        )
      );
    },

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
        this._getFromCache(sessionID, callback);
      });
    },

    set: function(sessionID, sessionDataJSON, callback) {
      callback = callback || emptyFunction;
      process.nextTick(() => {
        this._getFromCache(sessionID, (err, cacheSessionDataJSON) => {
          cacheSessionDataJSON = cacheSessionDataJSON || {};
          if (this.areEqual(cacheSessionDataJSON, sessionDataJSON)) {
            return callback();
          } else {
            this._updateCache(err, sessionID, sessionDataJSON, callback);
          }
        });
      });
    },

    destroy: function(sessionID, callback) {
      callback = callback || emptyFunction;

      process.nextTick(() => {
        this.dirtyCache(sessionID, callback);
      });
    },
  });

  module.exports = SessionDataStore;
}());
