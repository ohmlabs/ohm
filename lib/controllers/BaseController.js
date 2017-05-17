(function() {
  'use strict';

  const _             = require('underscore');
  const viewerContext = include('models/ViewerContext.js');
  const fs            = require('fs');
  const path          = require('path');

  function BaseController(req, res) {
    this.config        = req.app.locals.config;
    // FIXME: this is coming from webpack should be in config
    this.manifestPath  = path.join(this.config.STATIC_PATH, 'build-manifest.json');
    this.manifest      = JSON.parse(fs.readFileSync(this.manifestPath, { encoding: 'utf-8' }));
    this.req           = req;
    this.res           = res;
    this.viewerContext = null;
    var ViewerContext  = new viewerContext(this.config);

    return ViewerContext.genFromViewerContextID(
      this.req.session.viewerContextID,
      (err, viewerContext) => {
        if (viewerContext.getCredential(this.config.PRIMARY_ACCOUNT_KEY)) {
          return ViewerContext.genFromPrimaryAccount(
            this.config.PRIMARY_ACCOUNT_KEY,
            viewerContext.getCredential(this.config.PRIMARY_ACCOUNT_KEY),
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
      if (viewerContext) {
        this.viewerContext = viewerContext;

        if (this.req.session.viewerContextID !== viewerContext.id) {
          this.req.session.viewerContextID = viewerContext.id;
        }
        return this.genResponse();
      } else {
        return this.res.redirect('/');
      }
    },

    setAssets: function (params) {
      params.jsBundle  = this.manifest.javascript ? this.manifest.javascript[params.initScript] : this.manifest[params.initScript + '.js'];
      params.cssBundle = this.manifest.styles ? this.manifest.styles[params.initScript] :this.manifest[params.initScript + '.css'];
      return params;
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
      };

      return this.setAssets(params);
    },

    genResponse: function() {
      console.error('Implement me!');
    },
  });

  module.exports = BaseController;
}());
