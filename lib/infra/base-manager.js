(function() {
  const nconf = require('nconf');

  const baseManager = {
    handle(app, io) {
      this.configureCommon(app, io);

      if (nconf.get('development')) {
        this.configureDevelopmentEnv(app, io);
      } else {
        this.configureProductionEnv(app, io);
      }
    },

    configureCommon( /*app*/ ) {},

    configureProductionEnv( /*app*/ ) {},

    configureDevelopmentEnv( /*app*/ ) {}
  };

  module.exports = baseManager;
}());
