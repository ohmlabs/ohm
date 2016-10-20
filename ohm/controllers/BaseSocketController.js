(function() {
  'use strict';

  var _                = require('underscore');
  var ViewerContext    = include('ohm/models/ViewerContext.js');

  function BaseSocketController(socketMsg, socket, socketData) {
    this.socket        = socket;
    this.socketMessage = socketMsg;
    this.sessionData   = socket.request.sessionData || {};
    this.socketData    = socketData || {};
    this.viewerContext = null;
    this.sessionID     = null;

    // by this point, the cookie has been signed, so we use this and not the sessionID
    if (this.socket.handshake && this.socket.handshake.signedCookies) {
      this.sessionID = this.socket.handshake.signedCookies.ojxsid;
    }

    ViewerContext.genFromViewerContextID(
      this.sessionData.viewerContextID,
      function(err, viewerContext) {
        if (err) {
          console.error(err);
        }
        if (viewerContext) {
          this.viewerContext = viewerContext;
          if (this.sessionData.viewerContextID !== viewerContext.id) {
            this.sessionData.viewerContextID = viewerContext.id;
            this.sessionData.viewerContext = viewerContext;
          }
          this.genResponse();
        }
      }.bind(this)
    );
  }

  _.extend(BaseSocketController.prototype, {
    getSocketMessage: function() {
      return this.socketMessage;
    },

    getViewerContext: function() {
      return this.viewerContext;
    },

    getSessionID: function() {
      return this.sessionID;
    },

    getSessionData: function(key) {
      if (key === undefined) {
        return this.sessionData;
      }
      return _.isObject(this.sessionData) ? this.sessionData[key] : null;
    },

    getSocketData: function(key) {
      return _.isObject(this.socketData) ? this.socketData[key] : null;
    },

    genResponse: function() {
      console.error('Implement me!');
    },
  });

  module.exports = BaseSocketController;
}());
