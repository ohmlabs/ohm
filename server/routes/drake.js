var drake = require("../controllers/DrakeController.js");

module.exports = function (app) {
  app.get("/", drake.index);
  app.get("/nb", drake.noblebachelor);
  app.get("/blog", drake.blog);
  app.get("/work", drake.work);
  app.get("/photos", drake.photos);
  app.get("/buckets", drake.buckets);
};
