(function() {
  'use strict';

  const nconf       = require('nconf');
  const baseManager = {
    handle(nconf, app, io) {
      this.configureCommon(nconf, app, io);

      if (nconf.get('development')) {
        this.configureDevelopmentEnv(nconf, app, io);
      } else {
        this.configureProductionEnv(nconf, app, io);
      }
    },

    configureCommon( /*app*/ ) {},

    configureProductionEnv( /*app*/ ) {},

    configureDevelopmentEnv( /*app*/ ) {}
  };

  module.exports = baseManager;
}());
