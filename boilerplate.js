(function() {
  var app, aws, bodyParser, config, cookieParser, errorHandler, express, ghost, http, io, logger, methodOverride, parse, routes, sample, server;

  config = require("./server/config/config.js");

  process.env.NODE_ENV = config.env;

  ghost = require('./ghost/core/index.js');

  http = require("http");

  express = require("express");

  app = express();

  server = http.createServer(app);

  io = require('socket.io').listen(server);

  ghost(app);

  logger = require("morgan");

  cookieParser = require("cookie-parser");

  bodyParser = require("body-parser");

  methodOverride = require("method-override");

  errorHandler = require("errorhandler");

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

  parse = require("./server/apis/Parse.js");

  aws = require("./server/apis/AWS.js");

  routes = require("./server/routes/site.js");

  sample = require("./server/controllers/SampleController.js");

  routes(app);

  app.get("*", sample.error);

  server.listen(config.port);

  if (config.is_prod) {
    console.log("Server started on port " + config.port + " in " + app.settings.env + " mode");
  } else {
    console.log("Server started on port " + config.port + " in " + app.settings.env + " mode");
  }

}).call(this);
