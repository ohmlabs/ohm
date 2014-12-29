var lightbox   = require("../controllers/LightboxController.js");
module.exports = function(app) {
  // Instagram Authorization
  app.get("/authorize_user", lightbox.auhorizeInstaUser);
  // Instagram redirect URI
  app.get("/handle_auth", lightbox.handleInstaAuth);
  // Get Feed
  app.get("/instafeed/:next?", lightbox.getInstagramFeed);
  // Fetch Instagram Photos
  app.get("/instagram/:user/:next?", lightbox.getInstagram);
  // Add New Hottie
  app.get("/like/:media", lightbox.likeInstagramPhoto);
  // Fetch S3 Photos
  app.get("/s3/:bucketname", lightbox.getBuckets);
};
