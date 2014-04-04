var config = require("../config/config.js");

exports.index = function(req, res){
  res.render('ohmlabs', {
    title: "Ohm Labs Inc",
    dependencies: {
      d3: true,
      jquery: true,
      underscore: true,
      skrollr: true,
      socketio: true,
      gmaps: config.GOOGLE_MAPS_KEY,
      ga: config.GOOGLE_ANALYTICS,
    }
  });
};

