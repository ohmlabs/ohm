(function() {
  'use strict';

  const PATH         = require('path');
  const ROOT         = '../';
  const baseManager  = require('./base-manager');
  const ghostManager = Object.assign({}, baseManager, {
    configureCommon(nconf, app, io) {
      if (nconf.get('GHOST_PATH')) {
        const ghost = require(PATH.join(__dirname, ROOT, 'ghost/ghostMiddleware.js'));
        app.use(nconf.get('GHOST_PATH'), ghost({
          config: nconf.get('GHOST_CONFIG_PATH')
        }));
      }
    },
  });

  module.exports = ghostManager;
}());
