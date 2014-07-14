var Parse = require("../apis/Parse.js");

var hotties = [];
var Hotties = Parse.Object.extend("models");
var query = new Parse.Query(Hotties);
query.ascending("rank");
query.find({
  success: function(results) {
    for (var i = 0; i < results.length; i++) {
      hotties[i] = results[i].attributes;
      hotties[i].objectId = results[i].id;
      console.log(hotties[i].displayName);
    }
  },
  error: function(){
    console.log('Something Went Wrong');
  }
});
module.exports = hotties;