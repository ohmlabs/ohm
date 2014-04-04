var weiss = require("../controllers/WeissController.js");

module.exports = function (app) {
  app.get("/weiss", weiss.home);
};
