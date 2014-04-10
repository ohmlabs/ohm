var drake = require("../controllers/DrakeController.js");
var sample = require("../controllers/SampleController.js");

module.exports = function (app) {
  app.get("/", sample.index);
  app.get("/drake", drake.tumblr);
  app.get("/work", drake.work);
  app.get("/photos", drake.photos);
  app.get("/buckets", drake.buckets);
};
