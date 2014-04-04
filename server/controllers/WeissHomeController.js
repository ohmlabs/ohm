var config = require("../config/config.js");
var io = require('socket.io');
var aws = require("../apis/AWS.js");
var Locations = require("../models/Locations.js");
var BodyParts = require("../models/BodyParts.js");

var s3 = new aws.S3();
s3.listBuckets(function(err, data) {
  for (var index in data.Buckets) {
    var bucket = data.Buckets[index];
    var  name = bucket.Name;
    s3.listObjects({"Bucket": bucket.Name, "MaxKeys": 1}, function(err, data){
      console.log(data.Contents);
    });
    console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
  }
});

exports.home = function(req, res){
  res.render('weiss', {
    locations: Locations,
    bodyparts: BodyParts,
    title: "Weiss Orthopaedics",
    dependencies: {
      d3: true,
      jquery: false,
      underscore: true,
      skrollr: true,
      socketio: true,
      gmaps: config.GOOGLE_MAPS_KEY,
      ga: config.GOOGLE_ANALYTICS,
    }
  });
};
