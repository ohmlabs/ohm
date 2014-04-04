var config = require("../config/config.js")

exports.index = function(req, res){
  res.render('index', {
    title:'Node.js Boilerplate',
    dependencies: {
      d3: true,
      jquery: true,
      underscore: true,
      skrollr: false,
      socketio: false,
      gmaps: false,
      ga: config.GOOGLE_ANALYTICS,
    }
  });
};
exports.error = function(req, res){
  res.render('404', {title: 'Page Not Found' });
};
