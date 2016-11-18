(function() {
  'use strict';

  const PATH          = require('path');
  const nconf         = require('nconf');
  const ROOT          = '../';
  const defaultConfig = PATH.resolve(__dirname, ROOT, 'config/default.json');

  const baseManager = require('./base-manager');
  const ghost       = require(PATH.resolve(__dirname, ROOT, 'ghost/ghostMiddleware.js'));

  nconf.argv().env().file({
    file: defaultConfig
  }).defaults({
    ENV: 'development'
  });

  const ghostManager = Object.assign({}, baseManager, {
    configureCommon(app) {
      if (nconf.get('GHOST_PATH')) {

        app.use(nconf.get('GHOST_PATH'), ghost({
          config: PATH.resolve(__dirname, ROOT, nconf.get('GHOST_CONFIG_PATH'))
        }));
      }
    },
  });

  module.exports = ghostManager;
}());
