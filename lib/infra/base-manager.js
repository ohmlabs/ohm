(function() {
  'use strict';

  const production  = process.env.NODE_ENV === 'production';
  const baseManager = {
    handle(nconf, app, io) {
      this.configureCommon(nconf, app, io);

      if (!production) {
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
