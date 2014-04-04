var Parse = require("../apis/Parse.js");

var locations = [];
var Locations = Parse.Object.extend("locations");
var query = new Parse.Query(Locations);
query.find({
  success: function(results) {
    for (var i = 0; i < results.length; i++) {
      locations[i] = results[i].attributes;
      locations[i].objectId = results[i].id;
      locations[i].readable_address = results[i].attributes.address1 + ', ' + results[i].attributes.city + ', ' + results[i].attributes.state + ' ' + results[i].attributes.zip;
      console.log(locations[i].readable_address);
    }
  },
  error: function(){
    console.log('Something Went Wrong');
  }
});
module.exports = locations;