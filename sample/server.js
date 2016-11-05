(function() {
  'use strict';

  const Ohm     = require('../lib/ohm.js');
  const config  = require('./config/config.js');

  module.exports = new Ohm(config);
}());
