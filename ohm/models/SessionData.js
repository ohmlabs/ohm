(function() {
  'use strict';

  var _                   = require('underscore');
  var Parse               = include('ohm/apis/Parse.js');
  var SESSION_DATA_FIELDS = ['cookie', 'sessionID', 'viewerContextID'];

  /**
   * An abstraction of the session data stored with Express/Connect.
   *
   * This is backed by a DB (Parse at the moment). Because connect uses id
   * as a hard coded key and Parse makes its own ids for objects, we have
   * to do a bit of swapping around to make things play nice.
   * @module SessionData
   */
  var SessionData = Parse.Object.extend(
    'SessionData', {
      /// INSTANCE METHODS ///
      update: function(newSessionDataJSON, callback) {
        var copy = SessionData.renameIDToSessionID(newSessionDataJSON);

        _.each(SESSION_DATA_FIELDS, function(fieldName) {
          if (_.has(newSessionDataJSON, fieldName)) {
            this.set(fieldName, newSessionDataJSON[fieldName]);
          }
        }, this);

        this.save(null, {
          success: function() {
            if (callback) {
              callback();
            }
          },
          error: function(object, err) {
            console.error(err, (new Error()).trace);
            if (callback) {
              callback(err);
            }
          },
        });
      },

      toJSON: function() {
        var data = {};

        _.each(SESSION_DATA_FIELDS, function(fieldName) {
          data[fieldName] = this.get(fieldName);
        }, this);

        data.id = data.sessionID;
        delete data.sessionID;

        return data;
      },
    }, {
      /// STATIC METHODS ///
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
            SessionData.renameIDToSessionID(sessionDataJSON1),
            SESSION_DATA_FIELDS
          ),
          _.pick(
            SessionData.renameIDToSessionID(sessionDataJSON2),
            SESSION_DATA_FIELDS
          )
        );
      },

      fetchWithSessionID: function(sessionID, callback) {
        if (!callback) {
          console.error('No callback passed into genFromSessionID.');
          return;
        }

        if (!sessionID) {
          var err = new Error('No sessionID passed into fetchWithSessionID method');
          callback(err);
        }

        var query = new Parse.Query(SessionData);
        query.equalTo('sessionID', sessionID);
        // PARSE: find operation
        query.find({
          success: function(results) {
            if (results.length > 1) {
              console.warn('For sessionID ' + sessionID + ', more than 1 results returned');
            }
            var sessionData = results[0];
            callback(null, sessionData);
          },
          error: function(object, err) {
            callback(err);
          },
        });
      },

      fromJSON: function(sessionDataJSON) {
        var copy = SessionData.renameIDToSessionID(sessionDataJSON);
        return new SessionData(copy);
      },
    }
  );

  module.exports = SessionData;
}());
