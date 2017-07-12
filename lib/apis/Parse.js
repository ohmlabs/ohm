(function() {
  'use strict';

  /**
   * Parse.js
   *
   * @module Parse
   * @requires parse
   */
  let parse = require('parse/node').Parse;
  /**
   * Configure Parse
   * @param {string} config.PARSE_APPLICATION_ID app id
   * @param {string} config.PARSE_JAVASCRIPT_KEY javascript key
   * @param {string} config.PARSE_MASTER_KEY master key
   */
  parse.initialize();

  module.exports = parse;
}());
