(function() {
  var app, aws, config, express, http, io, parse, routes, sample, server;

  config = require("./server/config/config.js");

  routes = require("./server/routes/index.js");

  http = require("http");

  express = require("express");

  app = express();

  server = http.createServer(app);

  io = require('socket.io').listen(server);

  parse = require("./server/apis/Parse.js");

  aws = require("./server/apis/AWS.js");

  app.set("env", config.env);

  app.configure("production", function() {
    app.use(express.errorHandler());
    app.enable("trust proxy");
    return app.locals.pretty = false;
  });

  app.configure("development", function() {
    app.use(express["static"](__dirname + "/static"));
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    return app.locals.pretty = true;
  });

  app.configure(function() {
    app.set("views", __dirname + "/server/views");
    app.set("view engine", "jade");
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    return app.use(app.router);
  });

  sample = require("./server/controllers/SampleController.js");

  routes.site(app);

  app.get("*", sample.error);

  server.listen(config.port);

  if (config.is_prod) {
    console.log("Server started on port " + config.port + " in production mode");
  } else {
    console.log("Server started on port " + config.port + " in development mode");
  }

}).call(this);
