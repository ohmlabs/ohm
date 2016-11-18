(function() {
  'use strict';

  const nconf         = require('nconf');
  const PATH          = require('path');
  const ROOT          = '../';
  const defaultConfig = PATH.resolve(__dirname, ROOT, 'config/default.json');
  nconf.argv().env().file({
    file: defaultConfig
  }).defaults({
    ENV: 'development'
  });

  const baseManager    = require('./base-manager');
  const methodOverride = require('method-override');
  const bodyParser     = require('body-parser');
  const errorHandler   = require('errorhandler');
  const logger         = require('morgan');
  const helmet         = require('helmet');
  const express        = require('express');
  const configManager  = Object.assign({}, baseManager, {
    configureCommon(app) {
      app.use(methodOverride());
      app.set('view engine', 'pug');
      app.set('views', PATH.resolve(__dirname, ROOT, nconf.get('VIEWS_DIR')));
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

    configureProductionEnv(app) {
      app.locals.pretty = false;
      app.use(logger('combined'));
      app.use(errorHandler());
      app.enable('trust proxy');
      process.env.NODE_ENV = 'production';
    },

    configureDevelopmentEnv(app) {
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
