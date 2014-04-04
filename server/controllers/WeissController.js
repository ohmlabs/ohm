var io = require('socket.io');
var config = require("../config/config.js");
var Locations = require("../models/Locations.js");
var BodyParts = require("../models/BodyParts.js");

exports.home = function(req, res){
  res.render('weiss', {
    locations: Locations,
    bodyparts: BodyParts,
    title: "Weiss Orthopaedics",
    dependencies: {
      d3: true,
      jquery: false,
      underscore: true,
      skrollr: true,
      socketio: true,
      gmaps: config.GOOGLE_MAPS_KEY,
      ga: config.GOOGLE_ANALYTICS,
    }
  });
};
