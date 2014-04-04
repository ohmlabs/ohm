var Parse = require("../apis/Parse.js");

var bodyparts = [];
var Anatomy = Parse.Object.extend("Anatomy");
var query = new Parse.Query(Anatomy);
query.find({
  success: function(results) {
    for (var i = 0; i < results.length; i++) {
      bodyparts[i] = results[i].attributes;
      bodyparts[i].objectId = results[i].id;
    }
  },
  error: function(){
    console.log('Something Went Wrong');
  }
});
module.exports = bodyparts;