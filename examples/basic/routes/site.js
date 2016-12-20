(function() {
  'use strict';

  var _    = require('underscore');
  var path = require('path');
  // This function means that
  //
  // > _new(String, "foo");
  //
  // is identical to the call
  //
  // > new String("foo");
  function _new(Cls) {
    return new(Cls.bind.apply(Cls, arguments))();
  }

  // Keep me alphabetized!!
  var GET = {
    '/example': '../controllers/ExampleController.js',
  };

  var POST = {};

  module.exports = function(app) {
    _.each(GET, function(controllerPath, route) {
      controllerPath = path.join(__dirname, controllerPath);
      app.get(route, _.partial(_new, require(controllerPath)));
    });

    _.each(POST, function(controllerPath, route) {
      controllerPath = path.join(__dirname, controllerPath);
      app.post(route, _.partial(_new, require(controllerPath)));
    });
  };
}());
