var ohm = require("../controllers/OhmController.js");

module.exports = function (app) {
  app.get('/ohm', ohm.index);
};
