(function() {
  'use strict';

  var _ = require('underscore');
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
    '/sample': 'sample/controllers/SampleController.js',
  };

  var POST = {};

  module.exports = function(app) {
    _.each(GET, function(controllerPath, route) {
      app.get(route, _.partial(_new, include(controllerPath)));
    });

    _.each(POST, function(controllerPath, route) {
      app.post(route, _.partial(_new, include(controllerPath)));
    });
  };
}());
