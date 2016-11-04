(function() {
  'use strict';

  var _             = require('underscore');
  var viewerContext = include('models/ViewerContext.js');

  function BaseController(req, res) {
    var ViewerContext  = new viewerContext(req.app.locals.config);
    this.req           = req;
    this.res           = res;
    this.config        = res.app.locals.config;
    this.viewerContext = null;

    return ViewerContext.genFromViewerContextID(
      this.req.session.viewerContextID,
      function (err, viewerContext) {
        if (viewerContext.getCredential(this.config.PRIMARY_ACCOUNT_KEY)) {
          return ViewerContext.genFromPrimaryAccount(
            this.config.PRIMARY_ACCOUNT_KEY,
            viewerContext.getCredential(this.config.PRIMARY_ACCOUNT_KEY),
            this.setReqSession.bind(this)
          );
        } else {
          this.setReqSession(err, viewerContext);
        }
      }.bind(this)
    );
  }

  _.extend(BaseController.prototype, {
    setReqSession: function (err, viewerContext) {
      if (viewerContext) {
        this.viewerContext = viewerContext;

        if (this.req.session.viewerContextID !== viewerContext.id) {
          this.req.session.viewerContextID = viewerContext.id;
          this.req.session.viewerContext   = viewerContext;
        }
        return this.genResponse();
      } else {
        return this.res.redirect('/');
      }
    },

    getSessionID: function() {
      return this.req ? this.req.sessionID : null;
    },

    getViewerContext: function() {
      return this.viewerContext;
    },

    getBootloaderParams: function(filename) {
      var initScript = '';

      initScript += filename;

      var params = {
        initScript: initScript,
        assetsVersion: this.res.locals.assetsVersion,
        environment: this.config.env
      };

      return params;
    },

    genResponse: function() {
      console.error('Implement me!');
    },
  });

  module.exports = BaseController;
}());
