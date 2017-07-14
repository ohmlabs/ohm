(function() {
  'use strict';

  const ghost        = require('ghost');
  const baseManager  = require('./base-manager');
  const ghostManager = Object.assign({}, baseManager, {
    configureCommon(nconf, app) {
      if (nconf.get('GHOST_CONFIG_PATH')) {
        ghost({
          config: nconf.get('GHOST_CONFIG_PATH')
        }).then(function (ghostServer) {
            app.use(ghostServer.config.paths.subdir, ghostServer.rootApp);
            ghostServer.start(app);
        });
      }
    },
  });

  module.exports = ghostManager;
}());
