var drake = require("../controllers/DrakeController.js");

module.exports = function (app) {
  app.get("/drake", drake.tumblr);
  app.get("/work", drake.work);
  app.get("/photos", drake.photos);
  app.get("/buckets", drake.buckets);
};
