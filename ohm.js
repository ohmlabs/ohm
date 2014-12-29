(function() {
  var assetsVersion, bodyParser, config, cookieParser, errorHandler, express, ghost, http, lightbox, logger, methodOverride, parentApp, path, pkg, routes, sample;

  pkg = require('./package.json');

  config = require("./server/config/config.example.js");

  ghost = require('./server/ghost/ghostMiddleware');

  path = require("path");

  http = require("http");

  express = require("express");

  logger = require("morgan");

  cookieParser = require("cookie-parser");

  bodyParser = require("body-parser");

  methodOverride = require("method-override");

  errorHandler = require("errorhandler");

  process.env.NODE_ENV = config.env;

  assetsVersion = pkg.version;

  parentApp = express();

  sample = require("./server/controllers/SampleController.js");

  lightbox = require("./server/routes/lightbox.js");

  routes = require("./server/routes/sample.js");

  parentApp.use("/blog", ghost({
    config: path.join(__dirname, "/server/ghost/config.js")
  }));

  parentApp.use(logger("dev"));

  parentApp.use(cookieParser());

  parentApp.use(bodyParser.json());

  parentApp.use(methodOverride());

  parentApp.use(function(req, res, next) {
    res.locals.assetsVersion = assetsVersion;
    return next();
  });

  parentApp.set("env", config.env);

  parentApp.set("views", __dirname + "/server/views");

  parentApp.set("view engine", "jade");

  if (parentApp.settings.env === "production") {
    parentApp.use(errorHandler());
    parentApp.enable("trust proxy");
    parentApp.locals.pretty = false;
  }

  if (parentApp.settings.env === "development") {
    require('longjohn');
    parentApp.use(express["static"](__dirname + "/static"));
    parentApp.use(errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    parentApp.locals.pretty = true;
  }

  routes(parentApp);

  lightbox(parentApp);

  parentApp.get("*", sample.error);

  parentApp.listen(config.port);

  if (config.is_prod) {
    console.log("Server started on port " + config.port + " in " + parentApp.settings.env + " mode");
  } else {
    console.log("Server started on port " + config.port + " in " + parentApp.settings.env + " mode");
  }

}).call(this);
