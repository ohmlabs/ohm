# Module Dependencies
express = require("express")
routes = require("./routes/site.js")
config = require("./config/config.js")
nib = require("nib")
stylus = require("stylus")
app = express()

compile = (str, path) ->
  stylus(str).set("filename", path).set("compress", true).use(nib()).import("nib")

# Middleware
app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.logger()
  app.use stylus.middleware(
    src: __dirname + "/public"
    compile: compile
  )
  # tell express that its sitting behind a proxy (nginx)
  app.enable('trust proxy')
  # if you are using nginx to proxy static files we don't need this, comment it out
  app.use express.static(__dirname + "/public")
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router

# DEVELOPMENT 
app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )
  app.locals.pretty = true
  
# PRODUCTION 
app.configure "production", ->
  app.use express.errorHandler()
  app.locals.pretty = false

# Routes
app.get "/", routes.index

# 404 
app.get "*", routes.error

# Listen
app.listen config.port
console.log "Server started on port " + config.port + " in " + app.get('env') + " mode"