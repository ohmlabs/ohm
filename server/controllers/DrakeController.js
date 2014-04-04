var config = require("../config/config.js");
var aws = require("../apis/AWS.js");

module.exports = {
  tumblr: function(req, res){
    res.redirect('http://blog.drake.fm');
  },
  photos: function(req, res){
    res.redirect('http://camwes.500px.com');
  },
  work: function(req, res){
    res.redirect('http://camwes.prosite.com/');
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

