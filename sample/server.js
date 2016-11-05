(function() {
  'use strict';

  const config        = require('./config/config.js');
  const Ohm           = require('ohm');

  module.exports = new Ohm(config);
}());
