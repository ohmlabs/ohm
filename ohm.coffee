###*
* ohm.js 1.1.1
* For all details and documentation:
* http://ohm.fm
* @version    1.1.1
* @author     Cameron W. Drake
* @summary   Designed to make web application deployment as simple as possible, ohm is a spark for lightning fast deployment
* @copyright  Copyright (c) 2014 Ohm Labs
* @license    Licensed under the MIT license
*
* @requires HTTP
* @requires Express (logger, cookieParser, bodyParser, methodOverride, errorHandler)
* @requires Ghost
* @requires Socket.io
###
http = require("http")
express = require("express")
ghost = require('./node_modules/ghost/core/index.js')
config = require("./server/config/config.example.js")
# Set Environment Variable
process.env.NODE_ENV = config.env
app = express()
server = http.createServer(app)
ghost(app)
###*
@todo Implement Socket.io example
###
# io = require('socket.io').listen(server);
# ------------------
# Express Middleware
# ------------------
logger = require("morgan")
cookieParser = require("cookie-parser")
bodyParser = require("body-parser")
methodOverride = require("method-override")
errorHandler = require("errorhandler")
# ------------------
# Configuration
# ------------------
app.use logger()
app.use cookieParser()
app.use bodyParser()
app.use methodOverride()
app.set "env", config.env
app.set "views", __dirname + "/server/views"
app.set "view engine", "jade"
if app.settings.env == "production"
  app.use errorHandler()
  # tell express that its sitting behind a proxy (nginx)
  app.enable "trust proxy"
  app.locals.pretty = false
if app.settings.env == "development"
  app.use express.static(__dirname + "/static")
  app.use errorHandler(
    dumpExceptions: true
    showStack: true
  )
  app.locals.pretty = true
# ------------------
# Extras
# ------------------
# parse = require("./server/apis/Parse.js")
# aws = require("./server/apis/AWS.js")
# StrongOps see: http://docs.strongloop.com/display/DOC/Getting+started
# require('strong-agent').profile();
# ------------------
# Controllers
# ------------------
sample = require("./server/controllers/SampleController.js")
# ------------------
# Routes
# ------------------
routes = require("./server/routes/site.js")
routes(app)
# 404
app.get "*", sample.error
# ------------------
# Listen
# ------------------
server.listen config.port
if config.is_prod
  console.log "Server started on port " + config.port + " in " + app.settings.env + " mode"
else
  console.log "Server started on port " + config.port + " in " + app.settings.env + " mode"
