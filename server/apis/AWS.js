AWS = require('aws-sdk')
// Configure AWS
/*AWS.config.loadFromPath('./server/config/config.json');

var s3 = new AWS.S3();
s3.listBuckets(function(err, data) {
  for (var index in data.Buckets) {
    var bucket = data.Buckets[index];
    var  name = bucket.Name;
    s3.listObjects({"Bucket": bucket.Name, "MaxKeys": 10}, function(err, data){
      console.log(data.Contents);
    });
    console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
  }
});*/