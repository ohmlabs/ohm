var config = require("../config/drake.js");
var AWS = require('aws-sdk');

// Configure Amazon Web Services
AWS.config.update({accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY});

module.exports = AWS;
