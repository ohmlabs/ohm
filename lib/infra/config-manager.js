const PATH           = require('path');
const ROOT           = '../';
const baseManager    = require('./base-manager');
const compression    = require('compression')
const methodOverride = require('method-override');
const bodyParser     = require('body-parser');
const errorHandler   = require('errorhandler');
const logger         = require('morgan');
const helmet         = require('helmet');
const express        = require('express');
const configManager  = Object.assign({}, baseManager, {
  configureCommon(nconf, app, io) {
    app.use(compression());
    app.use(methodOverride());
    app.set('view engine', 'pug');
    app.set('views', nconf.get('VIEWS_PATH') || PATH.join(__dirname, ROOT, nconf.get('VIEWS_DIR')));
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(bodyParser.json({ strict: false }));
    app.locals.config = nconf.get();
    app.use(helmet())
    app.use(express.static(nconf.get('STATIC_PATH')));
    app.use(function(req, res, next) {
      return next();
    });
  },

  configureProductionEnv(nconf, app, io) {
    app.locals.pretty = false;
    app.use(logger('combined'));
    app.use(errorHandler());
    app.enable('trust proxy');
  },

  configureDevelopmentEnv(nconf, app, io) {
    app.locals.pretty = true;
    app.use(logger('dev'));
    require('longjohn');
    app.use(errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  }
});

module.exports = configManager;
