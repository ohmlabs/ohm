routes = require("./routes/site.js")
config = require("./config/config.js")

# Module Dependencies
http = require("http")
express = require("express")
app = express()
server = http.createServer(app)
io = require("socket.io")
nib = require("nib")
stylus = require("stylus")

compile = (str, path) ->
  stylus(str).set("filename", path).set("compress", true).use(nib()).import("nib")

# Middleware
app.configure ->
  # PRODUCTION
  if config.is_prod
    # tell express that its sitting behind a proxy (nginx)
    app.enable('trust proxy')
    app.use express.errorHandler()
    app.locals.pretty = false
  # DEVELOPMENT
  else
    app.use(express.static(__dirname + '/public'));
    app.use express.errorHandler(
      dumpExceptions: true
      showStack: true
    )
    app.locals.pretty = true
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.logger()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  # Stylus Middleware
  app.use stylus.middleware(
    src: __dirname + "/public"
    compile: compile
  )

# Routes
app.get "/", routes.index
# 404 
app.get "*", routes.error

# Listen
app.listen config.port
io = io.listen(server)
if config.is_prod
  console.log "Server started on port " + config.port + " in production mode"
else
  console.log "Server started on port " + config.port + " in development mode"
