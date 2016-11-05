(function() {
  'use strict';

  const config        = require('./config/config.js');
  const Ohm           = require('../../lib/ohm');

  module.exports = new Ohm(config);
}());
