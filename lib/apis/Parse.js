(function() {
  'use strict';

  /**
   * Parse.js
   *
   * @module Parse
   * @requires parse
   */
  const parse = require('parse/node').Parse;

  /**
   * Configure Parse
   * @param {string} config.PARSE_APPLICATION_ID app id
   * @param {string} config.PARSE_JAVASCRIPT_KEY javascript key
   * @param {string} config.PARSE_MASTER_KEY master key
   */
  function Parse(config) {
    parse.initialize(
      config.PARSE_APPLICATION_ID,
      config.PARSE_JAVASCRIPT_KEY,
      config.PARSE_MASTER_KEY
    );

    parse.serverUrl = config.PARSE_SERVER_URL;

    return parse;
  }

  module.exports = Parse;
}());
