var Parse, config;
/**
 * Parse.js
 *
 * @module Parse
 * @requires parse
 */
config = require("../config/config.example.js");
Parse  = require('parse').Parse;

/**
 * Configure Instagram Parse
 * @param {string} config.PARSE_APPLICATION_ID app id
 * @param {string} config.PARSE_JAVASCRIPT_KEY javascript key
 * @param {string} config.PARSE_MASTER_KEY master key
 */
Parse.initialize(config.PARSE_APPLICATION_ID, config.PARSE_JAVASCRIPT_KEY, config.PARSE_MASTER_KEY);

module.exports = Parse;
