(function() {
  'use strict';

  const PATH        = require('path');
  const ROOT        = '../';
  const baseManager = require('./base-manager');
  const ghost       = require(PATH.resolve(__dirname, ROOT, 'ghost/ghostMiddleware.js'));

  const ghostManager = Object.assign({}, baseManager, {
    configureCommon(nconf, app, io) {
      if (nconf.get('GHOST_PATH')) {

        app.use(nconf.get('GHOST_PATH'), ghost({
          config: PATH.resolve(__dirname, ROOT, nconf.get('GHOST_CONFIG_PATH'))
        }));
      }
    },
  });

  module.exports = ghostManager;
}());
