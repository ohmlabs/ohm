(function() {
  'use strict';

  const config        = require('./sample/config/config.js');
  const pkg           = require('./package.json');
  const assetsVersion = pkg.version;
  const Ohm           = require('./ohm/ohm.js');

  module.exports = new Ohm(config, '../sample/routes/site.js', '../sample/routes/sockets.js', assetsVersion);
}());
