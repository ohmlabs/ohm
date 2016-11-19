(function() {
  'use strict';

  const PATH           = require('path');
  const ROOT           = '../';
  const baseManager    = require('./base-manager');
  const methodOverride = require('method-override');
  const bodyParser     = require('body-parser');
  const errorHandler   = require('errorhandler');
  const logger         = require('morgan');
  const helmet         = require('helmet');
  const express        = require('express');
  const configManager  = Object.assign({}, baseManager, {
    configureCommon(nconf, app, io) {
      app.use(methodOverride());
      app.set('view engine', 'pug');
      app.set('views', nconf.get('VIEWS_PATH') || PATH.join(__dirname, ROOT, nconf.get('VIEWS_DIR')));
      app.use(bodyParser.urlencoded({
        extended: true
      }));
      app.use(bodyParser.json());
      app.locals.config = nconf.get();
      app.use(function(req, res, next) {
        res.locals.assetsVersion = '1.0';
        return next();
      });
    },

    configureProductionEnv(nconf, app, io) {
      app.locals.pretty = false;
      app.use(logger('combined'));
      app.use(errorHandler());
      app.enable('trust proxy');
      process.env.NODE_ENV = 'production';
    },

    configureDevelopmentEnv(nconf, app, io) {
      app.locals.pretty = true;
      app.use(logger('dev'));
      require('longjohn');
      app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
      app.use(express['static'](PATH.resolve(__dirname, ROOT, nconf.get('STATIC_DIR'))));
    }
  });

  module.exports = configManager;
}());
