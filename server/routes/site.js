var sample = require("../controllers/SampleController.js");

module.exports = function (app) {
  app.get("/", sample.index);
};
