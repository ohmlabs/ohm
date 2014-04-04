# You need to copy config/config.example.js to config/config.js
config = require("./server/config/config.js")
routes = require("./server/routes/index.js")
################
# Dependencies
################
http = require("http")
express = require("express")
app = express()
server = http.createServer(app)
io = require('socket.io').listen(server);
################
# APIS
################
parse = require("./server/apis/Parse.js")
aws = require("./server/apis/AWS.js")
################
# Configuration
################
app.set "env", config.env
app.configure "production", ->
  app.use express.errorHandler()
  # tell express that its sitting behind a proxy (nginx)
  app.enable "trust proxy"
  app.locals.pretty = false

app.configure "development", ->
  app.use express.static(__dirname + "/static")
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )
  app.locals.pretty = true

app.configure ->
  app.set "views", __dirname + "/server/views"
  app.set "view engine", "jade"
  app.use express.logger()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
################
# Sockets
################
io.on "connection", (socket) ->
  socket.emit('news', { hello: 'world' })
  socket.on "message", (data) ->
    console.log "received: " + JSON.stringify(data)
    socket.emit "news_response",
      hello: "world"
    return
  socket.on "geo", (data) ->
    Locations = parse.Object.extend("locations")
    query = new parse.Query(Locations)
    query.get data.location.objectId,
      success: (location) ->
        point = new parse.GeoPoint({latitude: data.location.latLng.k, longitude: data.location.latLng.A});
        location.set "latLng", point
        location.set "readable_address", data.location.readable_address
        location.save null,
          success: (location) ->
            console.log location
            return
          error: (gameScore, error) ->
            console.log "Failed to create new object, with error code: " + error.description
            return
      # The object was retrieved successfully.
      error: (object, error) ->
        # The object was not retrieved successfully.
        # error is a Parse.Error with an error code and description.
  socket.on "disconnect", ->
    console.log "disconnected"
    return
  return
################
# Extras
################
# StrongOps see: http://docs.strongloop.com/display/DOC/Getting+started
require('strong-agent').profile();
################
# Routes
################
# import routes
sample = require("./server/controllers/SampleController.js")
routes.site(app)
routes.weiss(app)
routes.ohm(app)
routes.drake(app)
# 404
app.get "*", sample.error
################
# Listen
################
server.listen config.port
if config.is_prod
  console.log "Server started on port " + config.port + " in production mode"
else
  console.log "Server started on port " + config.port + " in development mode"
