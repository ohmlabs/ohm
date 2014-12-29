pkg                   = require('./package.json')
config                = require("./server/config/config.example.js")
ghost                 = require( './server/ghost/ghostMiddleware' )
path                  = require("path")
http                  = require("http")
express               = require("express")
# Express Middleware
logger                = require("morgan")
cookieParser          = require("cookie-parser")
bodyParser            = require("body-parser")
methodOverride        = require("method-override")
errorHandler          = require("errorhandler")
# Set Environment Variable
process.env.NODE_ENV  = config.env
# Set assets version
assetsVersion         = pkg.version
parentApp             = express()
# ------------------
# Controllers
# ------------------
sample                = require("./server/controllers/SampleController.js")
# ------------------
# Routes
# ------------------
lightbox              = require("./server/routes/lightbox.js")
routes                = require("./server/routes/sample.js")
parentApp.use "/blog",  ghost({config: path.join(__dirname, "/server/ghost/config.js")})
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
  require('longjohn')
  parentApp.use express.static(__dirname + "/static")
  parentApp.use errorHandler(
    dumpExceptions: true
    showStack: true
  )
  parentApp.locals.pretty = true
routes(parentApp)
lightbox(parentApp)
# 404
parentApp.get "*", sample.error
# ------------------
# Listen
# ------------------
parentApp.listen config.port
if config.is_prod
  console.log "Server started on port " + config.port + " in " + parentApp.settings.env + " mode"
else
  console.log "Server started on port " + config.port + " in " + parentApp.settings.env + " mode"
