(function() {
  'use strict';

  var AWS, config;
  /**
   * AWS.js
   *
   * @module AWS
   * @requires aws-sdk
   */
  // FIXME
  config = include('sample/config/config.js');

  AWS    = require('aws-sdk');

  /**
   * Configure Amazon Web Services
   * @param {string} config.AWS_ACCESS_KEY access key
   * @param {string} config.AWS_SECRET_KEY secret key
   */
  AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY
  });

  module.exports = AWS;
}());
