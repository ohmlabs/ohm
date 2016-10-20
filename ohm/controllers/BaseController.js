(function() {
  'use strict';
  // FIXME
  var config        = include('sample/config/config.js');

  var _             = require('underscore');
  var ViewerContext = include('ohm/models/ViewerContext.js');

  function BaseController(req, res) {
    this.req           = req;
    this.res           = res;
    this.viewerContext = null;

    return ViewerContext.genFromViewerContextID(
      this.req.session ?
        this.req.session.viewerContextID : null,
      (err, viewerContext) => {
        if (viewerContext.getCredential(config.PRIMARY_ACCOUNT_KEY)) {
          return ViewerContext.genFromPrimaryAccountKey(
            viewerContext.getCredential(config.PRIMARY_ACCOUNT_KEY),
            this.setReqSession.bind(this)
          );
        } else {
          this.setReqSession(err, viewerContext);
        }
      }
    );
  }

  _.extend(BaseController.prototype, {
    setReqSession: function (err, viewerContext) {
      if (viewerContext && !err) {
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
        environment: config.env
      };

      return params;
    },

    genResponse: function() {
      console.error('Implement me!');
    },
  });

  module.exports = BaseController;
}());
