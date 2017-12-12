(function() {
  'use strict';

  const config        = require('./config/config.js');
  const Ohm           = require('../../dist/ohm');

  let server = new Ohm(config);
  module.exports = server;
}());
