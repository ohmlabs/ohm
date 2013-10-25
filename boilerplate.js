(function() {
  var app, config, express, http, io, routes, server;

  routes = require("./server/routes/site.js");

  config = require("./server/config/config.js");

  http = require("http");

  express = require("express");

  app = express();

  server = http.createServer(app);

  io = require("socket.io");

  app.configure(function() {
    if (config.is_prod) {
      app.enable('trust proxy');
      app.use(express.errorHandler());
      app.locals.pretty = false;
    } else {
      app.use(express["static"](__dirname + '/static'));
      app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
      app.locals.pretty = true;
    }
    app.set("views", __dirname + "/server/views");
    app.set("view engine", "jade");
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    return app.use(app.router);
  });

  app.get("/", routes.index);

  app.get("*", routes.error);

  app.listen(config.port);

  io = io.listen(server);

  if (config.is_prod) {
    console.log("Server started on port " + config.port + " in production mode");
  } else {
    console.log("Server started on port " + config.port + " in development mode");
  }

}).call(this);
