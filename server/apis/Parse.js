var config = require("../config/drake.js");
var Parse = require('parse').Parse;

// Initialize Parse
Parse.initialize(config.PARSE_APPLICATION_ID, config.PARSE_JAVASCRIPT_KEY, config.PARSE_MASTER_KEY);

module.exports = Parse;