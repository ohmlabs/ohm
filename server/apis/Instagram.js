var ig, config;
/**
 * Instagram.js
 *
 * @module Instagram
 * @requires instagram-node
 */
config = require("../config/config.example.js");
ig     = require("instagram-node").instagram();

/**
 * Configure Instagram Node
 * @param {string} config.IG_CLIENT_ID client id
 * @param {string} config.IG_CLIENT_SECRET client secret
 */
ig.use({
  client_id: config.IG_CLIENT_ID,
  client_secret: config.IG_CLIENT_SECRET,
});

module.exports = ig;