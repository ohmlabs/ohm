var config = require("../config/config.example.js")

exports.index = function(req, res) {
  res.render('sample', {
    title: 'Node.js Boilerplate',
    dependencies: {
      modernizr: true,
      d3: true,
      jquery: true,
      underscore: true,
      skrollr: false,
      socketio: false,
      hammer: true,
      gmaps: config.GOOGLE_MAPS_KEY,
      ga: config.GOOGLE_ANALYTICS,
      assetsVersion: res.locals.assetsVersion,
    }
  });
};
exports.error = function(req, res) {
  res.render('404', {
    title: 'Page Not Found'
  });
};
