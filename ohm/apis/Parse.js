(function() {
  'use strict';

  var Parse, config;
  /**
   * Parse.js
   *
   * @module Parse
   * @requires parse
   */
  config = include('sample/config/config.js');

  Parse  = require('parse/node').Parse;

  /**
   * Configure Parse
   * @param {string} config.PARSE_APPLICATION_ID app id
   * @param {string} config.PARSE_JAVASCRIPT_KEY javascript key
   * @param {string} config.PARSE_MASTER_KEY master key
   */
  Parse.initialize(
    config.PARSE_APPLICATION_ID,
    config.PARSE_JAVASCRIPT_KEY,
    config.PARSE_MASTER_KEY
  );

  Parse.serverUrl = config.PARSE_SERVER_URL;

  module.exports = Parse;
}());
