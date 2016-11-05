(function() {
  'use strict';

  var _                    = require('underscore');
  var BaseSocketController = include('controllers/BaseSocketController.js');

  function HomeController() {
    BaseSocketController.apply(this, arguments);
  }

  _.extend(HomeController.prototype, BaseSocketController.prototype, {

    genResponse: function() {
      this.socket.emit('home', {});
    },

  });

  module.exports = HomeController;
}());
