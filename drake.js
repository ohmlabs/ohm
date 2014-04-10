(function() {
  var app, aws, config, express, http, io, parse, routes, sample, server;

  config = require("./server/config/config.js");

  routes = require("./server/routes/drake.js");

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

  io.on("connection", function(socket) {
    socket.emit('news', {
      hello: 'world'
    });
    socket.on("message", function(data) {
      console.log("received: " + JSON.stringify(data));
      socket.emit("news_response", {
        hello: "world"
      });
    });
    socket.on("geo", function(data) {
      var Locations, query;
      Locations = parse.Object.extend("locations");
      query = new parse.Query(Locations);
      return query.get(data.location.objectId, {
        success: function(location) {
          var point;
          point = new parse.GeoPoint({
            latitude: data.location.latLng.k,
            longitude: data.location.latLng.A
          });
          location.set("latLng", point);
          location.set("readable_address", data.location.readable_address);
          return location.save(null, {
            success: function(location) {
              console.log(location);
            },
            error: function(gameScore, error) {
              console.log("Failed to create new object, with error code: " + error.description);
            }
          });
        },
        error: function(object, error) {}
      });
    });
    socket.on("disconnect", function() {
      console.log("disconnected");
    });
  });

  require('strong-agent').profile();

  sample = require("./server/controllers/SampleController.js");

  routes(app);

  app.get("*", sample.error);

  server.listen(config.port);

  if (config.is_prod) {
    console.log("Server started on port " + config.port + " in production mode");
  } else {
    console.log("Server started on port " + config.port + " in development mode");
  }

}).call(this);
