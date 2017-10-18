(function() {
  'use strict';

  const config        = require('./config/config.js');
  const Ohm           = require('../../lib/ohm');

  let server = new Ohm(config);
  module.exports = server;
}());
