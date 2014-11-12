pkg                   = require('./package.json')
config                = require("./server/config/config.example.js")
path                  = require("path")
http                  = require("http")
express               = require("express")
ghost                 = require("ghost")
# Express Middleware
logger                = require("morgan")
cookieParser          = require("cookie-parser")
bodyParser            = require("body-parser")
methodOverride        = require("method-override")
errorHandler          = require("errorhandler")
# ------------------
# Controllers
# ------------------
sample                = require("./server/controllers/SampleController.js")
# ------------------
# Routes
# ------------------
routes                = require("./server/routes/sample.js")
# Set Environment Variable
process.env.NODE_ENV  = config.env
# Set assets version
assetsVersion         = pkg.version
parentApp             = express()
parentApp.use "/blog", require('./server/ghost/ghostMiddleware')
# ------------------
# Express Configuration
# ------------------
parentApp.use logger("dev")
parentApp.use cookieParser()
parentApp.use bodyParser.json()
parentApp.use methodOverride()
# expose assets version to client
parentApp.use (req, res, next) ->
  res.locals.assetsVersion = assetsVersion
  next()
parentApp.set "env", config.env
parentApp.set "views", __dirname + "/server/views"
parentApp.set "view engine", "jade"
if parentApp.settings.env == "production"
  parentApp.use errorHandler()
  # tell express that its sitting behind a proxy (nginx)
  parentApp.enable "trust proxy"
  parentApp.locals.pretty = false
if parentApp.settings.env == "development"
  parentApp.use express.static(__dirname + "/static")
  parentApp.use errorHandler(
    dumpExceptions: true
    showStack: true
  )
  parentApp.locals.pretty = true
routes(parentApp)
parentApp.get "*", sample.error
# ------------------
# Listen
# ------------------
parentApp.listen config.port
if config.is_prod
  console.log "Server started on port " + config.port + " in " + parentApp.settings.env + " mode"
else
  console.log "Server started on port " + config.port + " in " + parentApp.settings.env + " mode"
