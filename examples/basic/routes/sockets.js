(function() {
  'use strict';

  var _    = require('lodash');
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
  var ON = {
    'home': '../controllers/Home.socket.controller.js'
  };

  module.exports = function(io, app) {
    io.sockets.on('connection', function(socket) {
      _.each(ON, function(controller, socketMsg) {
        controller = path.join(__dirname, controller);
        socket.on(
          socketMsg,
          _.partial(_new, require(controller), app.locals.config, socketMsg, socket)
        );
      });
    });
  };
}());
