var Parse = require("../apis/Parse.js");

var clients = [];
var Clients = Parse.Object.extend("clients");
var query = new Parse.Query(Clients);
query.find({
  success: function(results) {
    for (var i = 0; i < results.length; i++) {
      clients[i] = results[i].attributes;
      clients[i].objectId = results[i].id;
      console.log(clients[i].name);
    }
  },
  error: function(){
    console.log('Something Went Wrong');
  }
});
module.exports = clients;