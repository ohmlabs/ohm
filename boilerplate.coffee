################
# Dependencies
################
config = require("./server/config/config.js")
# set environment variable
process.env.NODE_ENV = config.env
# import ghost for CMS
ghost = require('./ghost/core/index.js')
http = require("http")
express = require("express")
app = express()
server = http.createServer(app)
# require socket.io
io = require('socket.io').listen(server);
# start ghost
ghost(app)
################
# Express Middleware
################
logger = require("morgan")
cookieParser = require("cookie-parser")
bodyParser = require("body-parser")
methodOverride = require("method-override")
errorHandler = require("errorhandler")
################
# Configuration
################
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
################
# APIS
################
parse = require("./server/apis/Parse.js")
aws = require("./server/apis/AWS.js")
################
# Extras
################
# StrongOps see: http://docs.strongloop.com/display/DOC/Getting+started
# require('strong-agent').profile();
################
# Routes
################
routes = require("./server/routes/site.js")
sample = require("./server/controllers/SampleController.js")
routes(app)
# 404
app.get "*", sample.error
################
# Listen
################
server.listen config.port
if config.is_prod
  console.log "Server started on port " + config.port + " in " + app.settings.env + " mode"
else
  console.log "Server started on port " + config.port + " in " + app.settings.env + " mode"
