(function() {
  var app, assetsVersion, bodyParser, config, cookieParser, errorHandler, express, ghost, http, logger, methodOverride, pkg, routes, sample, server;

  pkg = require('./package.json');

  http = require("http");

  express = require("express");

  ghost = require('./node_modules/ghost/core/index.js');

  config = require("./server/config/config.example.js");

  process.env.NODE_ENV = config.env;

  app = express();

  server = http.createServer(app);

  ghost(app);

  logger = require("morgan");

  cookieParser = require("cookie-parser");

  bodyParser = require("body-parser");

  methodOverride = require("method-override");

  errorHandler = require("errorhandler");

  assetsVersion = pkg.version;

  app.use(function(req, res, next) {
    res.locals.assetsVersion = assetsVersion;
    return next();
  });

  app.use(logger());

  app.use(cookieParser());

  app.use(bodyParser());

  app.use(methodOverride());

  app.set("env", config.env);

  app.set("views", __dirname + "/server/views");

  app.set("view engine", "jade");

  if (app.settings.env === "production") {
    app.use(errorHandler());
    app.enable("trust proxy");
    app.locals.pretty = false;
  }

  if (app.settings.env === "development") {
    app.use(express["static"](__dirname + "/static"));
    app.use(errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    app.locals.pretty = true;
  }

  sample = require("./server/controllers/SampleController.js");

  routes = require("./server/routes/sample.js");

  routes(app);

  app.get("*", sample.error);

  server.listen(config.port);

  if (config.is_prod) {
    console.log("Server started on port " + config.port + " in " + app.settings.env + " mode");
  } else {
    console.log("Server started on port " + config.port + " in " + app.settings.env + " mode");
  }

}).call(this);
