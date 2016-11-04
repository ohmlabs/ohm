(function() {
  'use strict';

  const config        = require('./sample/config/config.js');
  const Ohm           = require('./ohm/ohm.js');

  module.exports = new Ohm(config);
}());
