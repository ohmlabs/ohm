var config = require("../config/drake.js");
var aws = require("../apis/AWS.js");
var Clients = require("../models/Clients.js");
var Hotties = require("../models/Hotties.js");

module.exports = {
  index: function(req, res){
    res.render('drake', {
      title:'Cameron W. Drake',
      clients: Clients,
      dependencies: {
        d3: true,
        jquery: false,
        underscore: true,
        skrollr: false,
        socketio: false,
        gmaps: config.GOOGLE_MAPS_KEY,
        ga: config.GOOGLE_ANALYTICS,
      }
    });
    console.log(config.GOOGLE_MAPS_KEY);
  },
  noblebachelor: function(req, res){
    res.render('hotties', {
      title:'100 Hottest Women of Social Media',
      hotties: Hotties,
      dependencies: {
        d3: true,
        jquery: false,
        underscore: true,
        skrollr: false,
        socketio: false,
        gmaps: config.GOOGLE_MAPS_KEY,
        ga: config.GOOGLE_ANALYTICS,
      }
    });
    console.log(config.GOOGLE_MAPS_KEY);
  },
  blog: function(req, res){
    res.redirect('http://blog.drake.fm');
  },
  photos: function(req, res){
    res.redirect('http://500px.com/camwes');
  },
  work: function(req, res){
    res.redirect('http://work.drake.fm');
  },
  buckets: function(req, res){ // List Buckets
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
  },
}

