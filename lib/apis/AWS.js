(function() {
  'use strict';

  /**
   * AWS.js
   *
   * @module AWS
   * @requires aws-sdk
   */
  const aws = require('aws-sdk');

  /**
   * Configure Amazon Web Services
   * @param {string} config.AWS_ACCESS_KEY access key
   * @param {string} config.AWS_SECRET_KEY secret key
   */
  function AWS (config) {
    aws.config.update({
      accessKeyId: config.AWS_ACCESS_KEY,
      secretAccessKey: config.AWS_SECRET_KEY
    });
    return aws;
  }

  module.exports = AWS;
}());
